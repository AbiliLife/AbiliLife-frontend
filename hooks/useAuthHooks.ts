import BaseAPI from "@/lib/api";
import { AuthResponse, LoginRequest, OTPRequest, OTPSuccessResponse, OTPVerification, SignUpRequest } from "@/types/auth";
import axios from "axios";

// POST: user login
export const useLogin = async (credentials: LoginRequest) => {
    try {
        // const response = await BaseAPI.post<AuthResponse>('/api/v1/auth/login', credentials);
        // FOR NOW, HARDCODE THE LOGIN ENDPOINT TO BYPASS THE AUTH MIDDLEWARE (FOR TESTING PURPOSES) - WILL BE REMOVED LATER
        const loginUrl = 'https://abililife-backend-api.onrender.com/api/v1/auth/login';
        const response = await axios.post<AuthResponse>(loginUrl, credentials);
        return response.data; // will return the axios response data which includes user info and token (AuthResponse)
    } catch (error) {
        throw error; // This will be an AxiosError or any other error thrown by the API (will be caught in the calling code)
    }
}

// POST: user signup
export const useSignup = async (data: SignUpRequest) => {
    try {
        // const response = await BaseAPI.post<AuthResponse>('/api/v1/auth/signup', data);
        // FOR NOW, HARDCODE THE LOGIN ENDPOINT TO BYPASS THE AUTH MIDDLEWARE (FOR TESTING PURPOSES) - WILL BE REMOVED LATER
        const signupUrl = 'https://abililife-backend-api.onrender.com/api/v1/auth/signup';
        const response = await axios.post<AuthResponse>(signupUrl, data);
        return response.data; // will return the axios response data which includes user info and token (AuthResponse)
    } catch (error) {
        throw error;
    }
}

// POST: send OTP for phone verification
export const useSendOTP = async (data: OTPRequest) => {
    try {
        // const response = await BaseAPI.post<OTPSuccessResponse>('/api/v1/auth/send-otp', data);
        // FOR NOW, HARDCODE THE LOGIN ENDPOINT TO BYPASS THE AUTH MIDDLEWARE (FOR TESTING PURPOSES) - WILL BE REMOVED LATER
        const sendOtpUrl = 'https://abililife-backend-api.onrender.com/api/v1/auth/send-otp';
        const response = await axios.post<OTPSuccessResponse>(sendOtpUrl, data);
        return response.data; // will return the axios response data which includes success status and verification ID (OTPSuccessResponse)
    } catch (error) {
        throw error;
    }
}

// POST: verify OTP for phone verification
export const useVerifyOTP = async (data: OTPVerification) => {
    try {
        // const response = await BaseAPI.post<AuthResponse>('/api/v1/auth/verify-otp', data);
        // FOR NOW, HARDCODE THE LOGIN ENDPOINT TO BYPASS THE AUTH MIDDLEWARE (FOR TESTING PURPOSES) - WILL BE REMOVED LATER
        const verifyOtpUrl = 'https://abililife-backend-api.onrender.com/api/v1/auth/verify-otp';
        const response = await axios.post<AuthResponse>(verifyOtpUrl, data);
        return response.data; // will return the axios response data which includes user info and token (AuthResponse)
    } catch (error) {
        throw error;
    }
}

// GET: user profile
export const useGetUserProfile = async (userId: string) => {
    try {
        const response = await BaseAPI.get(`/api/v1/auth/profile/${userId}`);
        return response.data; // will return the axios response data which includes user profile information
    } catch (error) {
        throw error;
    }
}