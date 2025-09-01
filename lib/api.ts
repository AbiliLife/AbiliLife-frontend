import axios, {AxiosError, AxiosResponse, AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig} from 'axios';
import { router } from 'expo-router';
import { Toast } from 'toastify-react-native';

// Constants URLs
import { DEV_BACKEND_URL, PROD_BACKEND_URL } from '@/constants/staticURLs';

// Secure Store
import { getToken, deleteToken } from './storage';

// 1. Determine the base URL based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_URL = PROD_BACKEND_URL; // -> Make production the default for safety (for build process only)

// 2. Create an Axios instance with the base URL
export const BaseAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Add request interceptor to include auth token if available
/**
 * This interceptor checks for a token in localStorage and adds it to the request headers.
 * It ensures that all requests to the backend API are authenticated.
 * @param {InternalAxiosRequestConfig} config - The Axios request configuration.
 * @returns {InternalAxiosRequestConfig} - The modified request configuration with the auth token.
 */
BaseAPI.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken('idToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 4. Add response interceptor to handle errors globally
/**
 * This interceptor handles errors globally for all responses.
 * It checks for specific error codes and formats the error response accordingly.
 * Example: If the user is not authenticated, redirect to the login page. or if the token is expired, refresh it.
 * @param {AxiosResponse} response - The Axios response.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the modified response.
 */
BaseAPI.interceptors.response.use(
  (response: AxiosResponse) => {
    return response; // If the response is successful, just return it to the calling code
  },
  async (error: AxiosError) => {
    const { response } = error;
    if (response) {
      // Handle specific error codes
      switch (response.status) {
        case 401:
          // TODO: Add refresh token logic
          // Delete token and redirect to auth screen
          await deleteToken('idToken');
          router.replace('/auth');
          break;
        case 403:
          // Show forbidden message
          Toast.show({
            type: 'error',
            text1: 'Access Denied',
            text2: 'You do not have permission to access this resource.',
            visibilityTime: 3000,
            position: 'top',
          })
          break;
        case 404:
          // Show not found message
          Toast.show({
            type: 'error',
            text1: 'Not Found',
            text2: 'The requested resource could not be found.',
            visibilityTime: 3000,
            position: 'top',
          });
          break;
        case 500:
          // Show server error message
          Toast.show({
            type: 'error',
            text1: 'Server Error',
            text2: 'An unexpected error occurred on the server.',
            visibilityTime: 3000,
            position: 'top',
          });
          break;
        default:
          break;
      }
    }
    return Promise.reject(error); // Reject the promise with the error (this will be caught by the calling code)
  }
);


// 5. Add response interceptor to handle retrying requests
/**
 * This interceptor can be used to retry requests in case of specific errors like network issues.
 * It can be customized to retry a request a certain number of times before failing.
 * @param {AxiosResponse} response - The Axios response.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the modified response.
 */
const MAX_RETRIES = 3;
BaseAPI.interceptors.response.use(
  (response: AxiosResponse) => {
    return response; // If the response is successful, just return it to the calling code
  },
  async (error: AxiosError) => {
    // Only retry on network errors or 5xx server errors
    const isNetworkError = !error.response; // No response means it was a network error
    const isServerError = error.response && error.response.status >= 500; // 5xx status codes indicate server errors

    if ((isNetworkError || isServerError) && error.config) {
      const config = error.config as InternalAxiosRequestConfig & { __retryCount?: number };
      config.__retryCount = config.__retryCount || 0;

      // Check if we have maxed the total number of retries
      if (config.__retryCount < MAX_RETRIES) {
        // Increment the retry count
        config.__retryCount += 1;
        
        // Create a new promise to retry the request
        const backoff = Math.pow(2, config.__retryCount) * 100; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoff));

        return BaseAPI(config); // Retry the request with the updated config (this will call the request interceptor again)
      }

      // If we have maxed out the total number of retries, reject the promise to be caught by the calling code
      return Promise.reject(error);
    }
    // If not a retryable error, reject the promise as usual
    return Promise.reject(error);
  }
);


// 6. Export the BaseAPI instance for use in other parts of the application
export default BaseAPI;
export { BASE_URL, isDevelopment }; // (optional) export base URL and environment status for use in other modules