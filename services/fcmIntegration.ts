/**
 * FCM Integration Example for App Layout
 * 
 * This file shows how to integrate FCM services into your app's main layout
 * Copy the relevant parts to your _layout.tsx or App.tsx file
 */

import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { router } from 'expo-router';
import { useFCMListeners } from '@/services/fcmMessageService';
import { initializeFCMForUser, setupTokenRefreshHandler } from '@/services/fcmTokenService';
import { setupBackgroundMessageHandler } from '../services/fcmMessageService';
import { useAuth } from '@/contexts/AuthContext';
import { FCMMessage, OTPMessageData } from '@/types/notifications';





/**
 * STEP 1: Background Message Handler Setup
 * This MUST be called outside of any React components
 * Add this to your at the top level of your app (_layout.tsx)
 */
// setupBackgroundMessageHandler();

/**
 * STEP 2: Main FCM Integration Component ✔️
 * Used at the top level of the app to manage FCM lifecycle (_layout.tsx)
 */
export function useFCMIntegration() {
  const { userData, isAuthenticated } = useAuth();
  const tokenRefreshUnsubscriber = useRef<(() => void) | null>(null);

  // Setup FCM listeners with custom callbacks
  const { isInitialized } = useFCMListeners({
    onOTPReceived: (otpData: OTPMessageData) => {
      console.log('🔐 OTP received via FCM:', otpData.otp);
      
      // Custom handling for OTP messages
      // You can auto-fill OTP, show notification, etc.
      handleOTPReceived(otpData);
    },
    
    onGeneralMessage: (message: FCMMessage) => {
      console.log('📢 General message received:', message);
      
      // Handle general notifications
      handleGeneralMessage(message);
    },
    
    onNotificationTap: (message: FCMMessage, wasAppClosed: boolean) => {
      console.log('👆 Notification tapped:', { message, wasAppClosed });
      
      // Handle notification tap navigation
      handleNotificationTap(message, wasAppClosed);
    }
  });

  // Initialize FCM token management when user is authenticated
  useEffect(() => {
    const initUserFCM = async () => {
      if (isAuthenticated && userData?.phone) {
        try {
          console.log('🚀 Initializing FCM for authenticated user...');
          
          // Initialize FCM token management
          const result = await initializeFCMForUser(userData.phone);
          
          if (result.success) {
            console.log('✅ FCM initialized for user:', userData.phone);
            
            // Set up token refresh handler
            if (tokenRefreshUnsubscriber.current) {
              tokenRefreshUnsubscriber.current();
            }
            tokenRefreshUnsubscriber.current = setupTokenRefreshHandler(userData.phone);
          } else {
            console.log('⚠️ FCM initialization failed:', result.message);
          }
        } catch (error) {
          console.error('❌ Error initializing FCM for user:', error);
        }
      }
    };

    initUserFCM();

    // Cleanup on unmount or user change
    return () => {
      if (tokenRefreshUnsubscriber.current) {
        tokenRefreshUnsubscriber.current();
        tokenRefreshUnsubscriber.current = null;
      }
    };
  }, [isAuthenticated, userData?.phone]);

  // Handle app state changes for FCM
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('📱 App became active - FCM ready for foreground messages');
      } else if (nextAppState === 'background') {
        console.log('🌙 App went to background - FCM background handler active');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  return {
    fcmInitialized: isInitialized,
  };
}





// ============================================================================
// CUSTOM MESSAGE HANDLERS
// ============================================================================

/**
 * Handle OTP messages received via FCM ⏳
 * @param otpData - OTP message data
 */
function handleOTPReceived(otpData: OTPMessageData) {
  console.log('🔐 Processing OTP message:', otpData);
  
  // OPTION 1: Auto-navigate to OTP screen
  // router.push({
  //   pathname: '/otp',
  //   params: { otp: otpData.otp, fromFCM: 'true' }
  // });
  
  // OPTION 2: Store OTP and let user manually navigate
  // You could store in a global state or context
  
  // OPTION 3: Show toast notification
  // Toast.show({
  //   type: 'success',
  //   text1: 'Verification Code Received',
  //   text2: `Your code: ${otpData.otp}`,
  //   visibilityTime: 8000,
  // });
}

/**
 * Handle general messages received via FCM ⏳
 * @param message - FCM message object
 */
function handleGeneralMessage(message: FCMMessage) {
  console.log('📢 Processing general message:', message);
  
  // Handle different message types
  if (message.data?.type === 'appointment') {
    // Handle appointment notifications
  } else if (message.data?.type === 'reminder') {
    // Handle reminder notifications
  }
  
  // Default: show notification if app is in foreground
  // The system will handle background notifications automatically
}

/**
 * Handle notification tap navigation ⏳
 * @param message - FCM message object
 * @param wasAppClosed - Whether the app was closed when notification was tapped
 */
function handleNotificationTap(message: FCMMessage, wasAppClosed: boolean) {
  console.log('👆 Processing notification tap:', { message, wasAppClosed });
  
  // Navigate based on message type
  if (message.data?.type === 'otp') {
    // Navigate to OTP screen
    router.push('/otp');
  } else if (message.data?.type === 'appointment') {
    // Navigate to appointments
    // router.push('/(tabs)/healthcare');
  } else if (message.data?.type === 'reminder') {
    // Navigate to relevant screen
    // router.push('/(tabs)/notifications');
  }
  
  // Default navigation
  // router.push('/(tabs)/');
}





// ============================================================================
// TESTING HELPERS
// ============================================================================

/**
 * Test FCM functionality (for development) 🧪
 * Call this from a test button in your app
 * @param phone - User's phone number to send test notification
 */
export async function testFCMFunctionality(phone: string) {
  const { testFCMNotification } = await import('../services/fcmTokenService');
  
  const result = await testFCMNotification(phone);
  
  if (result.success) {
    console.log('✅ FCM test successful');
    // Toast.show({
    //   type: 'success',
    //   text1: 'FCM Test Successful',
    //   text2: 'Check your notifications!',
    // });
  } else {
    console.log('❌ FCM test failed:', result.message);
    // Toast.show({
    //   type: 'error',
    //   text1: 'FCM Test Failed',
    //   text2: result.message,
    // });
  }
}

export default {
  useFCMIntegration,
  testFCMFunctionality,
};