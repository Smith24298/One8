# Auth Service

## Responsibility

The Auth Service is responsible for:

- User Registration
- Login
- Logout
- Refresh Tokens
- Email Verification
- Forgot Password
- Reset Password
- JWT Generation
- JWT Validation
- Role Based Authorization

---

# APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout current session |
| POST | /api/auth/refresh-token | Generate new access token |
| POST | /api/auth/forgot-password | Send password reset email |
| POST | /api/auth/reset-password | Reset password |
| POST | /api/auth/verify-email | Verify email address |
| GET | /api/auth/profile | Current user profile |

---

# Workflow

## Register

```
Client

↓

POST /register

↓

Validate Request

↓

Email Exists?

↓

Hash Password

↓

Insert User

↓

Generate Verification Token

↓

Send Email

↓

Return Success
```

---

## Login

```
Client

↓

POST /login

↓

Find User

↓

Compare Password

↓

Generate Access Token

↓

Generate Refresh Token

↓

Store Refresh Token

↓

Return Tokens
```

---

## Logout

```
Client

↓

POST /logout

↓

Delete Refresh Token

↓

Return Success
```

Access Token remains valid until expiration.

---

## Refresh Token

```
Client

↓

POST /refresh-token

↓

Refresh Token Exists?

↓

Verify Token

↓

Generate New Access Token

↓

(Optional) Rotate Refresh Token

↓

Return New Access Token
```

---

## Forgot Password

```
Client

↓

POST /forgot-password

↓

Email Exists?

↓

Generate Reset Token

↓

Hash Reset Token

↓

Store Hash + Expiry

↓

Send Email

↓

Return Success
```

---

## Reset Password

```
User clicks email

↓

POST /reset-password

↓

Receive Token

↓

Hash Token

↓

Lookup Token

↓

Expired?

↓

Update Password

↓

Delete Reset Token

↓

Delete Refresh Tokens

↓

Return Success
```

---

## Email Verification

```
User clicks verification link

↓

Verify Token

↓

Update email_verified

↓

Delete Verification Token

↓

Return Success
```

---

# JWT Payload

```json
{
  "id": "...",
  "role": "customer",
  "email": "user@example.com"
}
```

Never include:

- Password
- Address
- Phone
- Refresh Token
- Product Information

---

# Security

## Password

- bcrypt
- Never store plaintext

---

## Access Token

Lifetime:

15 minutes

---

## Refresh Token

Lifetime:

7 days

Stored in Database.

---

## Password Reset Token

- Random
- Hashed before storage
- Single Use
- 15 Minute Expiry

---

## Email Verification Token

- Random
- Hashed
- Single Use
- 24 Hour Expiry

---

# Middleware

## Public Routes

- Register
- Login
- Forgot Password
- Reset Password
- Verify Email

---

## Protected Routes

authenticateUser()

↓

authorizeRoles()

---

# Database Tables

users

refresh_tokens

password_reset_tokens

email_verification_tokens

---

# Engineering Notes

Authentication is centralized.

Authorization is decentralized.e

Every service verifies JWT locally.

Services never call Auth Service just to verify JWT.

API Gateway is only for external clients.