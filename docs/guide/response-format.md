# Response format

Every JSON response uses the same envelope:

```json
{
  "status_code": 200,
  "success": true,
  "message": "OTP sent to your Aadhaar registered mobile number ending with ******1234",
  "data": [
    { "txnId": "a1b2c3d4-...", "attempts": 1, "remaining_attempts": 2 }
  ]
}
```

| Field | Type | Meaning |
|---|---|---|
| `status_code` | number | **The real result of the call.** `200`/`201` = success. |
| `success` | boolean | `true` when `status_code` is 200 or 201. |
| `message` | string | Message you can show to the user, including ABDM's error text when ABDM rejects a request. |
| `data` | array | The result. It's always an array, and the payload is almost always in `data[0]`. |

::: danger Check status_code in the body
The connector often returns **HTTP 200 even when the operation failed**, and puts the real result in the body's `status_code` (for example `400`, `401`, `422`). Always check the body:

```js
const body = await res.json()
if (body.status_code !== 200) throw new Error(body.message)
const result = body.data[0]
```
:::

## Common `status_code` values

| Code | Meaning | What to do |
|---|---|---|
| `200` / `201` | Success | Read `data[0]`. |
| `400` | ABDM rejected the request (invalid Aadhaar, wrong OTP, expired `txnId`…) | Show `message` to the user. Request a new OTP if the transaction expired. |
| `401` | Access token missing or expired | [Refresh the token](/guide/authentication#refresh-a-token) and retry once. |
| `403` | Your user lacks permission for this action | Check the role assigned to your account. |
| `429` | 3 OTP requests already made for this identifier in the last 24 hours | Wait before trying again. Use `remaining_attempts` to warn users ahead of time. |
| `440` | Session timed out | Log the user in again. |
| `500` | Connector or ABDM gateway error | Retry later. Contact support if the error continues. |

## Binary responses

The [ABHA card](/m1/abha-card) endpoint returns an **image** (`image/png` or `image/jpeg`) when it succeeds and the JSON envelope when it fails. Check `Content-Type` before you parse the response.

## Transaction IDs

Most M1 flows take several steps. Each step returns a `txnId` that you **must pass to the next step** as `txn_id`. Transaction IDs are short-lived (ABDM expires them after about 10 minutes). If one expires, restart the flow from its first step.
