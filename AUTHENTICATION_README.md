# Nevyra Authentication System

## Overview

This document describes the complete authentication system implemented for the Nevyra e-commerce platform. The system provides secure user registration, login, password reset, and profile management functionality.

## Features

### ✅ User Registration
- First name and last name validation (2-50 characters, letters only)
- Email validation and uniqueness check
- Phone number validation (optional, international format)
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- Address field (optional)

### ✅ User Login
- Email and password authentication
- JWT token generation
- Automatic profile loading after login
- Secure session management

### ✅ Password Reset
- Email-based password reset
- 6-digit OTP generation
- OTP verification
- New password reset with validation
- 10-minute OTP expiration

### ✅ Profile Management
- View user profile
- Update personal information
- Address management (add, edit, delete)
- Input validation and duplicate checking

### ✅ Security Features
- Password hashing with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Input sanitization and validation
- Duplicate email/phone prevention
- Secure error messages (no information leakage)

## Backend Implementation

### File Structure
```
backend/
├── controllers/
│   └── authController.js      # Authentication logic
├── models/
│   └── User.js               # User schema and model
├── routes/
│   ├── index.js              # Main router with health check
│   └── auth.js               # Authentication routes
├── utils/
│   ├── validators.js         # Input validation functions
│   └── emailService.js       # Email sending functionality
└── test-auth.js              # Authentication testing script
```

### API Endpoints

#### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-otp` - Verify OTP for password reset
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/profile` - Get user profile (protected)
- `PATCH /api/auth/profile` - Update user profile (protected)

#### Address Management Routes
- `GET /api/auth/addresses` - Get user addresses (protected)
- `POST /api/auth/addresses` - Add new address (protected)
- `PATCH /api/auth/addresses/:index` - Update address by index (protected)
- `DELETE /api/auth/addresses/:index` - Delete address by index (protected)

#### Utility Routes
- `GET /api/health` - API health check

### Validation Rules

#### Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+-=[]{}|;':",./<>?)

#### Email Validation
- Must be valid email format
- Length between 6-255 characters
- Unique across all users

#### Name Validation
- 2-50 characters
- Only letters, spaces, hyphens, and apostrophes allowed

#### Phone Validation
- International format supported
- Optional field
- Must be unique if provided

## Frontend Implementation

### File Structure
```
frontend/src/
├── components/
│   └── ForgotPassword.tsx    # Password reset component
├── hooks/
│   └── useAuth.tsx           # Authentication context and logic
├── lib/
│   └── api.ts                # API service functions
└── pages/
    └── Auth.tsx              # Main authentication page
```

### Components

#### Auth.tsx
- Tabbed interface for login/register
- Real-time form validation
- Error display with icons
- Loading states
- Integration with forgot password flow

#### ForgotPassword.tsx
- Multi-step password reset flow
- Email input → OTP verification → Password reset → Success
- Form validation and error handling
- Loading states and user feedback

#### useAuth Hook
- Authentication context provider
- User state management
- Login/register/logout functions
- Automatic token management
- Profile refresh functionality

### Form Validation

#### Client-side Validation
- Real-time input validation
- Visual error indicators
- Password strength requirements display
- Form submission prevention on errors

#### Error Handling
- Clear error messages
- Field-specific error display
- Automatic error clearing on input
- Toast notifications for success/error

## Setup and Configuration

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```env
   PORT=8000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   MONGODB_URI=your-mongodb-connection-string
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Update API URL**
   In `src/lib/api.ts`, update `API_BASE_URL` if needed:
   ```typescript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Testing

### Backend Testing
Run the authentication test script:
```bash
cd backend
node test-auth.js
```

This will test:
- Health check endpoint
- User registration
- User login
- Profile retrieval
- Password reset request

### Frontend Testing
1. Open the application in your browser
2. Navigate to the authentication page
3. Test registration with various inputs
4. Test login with valid/invalid credentials
5. Test forgot password flow
6. Verify form validation works correctly

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with 12 rounds
- Strong password requirements enforced
- No password storage in plain text

### Token Security
- JWT tokens with configurable expiration
- Automatic token cleanup on logout
- Secure token storage in localStorage

### Input Validation
- Server-side validation for all inputs
- Client-side validation for better UX
- SQL injection prevention through Mongoose
- XSS protection through input sanitization

### Error Handling
- Generic error messages to prevent information leakage
- Secure password reset flow
- Rate limiting considerations (can be added)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB connection string
   - Ensure MongoDB service is running
   - Verify network connectivity

2. **JWT Token Issues**
   - Check JWT_SECRET environment variable
   - Verify token expiration settings
   - Check token format in Authorization header

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check email service configuration
   - Ensure proper email permissions

4. **CORS Issues**
   - Check CORS configuration in server.js
   - Verify frontend URL is in allowed origins
   - Check browser console for CORS errors

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## API Response Format

All API responses follow this format:
```json
{
  "success": boolean,
  "message": "Human readable message",
  "data": object | null
}
```

### Success Response Example
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

### Error Response Example
```json
{
  "success": false,
  "message": "Email already exists",
  "data": null
}
```

## Future Enhancements

### Planned Features
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Account verification via email
- [ ] Session management and device tracking
- [ ] Password history and reuse prevention
- [ ] Account lockout after failed attempts

### Security Improvements
- [ ] Rate limiting for authentication endpoints
- [ ] IP-based blocking for suspicious activity
- [ ] Audit logging for security events
- [ ] Advanced password policies
- [ ] Multi-session support

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in console
3. Verify configuration settings
4. Test with the provided test script

## License

This authentication system is part of the Nevyra e-commerce platform.
