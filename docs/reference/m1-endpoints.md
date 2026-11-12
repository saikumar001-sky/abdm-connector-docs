# M1 endpoint reference

Every endpoint needs `Authorization: Bearer <access_token>` and returns the [standard envelope](/guide/response-format). Paths are relative to the base URL. **Q** = query parameter, **B** = JSON body, **P** = path parameter. Required parameters are in **bold**.

## Consent

| Method | Path | Parameters | Guide |
|---|---|---|---|
| GET | `/abha/consent/points/{form_code}` | **form_code** (P), **patient_id** (Q) | [Consent](/m1/consent) |
| POST | `/abha/consent/submit` | **patient_id**, **consent_form_id**, **responses[]** (B) | [Consent](/m1/consent) |
| PUT | `/abha/consent/update/{consent_id}` | **consent_id** (P), same body as submit | [Consent](/m1/consent) |
| GET | `/abha/consent/patient/{patient_id}` | **patient_id** (P) | [Consent](/m1/consent) |

## Create ABHA

| Method | Path | Parameters | Guide |
|---|---|---|---|
| POST | `/abha/M1/create-abha-otp` | **aadhaar_number**, patient_id (Q) | [Step 1](/m1/create-aadhaar-otp#step-1) |
| POST | `/abha/M1/create-abha` | **otp**, **txn_id**, mobile_number (Q) | [Step 2](/m1/create-aadhaar-otp#step-2) |
| POST | `/abha/M1/verify-enrollment-mobile-otp` | **otp**, **txn_id**, mobile_number (Q) | [Step 3](/m1/create-aadhaar-otp#step-3) |
| POST | `/abha/M1/enroll-mobile-otp` | **aadhaar_number**, **mobile_number** (Q) | [Step 3](/m1/create-aadhaar-otp#step-3) |
| GET | `/abha/M1/get-suggestions` | **txn_id** (Q) | [Step 4](/m1/create-aadhaar-otp#step-4) |
| POST | `/abha/M1/create-abha-suggetion` | **txn_id**, **suggested_abha_id**, patient_id, full_name, dob, gender (Q) | [Step 5](/m1/create-aadhaar-otp#step-5) |
| POST | `/abha/M1/create-abha-biometric` | **aadhaar_number**, **mobile_number**, **pid** (B) | [Biometric](/m1/create-biometric) |

## Verify existing ABHA

| Method | Path | Parameters | Guide |
|---|---|---|---|
| POST | `/abha/M1/validate-abha` | **aadhaar_number** (Q) | [By Aadhaar](/m1/verify-abha#by-aadhaar) |
| POST | `/abha/M1/verify-abha` | **otp**, **txn_id** (Q) | [Verify OTP](/m1/verify-abha#verify-otp) |
| POST | `/abha/M1/abha-number/request-otp` | **abha_number**, otp_method (Q) | [By ABHA number](/m1/verify-abha#by-abha-number) |
| POST | `/abha/M1/abha-address/request-otp` | **abha_address**, **otp_method** (Q) | [By ABHA address](/m1/verify-abha#by-abha-address) |
| POST | `/abha/M1/abha-address/verify-otp` | **otp**, **txn_id**, otp_method, patient_id (Q) | [By ABHA address](/m1/verify-abha#by-abha-address) |
| POST | `/abha/M1/search-abha-by-mobile` | **mobile_number** (Q) | [By mobile](/m1/verify-abha#by-mobile) |
| POST | `/abha/M1/search-abha-generate-otp` | **index**, **txn_id** (Q) | [By mobile](/m1/verify-abha#by-mobile) |
| POST | `/abha/M1/search-abha-verify-otp` | **otp**, **txn_id** (Q) | [By mobile](/m1/verify-abha#by-mobile) |
| POST | `/abha/M1/validate-abha-biometric` | aadhaar_number *or* abha_number (B) | [Biometric](/m1/create-biometric#verify-an-existing-abha-with-biometric) |
| POST | `/abha/M1/verify-abha-biometric` | **txn_id**, **pid**, aadhaar_number *or* abha_number (B) | [Biometric](/m1/create-biometric#verify-an-existing-abha-with-biometric) |

## Link and manage

| Method | Path | Parameters | Guide |
|---|---|---|---|
| GET | `/abha/M1/verify-demographics` | **token**, **patient_id** (Q) | [Link](/m1/link-patient) |
| POST | `/abha/M1/update-abha` | **abha_number**, **abha_address**, **patient_id**, mobile_verified, full_name, dob, gender (Q) | [Link](/m1/link-patient) |
| POST | `/abha/M1/citizen/{citizen_id}/abha-addresses/set-preferred-abdm` | **citizen_id** (P), **abha_address**, login_token (Q) | [Link](/m1/link-patient) |
| GET | `/abha/M1/citizen/{citizen_id}/abha-addresses` | **citizen_id** (P) | [Link](/m1/link-patient) |
| GET | `/abha/M1/abha-number/card` | aadhaar_number *or* abha_number, login_token (Q). Returns an image. | [ABHA card](/m1/abha-card) |

## Authentication

| Method | Path | Parameters | Guide |
|---|---|---|---|
| POST | `/auth/login` | **user_name**, **password**, is_remember, force_login (B) | [Authentication](/guide/authentication) |
| POST | `/auth/refresh-token` | **token** (Q) | [Authentication](/guide/authentication#refresh-a-token) |
