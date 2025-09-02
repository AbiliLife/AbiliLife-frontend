// Authentication context
import { AxiosError } from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

// Secure Store
import { getToken, saveToken, deleteToken } from '@/lib/storage';

// Types
import { AuthContextType, AuthResponse, LoginRequest, OTPRequest, OTPSuccessResponse, OTPVerification, SignUpRequest, User } from '@/types/auth';

// Auth Hooks
import { useLogin, useSignup, useSendOTP, useVerifyOTP } from '@/hooks/useAuthHooks';


// 1. Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 2. State to manage authentication
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<User | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);

    // 3. Check if user is authenticated on initial load
    useEffect(() => {
        const initializeAuth = async () => {
            setIsAuthLoading(true);
            // Try to get the token from storage
            const token = await getToken('idToken');
            if (token) {
                // If token exists, check if it's valid
                const isExpired = await isTokenExpired(token);
                if (!isExpired) {
                    // If token is valid, set it in state and authenticate the user
                    setAuthToken(token);
                    setIsAuthenticated(true);
                    // Decode token to get user data
                    const decodedToken = jwtDecode<User>(token);
                    setUserData(decodedToken);
                } else {
                    // If token is expired, logout the user (which will clear the token and update auth state)
                    await logout();
                }
            } else {
                // If no token, set auth state to false
                setIsAuthenticated(false);
            }
            setIsAuthLoading(false);
        };
        initializeAuth();
    }, []);

    // 4. Function to check if token is expired
    const isTokenExpired = async (token: string): Promise<boolean> => {
        if (!token) return true;
        const currentTime = Math.floor(Date.now() / 1000);
        const decodedToken = jwtDecode<{ exp: number }>(token); // this decodes the JWT token to get the expiration time
        if (!decodedToken.exp) return true; // If no expiration time, consider it expired
        return decodedToken.exp < currentTime; // Check if current time is past expiration time
    };


    // 5. FUNCTIONS FOR AUTHENTICATION ACTIONS - these will be used in the context provider
    // Login, Signup, Logout, Request OTP, Verify OTP
    const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
        const emptyUser: User = {
            uid: '',
            email: '',
            phone: '',
            fullName: '',
            photoURL: '',
            emailVerified: false,
            disabled: false,
            createdAt: ''
        }

        try {
            setIsAuthLoading(true);
            const responseData = await useLogin(credentials); // the useLogin hook will return the AuthResponse
            if (responseData.success) {
                setIsAuthenticated(true);
                setUserData(responseData.user);
                setAuthToken(responseData.token);
                await saveToken('idToken', responseData.token); // this saves the firebase custom token or ID token in local secure storage
                return responseData;
            } else {
                return {
                    success: false,
                    message: responseData.message || 'Login failed',
                    user: emptyUser,
                    token: ''
                };
            }
        } catch (error: AxiosError | any) { // Catch the exact error thrown by the useLogin hook
            // error?.response?.data - is the error response from the API (ErrorResponse)
            // error?.message - is the generic axios error message (e.g. network error, timeout, etc.

            // we return a structured AuthResponse with success false and error message
            // this will be caught in the calling code (in the auth screen)
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Login error',
                user: emptyUser,
                token: ''
            };
        } finally {
            setIsAuthLoading(false);
        }
    };

    const signup = async (data: SignUpRequest): Promise<AuthResponse> => {
        const emptyUser: User = {
            uid: '',
            email: '',
            phone: '',
            fullName: '',
            photoURL: '',
            emailVerified: false,
            disabled: false,
            createdAt: ''
        }
        try {
            setIsAuthLoading(true);
            const responseData = await useSignup(data); // the useSignup hook will return the AuthResponse
            if (responseData.success) {
                setIsAuthenticated(true);
                setUserData(responseData.user);
                setAuthToken(responseData.token);
                await saveToken('idToken', responseData.token); // this saves the firebase custom token or ID token in local secure storage
                return responseData;
            } else {
                return {
                    success: false,
                    message: responseData.message || 'Signup failed',
                    user: emptyUser,
                    token: ''
                };
            }
        } catch (error: AxiosError | any) {// Catch the exact error thrown by the useSignup hook
            // error?.response?.data - is the error response from the API (ErrorResponse)
            // error?.message - is the generic axios error message (e.g. network error, timeout, etc.)

            // we return a structured AuthResponse with success false and error message
            // this will be caught in the calling code (in the auth screen)
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Signup error',
                user: emptyUser,
                token: ''
            };
        } finally {
            setIsAuthLoading(false);
        }
    };

    const logout = async () => {
        setIsAuthenticated(false);
        setUserData(null);
        setAuthToken(null);
        await deleteToken('idToken');
    };

    const requestOTP = async (data: OTPRequest): Promise<OTPSuccessResponse> => {
        try {
            setIsAuthLoading(true);
            const responseData = await useSendOTP(data);
            if (responseData.success) {
                return responseData;
            } else {
                return {
                    success: false,
                    message: responseData.message || 'Request OTP failed',
                    verificationId: ''
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Request OTP error',
                verificationId: ''
            };
        } finally {
            setIsAuthLoading(false);
        }
    };

    const verifyOTP = async (data: OTPVerification): Promise<AuthResponse> => {
        const emptyUser: User = {
            uid: '',
            email: '',
            phone: '',
            fullName: '',
            photoURL: '',
            emailVerified: false,
            disabled: false,
            createdAt: ''
        }
        try {
            setIsAuthLoading(true);
            const responseData = await useVerifyOTP(data);
            if (responseData.success) {
                return responseData;
            } else {
                return {
                    success: false,
                    message: responseData.message || 'Verify OTP failed',
                    user: emptyUser,
                    token: ''
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Verify OTP error',
                user: emptyUser,
                token: ''
            };
        } finally {
            setIsAuthLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isAuthLoading,
            userData,
            authToken,
            login,
            signup,
            logout,
            requestOTP,
            verifyOTP
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;
