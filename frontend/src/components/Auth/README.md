# Authentication Components

This directory contains all authentication-related components for the Collab Notes application.

## Components

### Core Forms

- **LoginForm.jsx** - Email/password login with OAuth options (Google, Microsoft)
- **SignupForm.jsx** - User registration with validation and OAuth options
- **AuthLayout.jsx** - Animated split-view layout that transitions between login and signup

### Password Recovery

- **ForgotPassword.jsx** - Request password reset email
- **ResetPassword.jsx** - Set new password with token validation

### Email Verification

- **EmailVerification.jsx** - Verify email address from link
- **ResendVerification.jsx** - Resend verification email component

## Pages

The following page components are available in `/src/pages/`:

- **LoginPage.jsx** - Login page with redirect logic
- **SignupPage.jsx** - Signup page with redirect logic
- **ForgotPasswordPage.jsx** - Password recovery page
- **ResetPasswordPage.jsx** - Password reset page
- **EmailVerificationPage.jsx** - Email verification page

## Features

### Form Validation

- Email format validation
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Password confirmation matching
- Terms acceptance for signup

### OAuth Integration

- Google OAuth login/signup
- Microsoft OAuth login/signup
- Seamless redirect flow

### Error Handling

- Field-level validation errors
- API error messages
- Loading states during async operations

### User Experience

- Smooth 300ms transitions between login/signup
- Animated background illustrations
- Responsive design for mobile/tablet/desktop
- Accessible form controls with proper labels

## Usage

```jsx
import { LoginPage, SignupPage } from './pages';
import { AuthLayout } from './components/Auth';

// Use in routing
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
<Route path="/verify-email" element={<EmailVerificationPage />} />
```

## Integration

All components integrate with:

- **useAuthStore** - Zustand store for authentication state
- **authApi** - API layer for backend communication
- **React Router** - Navigation and redirects

## Requirements Covered

This implementation satisfies the following requirements:

- 1.1-1.7: User registration flow
- 2.1-2.5: User login flow
- 3.1-3.5: Password recovery and email verification
- 17.1-17.5: Animated authentication UI
- 18.3-18.5: Email verification handling
