# Admin Login & Authentication Flow

## Overview
The Rocket Elevators Admin Dashboard uses a JWT (JSON Web Token) + Session Token two-tier authentication system. Users must login with email and password to access the admin dashboard.

---

## Components Involved

### Frontend Components
1. **Login.jsx** - Login form component where users enter credentials
2. **AuthContext.jsx** - Global state management for authentication
3. **RequireAuth.jsx** - Route protection component that prevents unauthenticated access
4. **cookieUtils.js** - Utility functions for token storage and retrieval

### Backend Components
1. **auth.js** - Authentication route handler for /auth/login endpoint
2. **sessionRoutes.js** - Session validation endpoint
3. **AuthContext** - Stores and manages user authentication state
4. **User Model** - MongoDB schema for user data

---

## Authentication Flow (Step-by-Step)

### 1. **Page Load**
- App loads and AuthProvider runs `validateSession()` effect
- Checks if a valid session token exists in cookies
- If token exists, validates it with backend's `/session/validate-token` endpoint
- If valid, restores user session without requiring re-login
- Sets `isLoading = false` when complete

### 2. **User Submits Login Form**
User enters email and password on Login.jsx form and submits

### 3. **Frontend Sends Credentials** 
Login.jsx sends POST request to `/auth/login`:
```
POST /auth/login
{
  email: "agent@example.com",
  password: "password123"
}
```

### 4. **Backend Validates Credentials**
auth.js route handler:
- Extracts email and password from request
- Queries User database for matching email
- Compares provided password with stored password
- If invalid → returns 401 "Invalid credentials"
- If valid → generates JWT token

### 5. **JWT Token Generated**
- Token created with 8-hour expiration
- Contains user ID (sub) and email
- Signed with JWT_SECRET from environment variables

### 6. **Backend Returns User Data**
On successful authentication, returns:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user_id": "507f1f77bcf86cd799439011",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

### 7. **Frontend Creates Session**
Login.jsx receives response and:
- Extracts user_id from response
- Makes POST request to `/session/{user_id}` to create a session record
- Backend creates a Session document in MongoDB with 24-hour expiration

### 8. **Session Token Stored**
- Backend returns a session token
- Login.jsx calls `setSessionToken()` to store token in secure cookies
- Token persists across browser sessions

### 9. **User State Updated**
- Calls `login()` function from AuthContext
- Updates AuthContext with user data (id, first_name, last_name)
- Sets `isAuthenticated = true`

### 10. **Redirect to Dashboard**
- Shows success toast notification: "Login was Successful"
- After 1.5 second delay, redirects to `/admin/home` dashboard

---

## Session Validation

### On Every Route
RequireAuth.jsx component checks:
- `useAuth()` hook retrieves current user and authentication status from AuthContext
- If `isAuthenticated = false`, redirects to login page
- If `isAuthenticated = true`, allows access to protected routes

### Token Expiration
- JWT tokens expire after 8 hours
- Session records expire after 24 hours
- Frontend can validate `/session/validate-token` endpoint before expiration
- Expired sessions require user to login again

### Logout
When user logs out:
- AuthContext.logout() is called
- Clears user data from state
- Removes session token from cookies
- User redirected to login page

---

## File Relationships

```
Login.jsx (Form UI)
    ↓
AuthContext.login() (Global state)
    ↓
cookieUtils.setSessionToken() (Store token)
    ↓
    auth.js (/auth/login) → Validates credentials, returns JWT
    sessionRoutes.js (POST /session/:user_id) → Creates session record
    
Dashboard Routes (Protected)
    ↓
RequireAuth.jsx (Checks AuthContext)
    ↓
cookieUtils.getSessionToken() (Retrieve stored token)
    ↓
sessionRoutes.js (GET /validate-token) → Validates token still valid
```

---

## Key Security Features

1. **JWT Tokens** - Stateless authentication using signed tokens
2. **Session Records** - Server-side session tracking with expiration
3. **Token Expiration** - Automatic token expiration (8 hours JWT, 24 hours Session)
4. **Secure Cookies** - Session tokens stored in httpOnly cookies
5. **Password Validation** - Credentials checked against database
6. **Route Protection** - RequireAuth component prevents unauthorized access

---

## Error Handling

| Status | Cause | User Message |
|--------|-------|--------------|
| 400 | Missing email or password | (Field validation) |
| 401 | Invalid email or password | "Incorrect Username or Password" |
| 500 | Server error or JWT not configured | "Login Failed. Please try again." |

---

## Environment Variables Required

- `JWT_SECRET` - Secret key for signing JWT tokens
- `MONGODB_URI` - MongoDB connection string (for user database)
- `PORT` - Server port (default 3000)

