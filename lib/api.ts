// Base API setup

import axios, {AxiosError, AxiosResponse, AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig} from 'axios';
import { DEV_BACKEND_URL, PROD_BACKEND_URL } from '@/constants/staticURLs';
import { getToken, saveToken, deleteToken } from './storage';

// 1. Determine the base URL based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_URL = isDevelopment ? DEV_BACKEND_URL : PROD_BACKEND_URL;

// 2. Create an Axios instance with the base URL
export const BaseAPI = axios.create({
  baseURL: BASE_URL,
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
    const token = await getToken('accessToken');
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
    return response;
  },
  async (error: AxiosError) => {
    const { response } = error;
    if (response) {
      // Handle specific error codes
      switch (response.status) {
        case 401:
          // Redirect to login page
          break;
        case 403:
          // Show forbidden message
          break;
        case 404:
          // Show not found message
          break;
        case 500:
          // Show server error message
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
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
    return response;
  },
  async (error: AxiosError) => {
    // Only retry on network errors or 5xx server errors
    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;

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

        // Return the retried request
        return BaseAPI(config);
      }

      // If we have maxed out the total number of retries, reject the promise
      return Promise.reject(new Error(`Max retries reached for request: ${error.config.url}`));
    }
    // If not a retryable error, reject the promise as usual
    return Promise.reject(error);
  }
);


// 6. Export the BaseAPI instance for use in other parts of the application
export default BaseAPI;
export { BASE_URL, isDevelopment };