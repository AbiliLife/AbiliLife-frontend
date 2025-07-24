// Authentication context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, deleteToken } from '@/lib/storage';
import { AuthContextType, AuthResponse, LoginRequest, OTPRequest, OTPSuccessResponse, OTPVerification, SignUpRequest, User } from '@/types/auth';
import { useLogin, useSignup, useSendOTP, useVerifyOTP } from '@/hooks/useAuthHooks';
import { jwtDecode } from "jwt-decode";

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
            const token = await getToken('idToken');
            if (token) {
                // Check if token is expired
                const isExpired = await isTokenExpired(token);
                if (!isExpired) {
                    setAuthToken(token);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    await logout();
                }
            } else {
                setIsAuthenticated(false);
                await logout();
            }
            setIsAuthLoading(false);
        };
        initializeAuth();
    }, []);

    // 4. Set a timer to check token expiration
    useEffect(() => {
        const checkTokenExpiration = async () => {
            const token = await getToken('idToken');
            if (token) {
                // Implement logic to check token expiration
            }
        };

        const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    // 5. Function to check if token is expired
    const isTokenExpired = async (token: string): Promise<boolean> => {
        if (!token) return true;
        const currentTime = Math.floor(Date.now() / 1000);
        const decodedToken = jwtDecode<{ exp: number }>(token);
        return decodedToken.exp < currentTime;
    };


    // 6. FUNCTIONS FOR AUTHENTICATION ACTIONS
    const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
        const emptyUser: User = {
            uid: '',
            email: '',
            phone: '',
            displayName: '',
            photoURL: '',
            emailVerified: false,
            disabled: false,
            createdAt: ''
        }

        try {
            setIsAuthLoading(true);
            const responseData = await useLogin(credentials);
            if (responseData.success) {
                setIsAuthenticated(true);
                setUserData(responseData.user);
                setAuthToken(responseData.token);
                await saveToken('idToken', responseData.token);
                return responseData;
            } else {
                return {
                    success: false,
                    message: responseData.message || 'Login failed',
                    user: emptyUser,
                    token: ''
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Login error',
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
            displayName: '',
            photoURL: '',
            emailVerified: false,
            disabled: false,
            createdAt: ''
        }
        try {
            setIsAuthLoading(true);
            const responseData = await useSignup(data);
            if (responseData.success) {
                setIsAuthenticated(true);
                setUserData(responseData.user);
                setAuthToken(responseData.token);
                await saveToken('idToken', responseData.token);
                return responseData;
            } else {
                return {
                    success: false,
                    message: responseData.message || 'Signup failed',
                    user: emptyUser,
                    token: ''
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Signup error',
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
            displayName: '',
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
    return useContext(AuthContext);
};

export default AuthProvider;
