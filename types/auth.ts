// Refer @/docs/backend-api-docs.ts for API documentation

export interface User {
    uid: string; // Firebase User ID
    email: string; // User email address
    phone: string; // User phone number
    displayName: string; // User display name
    photoURL: string; // User profile photo URL
    emailVerified: boolean; // Whether email is verified
    disabled: boolean; // Whether user account is disabled
    createdAt: string; // Account creation timestamp
}

export interface AuthResponse {
    success: boolean;
    message: string; // Response message
    user: User;
    token: string; // Firebase custom token or ID token
}

export interface ErrorResponse {
    error: string; // Error type or code
    message: string; // Error message
    statusCode: number; // HTTP status code
}

export interface OTPRequest {
    phone: string; // Phone number in international format
}

export interface OTPVerification {
    phone: string; // Phone number in international format
    otp: string; // OTP code received via SMS
}

export interface SignUpRequest {
    email: string; // User email address
    password: string; // User password
    displayName?: string; // Optional user display name
    phone?: string; // Optional phone number in international format
}

export interface LoginRequest {
    email: string; // User email address
    password: string; // User password
}