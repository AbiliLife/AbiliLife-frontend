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

export interface OTPSuccessResponse {
  success: boolean;
  message: string;
  verificationId: string; // Verification ID for OTP verification
}

export interface SignUpRequest {
    email: string; // User email address
    phone: string; // Phone number in international format
    fullName: string; // User display name
    password: string; // User password
}

export interface LoginRequest {
    email: string; // User email address
    password: string; // User password
}

export interface AuthContextType {
    isAuthenticated: boolean; // Whether user is authenticated
    isAuthLoading: boolean; // Whether authentication is loading
    userData: User | null; // Authenticated user data
    setUserData?: (user: User) => void; // Set user data function
    clearUserData?: () => void; // Clear user data function
    authToken: string | null; // Auth token
    setAuthToken?: (token: string) => void; // Set auth token function
    clearAuthToken?: () => void; // Clear auth token function
    login: (credentials: LoginRequest) => Promise<AuthResponse>; // Login function
    signup: (data: SignUpRequest) => Promise<AuthResponse>; // Signup function
    logout: () => Promise<void>; // Logout function
    requestOTP: (data: OTPRequest) => Promise<OTPSuccessResponse>; // Request OTP function
    verifyOTP: (data: OTPVerification) => Promise<AuthResponse>; // Verify OTP function
}