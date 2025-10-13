/**
 * FCM Token Management Service
 * 
 * Handles FCM token storage, refresh, and backend synchronization
 * Integrates with the backend FCM token storage endpoints
 */

import axios from 'axios';
import { getFCMToken, onTokenRefresh } from '@/config/firebase';
import { saveToken, getToken, deleteToken } from '@/lib/storage';

// Types
export interface FCMTokenData {
  token: string;
  timestamp: number;
  phone?: string;
  lastSyncedAt?: number;
}

export interface TokenSyncResult {
  success: boolean;
  message: string;
  error?: string;
}

// Storage keys
const FCM_TOKEN_KEY = 'fcm_token';
const FCM_TOKEN_SYNC_KEY = 'fcm_token_sync';

// Backend endpoint - Hardcoded for now, could be moved to config
const BACKEND_BASE_URL = 'https://abililife-backend-api.onrender.com/api/v1/auth';





// ============================================================================
// TOKEN STORAGE (LOCAL)
// ============================================================================

/**
 * Store FCM token locally with timestamp and optional phone number ✔️
 * @param token - FCM token to store
 * @param phone - Optional phone number for context
 * @returns Promise<boolean> indicating success
 */
export async function storeFCMTokenLocally(token: string, phone?: string): Promise<boolean> {
  try {
    const tokenData: FCMTokenData = {
      token,
      timestamp: Date.now(),
      phone,
    };

    await saveToken(FCM_TOKEN_KEY, JSON.stringify(tokenData));
    console.log('✅ FCM token stored locally');
    return true;
  } catch (error) {
    console.error('❌ Error storing FCM token locally:', error);
    return false;
  }
}

/**
 * Get FCM token from local storage ✔️
 * @returns Promise<FCMTokenData | null> stored token data or null
 */
export async function getFCMTokenFromStorage(): Promise<FCMTokenData | null> {
  try {
    const tokenString = await getToken(FCM_TOKEN_KEY);
    if (!tokenString) {
      return null;
    }

    const tokenData: FCMTokenData = JSON.parse(tokenString);
    console.log('📱 FCM token retrieved from local storage');
    return tokenData;
  } catch (error) {
    console.error('❌ Error retrieving FCM token from storage:', error);
    return null;
  }
}

/**
 * Remove FCM token from local storage ✔️
 * @returns Promise<boolean> indicating success
 */
export async function removeFCMTokenFromStorage(): Promise<boolean> {
  try {
    await deleteToken(FCM_TOKEN_KEY);
    await deleteToken(FCM_TOKEN_SYNC_KEY);
    console.log('🗑️ FCM token removed from local storage');
    return true;
  } catch (error) {
    console.error('❌ Error removing FCM token from storage:', error);
    return false;
  }
}





// ============================================================================
// BACKEND SYNCHRONIZATION
// ============================================================================

/**
 * Send FCM token to backend for storage ✔️
 * @param token - FCM token to send
 * @param phone - Phone number to associate with token
 * @returns Promise<TokenSyncResult> with sync status
 */
export async function syncTokenWithBackend(token: string, phone: string): Promise<TokenSyncResult> {
  try {
    console.log('🔄 Syncing FCM token with backend...');

    const response = await axios.post(`${BACKEND_BASE_URL}/fcm-token`, {
      fcmToken: token,
      phone: phone,
    });

    if (response.data.success) {
      // Update sync timestamp
      const syncData = {
        lastSyncedAt: Date.now(),
        phone: phone,
      };
      await saveToken(FCM_TOKEN_SYNC_KEY, JSON.stringify(syncData));

      console.log('✅ FCM token synced with backend successfully');
      return {
        success: true,
        message: 'Token synced successfully',
      };
    } else {
      console.log('⚠️ Backend rejected FCM token:', response.data.message);
      return {
        success: false,
        message: response.data.message || 'Backend sync failed',
      };
    }
  } catch (error: any) {
    console.error('❌ Error syncing FCM token with backend:', error);
    return {
      success: false,
      message: 'Network error during token sync',
      error: error.message,
    };
  }
}

/**
 * Check if token needs to be synced with backend ✔️
 * @param phone - Phone number to check sync status for
 * @returns Promise<boolean> indicating if sync is needed
 */
export async function needsBackendSync(phone: string): Promise<boolean> {
  try {
    const syncString = await getToken(FCM_TOKEN_SYNC_KEY);
    if (!syncString) {
      return true; // Never synced
    }

    const syncData = JSON.parse(syncString);
    
    // Check if phone number matches
    if (syncData.phone !== phone) {
      return true; // Different phone number
    }

    // Check if sync is recent (within last 24 hours)
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    if (syncData.lastSyncedAt < twentyFourHoursAgo) {
      return true; // Stale sync
    }

    return false; // Recent sync exists
  } catch (error) {
    console.error('❌ Error checking sync status:', error);
    return true; // Error = needs sync
  }
}





// ============================================================================
// COMPLETE TOKEN MANAGEMENT
// ============================================================================

/**
 * Initialize FCM token management for a user ✔️
 * Gets token, stores locally, and syncs with backend
 * Used when user logs in or app starts
 * @param phone - User's phone number
 * @param forceRefresh - Force getting new token even if cached
 * @returns Promise<TokenSyncResult> with initialization status
 */
export async function initializeFCMForUser(phone: string, forceRefresh: boolean = false): Promise<TokenSyncResult> {
  try {
    console.log('🚀 Initializing FCM token management for user:', phone);

    let token: string | null = null;

    // 1. Try to get existing token if not forcing refresh
    if (!forceRefresh) {
      const existingTokenData = await getFCMTokenFromStorage();
      if (existingTokenData && existingTokenData.token) {
        token = existingTokenData.token;
        console.log('📱 Using existing FCM token from storage');
      }
    }

    // 2. Get new token if needed
    if (!token) {
      console.log('🔄 Getting new FCM token...');
      token = await getFCMToken();
      
      if (!token) {
        return {
          success: false,
          message: 'Failed to obtain FCM token',
        };
      }
    }

    // 3. Store token locally
    await storeFCMTokenLocally(token, phone);

    // 4. Check if backend sync is needed
    const needsSync = await needsBackendSync(phone);
    
    if (needsSync) {
      // 5. Sync with backend
      const syncResult = await syncTokenWithBackend(token, phone);
      
      if (!syncResult.success) {
        console.log('⚠️ Backend sync failed, but token is stored locally');
        return {
          success: true,
          message: 'Token obtained but backend sync failed. Will retry later.',
        };
      }
    } else {
      console.log('✅ Token already synced with backend recently');
    }

    console.log('✅ FCM token management initialized successfully');
    return {
      success: true,
      message: 'FCM token management initialized successfully',
    };

  } catch (error: any) {
    console.error('❌ Error initializing FCM for user:', error);
    return {
      success: false,
      message: 'Failed to initialize FCM token management',
      error: error.message,
    };
  }
}

/**
 * Set up FCM token refresh handler ✔️
 * Automatically syncs new tokens with backend when they refresh
 * @param phone - User's phone number
 * @returns Unsubscribe function
 */
export function setupTokenRefreshHandler(phone: string): () => void {
  console.log('🔄 Setting up FCM token refresh handler for:', phone);

  const unsubscribe = onTokenRefresh(async (newToken: string) => {
    console.log('🆕 FCM token refreshed, updating storage and backend...');

    try {
      // 1. Store new token locally
      await storeFCMTokenLocally(newToken, phone);

      // 2. Sync with backend
      const syncResult = await syncTokenWithBackend(newToken, phone);
      
      if (syncResult.success) {
        console.log('✅ Refreshed FCM token synced with backend');
      } else {
        console.log('⚠️ Failed to sync refreshed token with backend:', syncResult.message);
        // Could implement retry logic here
      }
    } catch (error) {
      console.error('❌ Error handling token refresh:', error);
    }
  });

  console.log('✅ FCM token refresh handler set up');
  return unsubscribe;
}

/**
 * Cleanup FCM token management for user logout or app uninstall ✔️
 * Removes local storage and stops refresh handlers
 * @returns Promise<boolean> indicating success
 */
export async function cleanupFCMForUser(): Promise<boolean> {
  try {
    console.log('🧹 Cleaning up FCM token management...');

    // Remove local storage
    await removeFCMTokenFromStorage();

    // Note: Refresh handlers should be cleaned up by calling the unsubscribe function
    // returned by setupTokenRefreshHandler()

    console.log('✅ FCM token management cleaned up');
    return true;
  } catch (error) {
    console.error('❌ Error cleaning up FCM token management:', error);
    return false;
  }
}

/**
 * Test FCM functionality by sending test notification 🧪
 * @param phone - Phone number to test
 * @returns Promise<TokenSyncResult> with test status
 */
export async function testFCMNotification(phone: string): Promise<TokenSyncResult> {
  try {
    console.log('🧪 Testing FCM notification for:', phone);

    const response = await axios.post(`${BACKEND_BASE_URL}/fcm-test`, {
      phone: phone,
      message: 'Test notification from AbiliLife app',
    });

    if (response.data.success) {
      console.log('✅ FCM test notification sent successfully');
      return {
        success: true,
        message: 'Test notification sent successfully',
      };
    } else {
      console.log('⚠️ FCM test failed:', response.data.message);
      return {
        success: false,
        message: response.data.message || 'Test notification failed',
      };
    }
  } catch (error: any) {
    console.error('❌ Error sending FCM test notification:', error);
    return {
      success: false,
      message: 'Network error during test',
      error: error.message,
    };
  }
}

export default {
  initializeFCMForUser,
  setupTokenRefreshHandler,
  cleanupFCMForUser,
  storeFCMTokenLocally,
  getFCMTokenFromStorage,
  syncTokenWithBackend,
  testFCMNotification,
};