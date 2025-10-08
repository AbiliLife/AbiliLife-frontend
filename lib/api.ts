import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { Toast } from 'toastify-react-native';

// Constants URLs
import { DEV_BACKEND_URL, PROD_BACKEND_URL } from '@/constants/Static';

// Secure Store
import { getToken, deleteToken } from './storage';

// Helper function to check if URL is an auth endpoint
const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return url.includes('/auth/login') ||
    url.includes('/auth/signup');
};

// 1. Determine the base URL based on environment
const isDevelopment = __DEV__;
const BASE_URL = isDevelopment ? DEV_BACKEND_URL : PROD_BACKEND_URL;

// Log the API configuration
console.log(`[API] Environment: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
console.log(`[API] Base URL: ${BASE_URL}`);

// 2. Create an Axios instance with the base URL
export const BaseAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds for better network tolerance
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request interceptor: Add auth token for non-auth endpoints
BaseAPI.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Log all requests in development
    if (isDevelopment) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    // Add auth token for non-auth endpoints
    if (!isAuthEndpoint(config.url)) {
      const token = await getToken('idToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 4. Response interceptor: Handle errors and auth logic
BaseAPI.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (isDevelopment) {
      console.log(`[API Response] ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;

    // Log errors in development
    if (isDevelopment) {
      console.error(`[API Error] ${response?.status || 'Network'} from ${config?.url}:`, error.message);
    }

    // Handle different error scenarios
    if (response) {
      const isAuth = isAuthEndpoint(config?.url);

      switch (response.status) {
        case 401:
          if (!isAuth) {
            // Token expired for protected endpoints - redirect to auth
            await deleteToken('idToken');
            router.replace('/auth');
            Toast.show({
              type: 'error',
              text1: 'Session Expired',
              text2: 'Please log in again',
              visibilityTime: 3000,
              position: 'top',
            });
          }
          // For auth endpoints, let the component handle the error
          break;

        case 403:
          if (!isAuth) {
            Toast.show({
              type: 'error',
              text1: 'Access Denied',
              text2: 'You do not have permission to access this resource.',
              visibilityTime: 3000,
              position: 'top',
            });
          }
          break;

        case 404:
          if (!isAuth) {
            Toast.show({
              type: 'error',
              text1: 'Not Found',
              text2: 'The requested resource could not be found.',
              visibilityTime: 3000,
              position: 'top',
            });
          }
          break;

        case 500:
        case 502:
        case 503:
          Toast.show({
            type: 'error',
            text1: 'Server Error',
            text2: 'The server is temporarily unavailable. Please try again.',
            visibilityTime: 4000,
            position: 'top',
          });
          break;
      }
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      Toast.show({
        type: 'error',
        text1: 'Request Timeout',
        text2: 'The request took too long to complete. Please try again.',
        visibilityTime: 4000,
        position: 'top',
      });
    } else if (!response && error.message) {
      // Network error - only show for non-auth endpoints
      if (!isAuthEndpoint(config?.url)) {
        Toast.show({
          type: 'error',
          text1: 'Connection Error',
          text2: 'Please check your internet connection and try again.',
          visibilityTime: 4000,
          position: 'top',
        });
      }
    }

    // Always reject the error to let components handle it
    return Promise.reject(error);
  }
);

// 5. Export the BaseAPI instance and utilities
export default BaseAPI;
export { BASE_URL, isDevelopment, isAuthEndpoint };