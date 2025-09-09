// ==============================
// Authentication API Endpoints
// ==============================

/**
 * 1. Register a new user
 * POST /api/v1/auth/signup
 *
 * Request Body Example:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "displayName": "John Doe",
 *   "phone": "+1234567890"
 * }
 *
 * Response Examples:
 *
 * 201 User successfully registered
 * {
 *   "success": true,
 *   "message": "string",
 *   "user": {
 *     "uid": "string",
 *     "email": "user@example.com",
 *     "phone": "string",
 *     "displayName": "string",
 *     "photoURL": "string",
 *     "emailVerified": true,
 *     "disabled": true,
 *     "createdAt": "2025-07-23T15:54:55.637Z"
 *   },
 *   "token": "string"
 * }
 *
 * 400 Bad request - validation errors
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 *
 * 409 User already exists
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 */


/**
 * 2. Login User
 * POST /api/v1/auth/login
 *
 * Request Body Example:
 * 200	User successfully logged in
 * {
 *   email: "user@example.com",
 *   password: "password123"
 * }
 * 
 * 400	Bad request - validation errors
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 * 
 * 401	Unauthorized - invalid credentials
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 */

/**
 * 3. Send OTP to phone number
 * POST /api/v1/auth/send-otp
 *
 * Request Body Example:
 * {
 *   "phone": "+1234567890"
 * }
 *
 * Response Examples:
 *
 * 200	OTP sent successfully
 * {
 *   "success": true,
 *   "message": "OTP sent successfully",
 *   "otp": "string"
 * }
 *
 * 400	Bad request - invalid phone number
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 */

/**
 * 4. Verify OTP
 * POST /api/v1/auth/verify-otp
 *
 * Request Body Example:
 * {
 *   "phone": "+1234567890",
 *   "otp": "123456"
 * }
 *
 * Response Examples:
 *
 * 200	OTP verified successfully
 * {
 *   "success": true,
 *   "message": "string",
 *   "user": {
 *     "uid": "string",
 *     "email": "user@example.com",
 *     "phone": "string",
 *     "displayName": "string",
 *     "photoURL": "string",
 *     "emailVerified": true,
 *     "disabled": true,
 *     "createdAt": "2025-07-23T16:08:30.509Z"
 *   },
 *   "token": "string"
 * }
 *
 * 400	Bad request - invalid OTP or verification ID
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 *
 * 401	Unauthorized - OTP verification failed
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 */

/**
 * 5. Get User Profile
 * GET /api/v1/auth/profile/{userId}
 * 
 * Request parameters:
 * userId (required) - User ID
 *
 * Response Examples:
 *
 * 200	User profile retrieved successfully
 * {
 *   "success": true,
 *   "user": {
 *     "uid": "string",
 *     "email": "user@example.com",
 *     "phone": "string",
 *     "displayName": "string",
 *     "photoURL": "string",
 *     "emailVerified": true,
 *     "disabled": true,
 *     "createdAt": "2025-07-23T16:10:56.979Z"
 *   }
 * }
 *
 * 401	Unauthorized - authentication required
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 0
 * }
 * 
 * 404	User not found
 * {
 *   "error": "string",
 *   "message": "string",
 *   "statusCode": 404
 * }
 */

// ==============================
// Authentication Schemas
// ==============================

/**
 * Represents a user in the authentication system.
 */
interface User {
  /**
   * Firebase User ID.
   */
  uid: string;

  /**
   * User email address.
   * @format email
   */
  email: string;

  /**
   * User phone number.
   */
  phone: string;

  /**
   * User display name.
   */
  displayName: string;

  /**
   * User profile photo URL.
   * @format uri
   */
  photoURL: string;

  /**
   * Whether email is verified.
   */
  emailVerified: boolean;

  /**
   * Whether user account is disabled.
   */
  disabled: boolean;

  /**
   * Account creation timestamp.
   * @format date-time
   */
  createdAt: string;
}

/**
 * Represents a successful authentication response.
 */
interface AuthResponse {
  /**
   * Indicates if the operation was successful.
   */
  success: boolean;

  /**
   * Response message.
   */
  message: string;

  /**
   * Authenticated user information.
   */
  user: User;

  /**
   * Firebase custom token or ID token.
   */
  token: string;
}

/**
 * Represents an error response from the API.
 */
interface ErrorResponse {
  /**
   * Error type or code.
   */
  error: string;

  /**
   * Error message.
   */
  message: string;

  /**
   * HTTP status code.
   */
  statusCode: number;
}

/**
 * Request body for sending an OTP to a phone number.
 */
interface OTPRequest {
  /**
   * Phone number in international format.
   * @example "+1234567890"
   */
  phone: string;
}

/**
 * Response body for sending an OTP.
 */
interface OTPResponse {
  /**
   * Indicates if the operation was successful.
   */
  success: boolean;

  /**
   * Response message.
   */
  message: string;

  /**
   * OTP code sent to the user's phone.
   */
  otp?: string; // For testing purposes only; remove in production
}

/**
 * Request body for verifying an OTP.
 */
interface OTPVerification {
  /**
   * Phone number in international format.
   * @example "+1234567890"
   */
  phone: string;

  /**
   * OTP code received via SMS.
   * @example "123456"
   */
  otp: string;
}

/**
 * Request body for user signup.
 */
interface SignupRequest {
  /**
   * User email address.
   * @format email
   * @example "user@example.com"
   */
  email: string;

  /**
   * User password (minimum 6 characters).
   * @minLength 6
   * @example "password123"
   */
  password: string;

  /**
   * User display name.
   * @example "John Doe"
   */
  displayName?: string;

  /**
   * Phone number in international format.
   * @example "+1234567890"
   */
  phone?: string;
}

/**
 * Request body for user login.
 */
interface LoginRequest {
  /**
   * User email address.
   * @format email
   * @example "user@example.com"
   */
  email: string;

  /**
   * User password.
   * @example "password123"
   */
  password: string;
}