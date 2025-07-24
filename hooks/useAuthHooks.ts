import BaseAPI from "@/lib/api";
import { AuthResponse, LoginRequest, OTPRequest, OTPSuccessResponse, OTPVerification, SignUpRequest } from "@/types/auth";

// POST: user login
export const useLogin = async (credentials: LoginRequest) => {
    try {
        const response = await BaseAPI.post<AuthResponse>('/api/v1/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// POST: user signup
export const useSignup = async (data: SignUpRequest) => {
    try {
        const response = await BaseAPI.post<AuthResponse>('/api/v1/auth/signup', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// POST: send OTP for phone verification
export const useSendOTP = async (data: OTPRequest) => {
    try {
        const response = await BaseAPI.post<OTPSuccessResponse>('/api/v1/auth/send-otp', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// POST: verify OTP for phone verification
export const useVerifyOTP = async (data: OTPVerification) => {
    try {
        const response = await BaseAPI.post<AuthResponse>('/api/v1/auth/verify-otp', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// GET: user profile
export const useGetUserProfile = async (userId: string) => {
    try {
        const response = await BaseAPI.get(`/api/v1/auth/profile/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}