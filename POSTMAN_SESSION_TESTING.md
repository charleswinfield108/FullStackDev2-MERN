# Testing Session Token in Postman

## Step 1: Login to Get JWT Token & User ID

**Method:** POST  
**URL:** `http://localhost:3000/auth/login`

**Body (JSON):**
```json
{
  "email": "agent@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user_id": "507f1f77bcf86cd799439011",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

**Note:** Save the `user_id` from this response for Step 2.

---

## Step 2: Create a Session Token

**Method:** POST  
**URL:** `http://localhost:3000/session/{user_id}`

Replace `{user_id}` with the ID from Step 1. Example:  
`http://localhost:3000/session/507f1f77bcf86cd799439011`

**Body:** Empty (no body required)

**Expected Response (200):**
```json
{
  "status": "ok",
  "data": {
    "token": "a1b2c3d4-e5f6-4a5b-c6d7-e8f9a0b1c2d3"
  },
  "message": "session saved successfully"
}
```

**Note:** Save the `token` from the response data for Step 3.

---

## Step 3: Validate the Session Token

**Method:** GET  
**URL:** `http://localhost:3000/session/validate_token?token=a1b2c3d4-e5f6-4a5b-c6d7-e8f9a0b1c2d3`

Replace the token parameter with the token from Step 2.

**Body:** Empty (no body required)

**Success Response (200):**
```json
{
  "status": "ok",
  "data": {
    "valid": true,
    "user": {
      "first_name": "John",
      "last_name": "Doe",
      "id": "507f1f77bcf86cd799439011"
    }
  },
  "message": null
}
```

**Invalid/Expired Token Response (401):**
```json
{
  "status": "error",
  "data": {
    "valid": false,
    "user": null
  },
  "message": "Invalid or expired token"
}
```

---

## Key Information

- **Session tokens** are UUID strings (not JWTs, which are different from the login JWT token)
- **Session expiration:** 24 hours (automatically deleted after this period)
- **Token storage:** Session token should be stored in cookies on your frontend
- **Validation endpoint:** Uses a query parameter `?token=...` to pass the token
- **Login JWT:** The `token` returned from login is different from the `session_token` - the login JWT is for authentication, while the session token tracks active sessions

---

## Testing Checklist

- [ ] Step 1: Login successful and received `user_id`
- [ ] Step 2: Session created and received `session_token`
- [ ] Step 3: Session validation returns valid token with user data
- [ ] Test with invalid token to confirm 401 error response
- [ ] Test with expired token (wait 24 hours or delete from database)
