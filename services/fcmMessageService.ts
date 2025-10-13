/**
 * FCM Message Handling Service
 * 
 * Handles Firebase Cloud Messaging message listeners for:
 * - Foreground messages
 * - Background messages  
 * - Notification tap handling
 * - OTP message processing
 */

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import { initializeFCM } from '@/config/firebase';
import { FCMMessage, OTPMessageData } from '@/types/notifications';






// ============================================================================
// MESSAGE LISTENERS
// ============================================================================

/**
 * Set up foreground message listener 📱 ✔️
 * Called when app is in foreground and FCM message arrives
 * @param onOTPReceived - Callback for when OTP message is received
 * @param onGeneralMessage - Callback for general messages
 * @returns Unsubscribe function
 */
export function setupForegroundMessageListener(
  onOTPReceived?: (otpData: OTPMessageData) => void,
  onGeneralMessage?: (message: FCMMessage) => void
): () => void {
    if (AppState.currentState !== 'active') {
        console.log('(firebase) ⚠️ App is not in foreground, skipping foreground listener setup');
        return () => {};
    }

  console.log('(firebase) 🔔 Setting up FCM foreground message listener...');

  const unsubscribe = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('(firebase) 📱 FCM foreground message received:', remoteMessage);

    try {
      // Check if this is an OTP message
      if (remoteMessage.data?.type === 'otp') {
        const otpData: OTPMessageData = {
          type: 'otp',
          otp: remoteMessage.data.otp as string,
          phone: remoteMessage.data.phone as string,
          timestamp: remoteMessage.data.timestamp as string,
        };

        console.log('(firebase) 🔐 OTP message received in foreground:', otpData);

        // Call OTP callback if provided
        if (onOTPReceived && otpData.otp) {
          onOTPReceived(otpData);
        } else {
          // Show default OTP notification
          showOTPAlert(otpData.otp, remoteMessage.notification?.title);
        }
      } else {
        // Handle general messages
        const message: FCMMessage = {
          messageId: remoteMessage.messageId,
          data: remoteMessage.data as { [key: string]: string },
          notification: remoteMessage.notification,
          from: remoteMessage.from,
        };

        console.log('(firebase) 📢 General FCM message received:', message);

        if (onGeneralMessage) {
          onGeneralMessage(message);
        } else {
          // Show default notification alert
          showGeneralAlert(message);
        }
      }
    } catch (error) {
      console.error('(firebase) ❌ Error processing foreground FCM message:', error);
    }
  });

  console.log('(firebase) ✅ FCM foreground message listener set up');
  return unsubscribe;
}

/**
 * Set up background message handler 🌙 ✔️
 * Called when app is in background and FCM message arrives
 * NOTE: This must be called outside of React components
 */
export function setupBackgroundMessageHandler(): void {
    if (AppState.currentState === 'active') {
        console.log('(firebase) ⚠️ App is in foreground, skipping background handler setup');
        return;
    }
  console.log('(firebase) 🌙 Setting up FCM background message handler...');

  messaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('(firebase) 📱 FCM background message received:', remoteMessage);

    try {
      // Process background messages (limited functionality)
      if (remoteMessage.data?.type === 'otp') {
        console.log('(firebase) 🔐 OTP received in background:', remoteMessage.data.otp);
        // In background, we rely on the notification being displayed by the system
        // The OTP will be visible in the notification itself
      }
    } catch (error) {
      console.error('(firebase) ❌ Error processing background FCM message:', error);
    }
  });

  console.log('(firebase) ✅ FCM background message handler set up');
}

/**
 * Set up notification opened/tapped listener 👆 ✔️
 * Called when user taps on a notification
 * @param onNotificationTap - Callback for when notification is tapped
 * @returns Unsubscribe function
 */
export function setupNotificationTapListener(
  onNotificationTap?: (message: FCMMessage, wasAppClosed: boolean) => void
): () => void {
  console.log('👆 Setting up FCM notification tap listener...');

  // Handle notification opened app (when app was closed)
  messaging()
    .getInitialNotification()
    .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (remoteMessage) {
        console.log('🚀 App opened from notification (was closed):', remoteMessage);
        
        const message: FCMMessage = {
          messageId: remoteMessage.messageId,
          data: remoteMessage.data as { [key: string]: string },
          notification: remoteMessage.notification,
          from: remoteMessage.from,
        };

        if (onNotificationTap) {
          onNotificationTap(message, true);
        } else {
          handleDefaultNotificationTap(message, true);
        }
      }
    });

  // Handle notification opened app (when app was in background)
  const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('🚀 App opened from notification (was background):', remoteMessage);

    const message: FCMMessage = {
      messageId: remoteMessage.messageId,
      data: remoteMessage.data as { [key: string]: string },
      notification: remoteMessage.notification,
      from: remoteMessage.from,
    };

    if (onNotificationTap) {
      onNotificationTap(message, false);
    } else {
      handleDefaultNotificationTap(message, false);
    }
  });

  console.log('(firebase) ✅ FCM notification tap listener set up');
  return unsubscribe;
}





// ============================================================================
// REACT HOOK FOR FCM LISTENERS
// ============================================================================

/**
 * React hook to set up all FCM listeners ✔️
 * Should be used in a top-level component  (e.g. in App.tsx or a context provider)
 * Can also be used in specific screens if needed
 * @param callbacks - Object with callback functions for different events
 * @returns Object with FCM initialization status and unsubscribe functions
 */
export function useFCMListeners(callbacks?: {
  onOTPReceived?: (otpData: OTPMessageData) => void;
  onGeneralMessage?: (message: FCMMessage) => void;
  onNotificationTap?: (message: FCMMessage, wasAppClosed: boolean) => void;
}) {
  const isInitialized = useRef(false);
  const unsubscribers = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (isInitialized.current) return;

    const initializeFCMListeners = async () => {
      try {
        console.log('(firebase) 🚀 Initializing FCM listeners...');

        // Initialize FCM first
        const fcmResult = await initializeFCM();
        if (!fcmResult.success) {
          console.log('(firebase) ⚠️ FCM initialization failed:', fcmResult.error);
          return;
        }

        // Set up background handler (must be called outside components)
        setupBackgroundMessageHandler();

        // Set up foreground listener
        const foregroundUnsub = setupForegroundMessageListener(
          callbacks?.onOTPReceived,
          callbacks?.onGeneralMessage
        );
        unsubscribers.current.push(foregroundUnsub);

        // Set up notification tap listener
        const tapUnsub = setupNotificationTapListener(callbacks?.onNotificationTap);
        unsubscribers.current.push(tapUnsub);

        isInitialized.current = true;
        console.log('(firebase) ✅ All FCM listeners initialized successfully');
      } catch (error) {
        console.error('(firebase) ❌ Error initializing FCM listeners:', error);
      }
    };

    initializeFCMListeners();

    // Cleanup on unmount
    return () => {
      unsubscribers.current.forEach(unsub => unsub());
      unsubscribers.current = [];
      isInitialized.current = false;
    };
  }, []);

  return {
    isInitialized: isInitialized.current,
    unsubscribeAll: () => {
      unsubscribers.current.forEach(unsub => unsub());
      unsubscribers.current = [];
    }
  };
}





// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Show alert for OTP received in foreground
 */
function showOTPAlert(otp: string, title?: string): void {
  Alert.alert(
    title || 'Verification Code',
    `Your verification code: ${otp}`,
    [{ text: 'OK' }]
  );
}

/**
 * Show alert for general message in foreground
 */
function showGeneralAlert(message: FCMMessage): void {
  if (message.notification?.title && message.notification?.body) {
    Alert.alert(
      message.notification.title,
      message.notification.body,
      [{ text: 'OK' }]
    );
  }
}

/**
 * Handle default notification tap behavior
 */
function handleDefaultNotificationTap(message: FCMMessage, wasAppClosed: boolean): void {
  console.log('(firebase) 👆 Default notification tap handler:', { message, wasAppClosed });
  
  // Default behavior - you can customize this based on message type
  if (message.data?.type === 'otp') {
    console.log('(firebase) 🔐 User tapped OTP notification');
    // Could navigate to OTP screen automatically
  }
}

export default {
  setupForegroundMessageListener,
  setupBackgroundMessageHandler,
  setupNotificationTapListener,
  useFCMListeners,
};