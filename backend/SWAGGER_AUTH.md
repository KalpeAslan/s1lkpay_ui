# Using Swagger with JWT Authentication

## Overview

Swagger UI now supports JWT Bearer token authentication. You can test all protected endpoints directly from the Swagger interface.

## How to Use

### 1. Access Swagger UI

Navigate to: `http://localhost:3000/api`

### 2. Register or Login

Use one of these endpoints to get your JWT token:

**Option A: Register a new user**
- Expand `POST /auth/register`
- Click "Try it out"
- Enter your details:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- Click "Execute"
- Copy the `access_token` from the response

**Option B: Login with existing user**
- Expand `POST /auth/login`
- Click "Try it out"
- Enter your credentials:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Click "Execute"
- Copy the `access_token` from the response

### 3. Authorize in Swagger

1. Click the **"Authorize"** button at the top right of the Swagger UI (it has a lock icon 🔓)
2. In the modal that appears, paste your JWT token in the "Value" field
3. Click **"Authorize"**
4. Click **"Close"**

### 4. Test Protected Endpoints

Now you can test any protected endpoint:
- All endpoints with a lock icon 🔒 are protected
- Your JWT token will be automatically included in the `Authorization` header
- Example: Try `GET /applications` or `POST /domestic-transfers`

### 5. Logout from Swagger

To remove the token:
1. Click the **"Authorize"** button again
2. Click **"Logout"**

## Token Format

The token is automatically sent in the header as:
```
Authorization: Bearer <your_jwt_token>
```

## Token Expiration

- JWT tokens expire after **7 days**
- If you get a 401 Unauthorized error, your token may have expired
- Simply login again to get a new token

## Example Workflow

```
1. POST /auth/register    → Get access_token
2. Click "Authorize"      → Paste token
3. POST /domestic-transfers → Create a transfer (authenticated)
4. GET /applications      → View your applications (authenticated)
```

## Protected Endpoints

All of these require authentication:
- `POST /domestic-transfers`
- `GET /domestic-transfers`
- `GET /domestic-transfers/:id`
- `POST /global-transfers`
- `GET /global-transfers`
- `GET /global-transfers/:id`
- `POST /fx-convert`
- `GET /fx-convert`
- `GET /fx-convert/:id`
- `POST /payment-orders`
- `GET /payment-orders`
- `GET /payment-orders/:id`
- `GET /applications`
- `GET /applications/:id`
- `GET /applications/number/:number`
- `GET /auth/me`

## Troubleshooting

**Problem**: 401 Unauthorized error
- **Solution**: Make sure you clicked "Authorize" and entered a valid token

**Problem**: Token not working
- **Solution**: Get a fresh token by logging in again

**Problem**: "Authorize" button not visible
- **Solution**: Refresh the page at `http://localhost:3000/api`

