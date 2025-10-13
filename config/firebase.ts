/**
 * Firebase Configuration for AbiliLife Frontend
 * 
 * Handles Firebase Cloud Messaging (FCM) setup, token management, and notification permissions for React Native with Expo.
 */

import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Types
export interface FCMPermissionResult {
    granted: boolean;
    token?: string;
    error?: string;
}

export interface FCMTokenResult {
    success: boolean;
    token?: string;
    error?: string;
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

/**
 * Request notification permissions for iOS ✔️
 * Android doesn't need explicit permission request for FCM
 * @returns Promise<boolean> indicating if permissions were granted
 */
export async function requestUserPermission(): Promise<boolean> {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('(firebase) ✅ iOS notification permissions granted');
                return true;
            } else {
                console.log('(firebase) ❌ iOS notification permissions denied');
                return false;
            }
        }

        // Android doesn't need explicit permission request
        console.log('(firebase) ✅ Android notification permissions (auto-granted)');
        return true;
    } catch (error: any) {
        console.error('(firebase) ❌ Error requesting notification permissions:', error);
        return false;
    }
}

/**
 * Check current notification permission status ✔️
 * @returns Promise<boolean> indicating if permissions are granted
 */
export async function checkNotificationPermissions(): Promise<boolean> {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().hasPermission();
            return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        }
        return true; // Android auto-granted
    } catch (error: any) {
        console.error('(firebase) ❌ Error checking notification permissions:', error);
        return false;
    }
}





// ============================================================================
// FCM TOKEN MANAGEMENT
// ============================================================================

/**
 * Get FCM token for the current device ✔️
 * @returns Promise<string | null> FCM token or null if failed
 */
export async function getFCMToken(): Promise<string | null> {
    try {
        // Check if device supports FCM
        if (!Device.isDevice) {
            console.log('(firebase) ⚠️ FCM only works on physical devices');
            return null;
        }

        // Request permissions first
        const hasPermission = await requestUserPermission();
        if (!hasPermission) {
            console.log('(firebase) ⚠️ No notification permissions - FCM token not available');
            return null;
        }

        // Get FCM token
        const fcmToken = await messaging().getToken();

        if (fcmToken) {
            console.log('(firebase) ✅ FCM Token obtained successfully');
            console.log('📱 Token (first 20 chars):', fcmToken.substring(0, 20) + '...');
            return fcmToken;
        } else {
            console.log('(firebase) ❌ Failed to get FCM token');
            return null;
        }
    } catch (error: any) {
        console.error('(firebase) ❌ Error getting FCM token:', error);
        return null;
    }
}

/**
 * Initialize FCM and get token with comprehensive error handling ✔️
 * @returns Promise<FCMTokenResult> with success status and token/error details
 */
export async function initializeFCM(): Promise<FCMTokenResult> {
    try {
        console.log('(firebase) 🚀 Initializing Firebase Cloud Messaging...');

        // 1. Check if running on physical device
        if (!Device.isDevice) {
            return {
                success: false,
                error: 'FCM only works on physical devices, not simulators/emulators'
            };
        }

        // 2. Request permissions
        const hasPermission = await requestUserPermission();
        if (!hasPermission) {
            return {
                success: false,
                error: 'Notification permissions not granted'
            };
        }

        // 3. Get FCM token
        const token = await getFCMToken();
        if (!token) {
            return {
                success: false,
                error: 'Failed to obtain FCM token'
            };
        }

        console.log('(firebase) ✅ FCM initialization successful');
        return {
            success: true,
            token: token
        };

    } catch (error: any) {
        console.error('(firebase) ❌ FCM initialization failed:', error);
        return {
            success: false,
            error: error.message || 'Unknown FCM initialization error'
        };
    }
}





// ============================================================================
// TOKEN REFRESH HANDLING
// ============================================================================

/**
 * Set up FCM token refresh listener ✔️
 * @param callback - Function to call when token refreshes
 * @returns Unsubscribe function
 */
export function onTokenRefresh(callback: (token: string) => void): () => void {
    console.log('(firebase) 🔄 Setting up FCM token refresh listener...');

    const unsubscribe = messaging().onTokenRefresh(callback);

    console.log('(firebase) ✅ FCM token refresh listener set up');
    return unsubscribe;
}





// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate FCM token format (basic client-side validation) ✔️
 * @param token - FCM token to validate
 * @returns boolean indicating if token format looks valid
 */
export function validateFCMToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
        return false;
    }

    // Basic validation - FCM tokens are typically long strings
    if (token.length < 100 || token.length > 200) {
        return false;
    }

    // Should not contain spaces
    if (token.includes(' ')) {
        return false;
    }

    return true;
}

/**
 * Display user-friendly permission request dialog ✔️
 * @returns Promise<boolean> indicating if user granted permissions
 */
export async function requestPermissionsWithDialog(): Promise<boolean> {
    try {
        // First check if already granted
        const hasPermission = await checkNotificationPermissions();
        if (hasPermission) {
            return true;
        }

        // Show explanation dialog for iOS
        if (Platform.OS === 'ios') {
            return new Promise((resolve) => {
                Alert.alert(
                    'Enable Notifications',
                    'AbiliLife needs notification permissions to send you verification codes and important updates.',
                    [
                        {
                            text: 'Not Now',
                            style: 'cancel',
                            onPress: () => resolve(false),
                        },
                        {
                            text: 'Enable',
                            onPress: async () => {
                                const granted = await requestUserPermission();
                                resolve(granted);
                            },
                        },
                    ]
                );
            });
        }

        // For Android, just request directly
        return await requestUserPermission();
    } catch (error: any) {
        console.error('(firebase) ❌ Error in permission dialog:', error);
        return false;
    }
}

/**
 * Get device information for debugging ✔️
 * @returns Object with device details
 */
export function getDeviceInfo() {
    return {
        isDevice: Device.isDevice,
        platform: Platform.OS,
        platformVersion: Platform.Version,
        deviceName: Device.deviceName,
        brand: Device.brand,
        modelName: Device.modelName,
        expoVersion: Constants.expoVersion,
    };
}

export default {
    initializeFCM,
    getFCMToken,
    requestUserPermission,
    checkNotificationPermissions,
    onTokenRefresh,
    validateFCMToken,
    requestPermissionsWithDialog,
    getDeviceInfo,
};