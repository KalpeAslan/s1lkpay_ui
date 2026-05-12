# Authentication Implementation

## Overview

JWT-based authentication has been implemented with email and password. All endpoints now require authentication, and all data is isolated per user.

## Features Implemented

### 1. User Entity
- **Location**: `src/entities/user.entity.ts`
- **Fields**:
  - `id` (UUID, primary key)
  - `email` (unique)
  - `password` (hashed with bcrypt)
  - `firstName` (optional)
  - `lastName` (optional)
  - Relations: OneToMany with Applications

### 2. Authentication Endpoints

#### POST `/auth/register`
Register a new user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST `/auth/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: Same as register

#### GET `/auth/me`
Get current authenticated user details.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### 3. Protected Endpoints

All operation endpoints now require authentication with JWT Bearer token:

- **Domestic Transfers**: `/domestic-transfers`
- **Global Transfers**: `/global-transfers`
- **FX Convert**: `/fx-convert`
- **Payment Orders**: `/payment-orders`
- **Applications**: `/applications`

### 4. User Isolation

All data is isolated by user:
- Users can only see their own applications
- Users can only create applications under their own account
- All queries are filtered by user ID

### 5. Database Relations

**Application Entity** now has:
```typescript
@ManyToOne(() => User, (user) => user.applications, {
  nullable: false,
})
user: User;
```

## Implementation Details

### Files Created/Modified

**New Files**:
- `src/entities/user.entity.ts` - User entity
- `src/dto/auth.dto.ts` - Authentication DTOs (RegisterDto, LoginDto, AuthResponseDto)
- `src/auth/auth.module.ts` - Auth module configuration
- `src/auth/jwt.strategy.ts` - JWT Passport strategy
- `src/auth/jwt-auth.guard.ts` - JWT authentication guard
- `src/services/auth.service.ts` - Authentication service
- `src/controllers/auth.controller.ts` - Authentication endpoints

**Modified Files**:
- `src/app.module.ts` - Added AuthModule and User entity
- `src/entities/application.entity.ts` - Added user relation
- All controllers in `src/controllers/*` - Added `@UseGuards(JwtAuthGuard)` and `@ApiBearerAuth()`
- All services in `src/services/*` - Added user parameter and filtering

### Security Features

1. **Password Hashing**: bcrypt with salt rounds of 10
2. **JWT Tokens**: Signed with secret key, expires in 7 days
3. **Protected Routes**: All operation routes require authentication
4. **User Isolation**: All queries filtered by authenticated user ID

### Environment Variables

Add to your `.env` file:
```env
JWT_SECRET=your-secret-key-here
```

## Usage Example

1. **Register a new user**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

3. **Use the access token for protected endpoints**:
```bash
curl -X GET http://localhost:3000/applications \
  -H "Authorization: Bearer <your_access_token>"
```

## Swagger Documentation

All authentication endpoints are documented in Swagger UI at `http://localhost:3000/api`.

Use the "Authorize" button in Swagger UI to set your Bearer token for testing protected endpoints.

## Notes

- No email confirmation required (as per requirements)
- Tokens expire after 7 days
- Password must be at least 6 characters
- Email must be unique
- All application data is user-scoped

