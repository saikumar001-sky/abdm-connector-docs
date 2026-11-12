# Authentication

Every connector endpoint requires a JWT access token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

## Get a token

Log in with the credentials the connector team gave you.

<EndpointBadge method="POST" path="/auth/login" />

```json
{
  "user_name": "partner-app@example.com",
  "password": "********",
  "is_remember": false,
  "force_login": true
}
```

| Field | Required | Description |
|---|---|---|
| `user_name` | yes | Connector username |
| `password` | yes | Connector password |
| `is_remember` | no | Issue a longer-lived refresh token. Default `false`. |
| `force_login` | no | Default `true`: **any other active session for this user is ended.** Send `false` to get `status_code: 409` (`session_conflict`) instead. |

The response contains an `access_token` and a `refresh_token` in `data[0]`.

::: tip Use a dedicated integration account
Because login ends other sessions for the same user, don't share an account between your integration and people who sign in to the EHR. Ask for a separate account for each integrating system.
:::

::: warning Rate limit
`/auth/login` allows **10 requests per minute** per client, and repeated failures lock the account. Log in once, then reuse the token and refresh it. Don't log in for every request.
:::

## Refresh a token

When a call returns `status_code: 401` in the body, get a new access token with your refresh token, then retry the call once.

<EndpointBadge method="POST" path="/auth/refresh-token?token=<refresh_token>" />

```js
const res = await fetch(`${BASE}/auth/refresh-token?token=${encodeURIComponent(refreshToken)}`, {
  method: 'POST',
})
const { data } = await res.json()
const accessToken = data[0].access_token
```

If the refresh also fails, log in again.

### Recommended client pattern

If several requests fail at the same time, refresh the token only once and make the other requests wait for it:

```js
let refreshing = null

async function call(input, init = {}) {
  const send = () =>
    fetch(input, { ...init, headers: { ...init.headers, Authorization: `Bearer ${tokens.access}` } })

  let res = await send()
  let body = await res.clone().json().catch(() => null)

  if (body?.status_code === 401) {
    refreshing ??= refreshAccessToken().finally(() => (refreshing = null))
    await refreshing
    res = await send()
  }
  return res
}
```

## Session timeout

A body `status_code` of `440` means the user's session has expired. Ask the user to log in again.

## Keep credentials on your server

Call the connector from your **backend**, or from a frontend that gets tokens from your backend. Don't put connector usernames or passwords in a mobile app or a public web bundle.
