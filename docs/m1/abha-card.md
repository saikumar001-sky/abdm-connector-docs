# ABHA card

Download the patient's ABHA card as an image so you can show, print or share it.

<EndpointBadge method="GET" path="/abha/M1/abha-number/card" />

| Parameter | Required | Description |
|---|---|---|
| `aadhaar_number` | one of | Use after [creating](/m1/create-aadhaar-otp) an ABHA |
| `abha_number` | one of | Use after [verifying](/m1/verify-abha) an ABHA |
| `login_token` | recommended | ABHA user token from the create/verify step. Without it, the connector uses the patient's stored token. |

**Response:** an **image** when it succeeds, or the JSON envelope when it fails. Check `Content-Type`:

```js
const res = await fetch(`${BASE}/abha/M1/abha-number/card?${new URLSearchParams({
  abha_number, login_token,
})}`, { headers: { Authorization: `Bearer ${accessToken}` } })

const type = res.headers.get('content-type') || ''
if (type.includes('application/json')) {
  const body = await res.json()
  throw new Error(body.message || 'Download failed')
}
const blob = await res.blob()          // image/png or image/jpeg
img.src = URL.createObjectURL(blob)    // revoke it when you're done
```

<ApiPlayground
  method="GET"
  path="/abha/M1/abha-number/card"
  binary
  :params="[
    { name: 'abha_number', placeholder: '91-1234-5678-9012' },
    { name: 'aadhaar_number', placeholder: 'or 12-digit Aadhaar' },
    { name: 'login_token', placeholder: 'ABHA user token' },
  ]"
/>

::: tip Token expiry
ABHA user tokens are short-lived. If the card download fails with an authentication message, do the [verify flow](/m1/verify-abha) again to get a fresh token.
:::
