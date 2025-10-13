# Firebase Cloud Messaging (FCM) Implementation Guide for AbiliLife OTP Delivery

## 📋 Table of Contents
1. [Overview & Architecture](#overview--architecture)
2. [Firebase Setup Status](#firebase-setup-status)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [OTP Delivery Flow](#otp-delivery-flow)
6. [Testing & Debugging](#testing--debugging)
7. [Production Considerations](#production-considerations)

---

## 🏗️ Overview & Architecture

### What is Firebase Cloud Messaging (FCM)?
FCM is Google's cross-platform messaging solution that lets you send push notifications and data messages to iOS, Android, and web applications **for free**.

### FCM for OTP Delivery - Two Approaches:

**Approach 1: Backend-Initiated (RECOMMENDED)**
```
User requests OTP → Backend generates OTP → Backend sends FCM message with OTP → User receives notification
```

**Approach 2: Frontend-Initiated (CURRENT)**
```
User requests OTP → Backend generates OTP → Frontend gets OTP → Frontend sends local notification
```

### Why Backend-Initiated is Better:
- ✅ More secure (OTP never exposed to frontend)
- ✅ Reliable delivery through Google's infrastructure
- ✅ Works even when app is closed/backgrounded
- ✅ Can send to multiple devices
- ✅ Better analytics and delivery confirmation

---

## ✅ Firebase Setup Status

Based on your files, you already have:

### ✅ Installed Dependencies
```json
"@react-native-firebase/app": "^23.4.0",
"@react-native-firebase/messaging": "^23.4.0",
"@react-native-firebase/in-app-messaging": "^23.4.0"
```

### ✅ Firebase Configuration Files
- `firebase-service-account.json` - Backend authentication
- `google-services.json` - Android app configuration
- Firebase project: `abililife-project`
- Package name: `com.abililife.app`

### ✅ App Configuration
- EAS project ID: `711d444c-e531-43b2-b77e-ba20ff2c69ef`
- Google Services file linked in `app.json`

---

## 📱 Frontend Implementation

### Step 1: Initialize Firebase in Your App

Create or update `src/config/firebase.ts`:
```typescript
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Request permission for iOS
export async function requestUserPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    return enabled;
  }
  return true; // Android doesn't need explicit permission request
}

// Get FCM token
export async function getFCMToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    console.log('✅ FCM Token:', token);
    return token;
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}

// Listen for token refresh
export function onTokenRefresh(callback: (token: string) => void) {
  return messaging().onTokenRefresh(callback);
}
```

### Step 2: Update Your Notification Service

Update `services/notificationService.ts`:
```typescript
import messaging from '@react-native-firebase/messaging';
import { getFCMToken, requestUserPermission } from '@/config/firebase';

// Initialize FCM
export async function initializeFCM(): Promise<string | null> {
  try {
    // Request permission
    const hasPermission = await requestUserPermission();
    if (!hasPermission) {
      console.log('⚠️ FCM permission denied');
      return null;
    }

    // Get FCM token
    const fcmToken = await getFCMToken();
    if (fcmToken) {
      // TODO: Send token to your backend
      await sendTokenToBackend(fcmToken);
    }

    return fcmToken;
  } catch (error) {
    console.error('❌ FCM initialization error:', error);
    return null;
  }
}

// Send FCM token to backend
async function sendTokenToBackend(token: string): Promise<void> {
  try {
    // TODO: Implement API call to store token in user profile
    const response = await fetch('https://abililife-backend-api.onrender.com/api/v1/users/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAuthToken}`, // Get from auth context
      },
      body: JSON.stringify({ fcmToken: token }),
    });
    
    if (response.ok) {
      console.log('✅ FCM token sent to backend');
    }
  } catch (error) {
    console.error('❌ Error sending FCM token to backend:', error);
  }
}
```

### Step 3: Set Up Message Listeners

Add to your main App component or `_layout.tsx`:
```typescript
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Handle messages when app is in foreground
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('📱 FCM message received in foreground:', remoteMessage);
      
      // Check if it's an OTP message
      if (remoteMessage.data?.type === 'otp') {
        // Show local notification or update UI
        showOTPNotification(remoteMessage.data.otp);
      }
    });

    // Handle messages when app is opened from background/quit state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('📱 FCM message opened app:', remoteMessage);
      
      if (remoteMessage.data?.type === 'otp') {
        // Navigate to OTP screen or auto-fill OTP
        handleOTPFromNotification(remoteMessage.data.otp);
      }
    });

    // Check if app was opened from a notification (when app was quit)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('📱 App opened from FCM notification:', remoteMessage);
          
          if (remoteMessage.data?.type === 'otp') {
            handleOTPFromNotification(remoteMessage.data.otp);
          }
        }
      });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  // Rest of your app...
}
```

---

## 🚀 Backend Implementation

### Step 1: Install Firebase Admin SDK

In your backend:
```bash
npm install firebase-admin
```

### Step 2: Update Firebase Config

Your backend already has Firebase initialized. Update `src/config/firebase.ts`:
```typescript
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Your existing Firebase initialization code...

// Add messaging service
export const getFirebaseMessaging = () => {
  if (!isFirebaseInitialized) {
    throw new Error('Firebase is not initialized. Please configure Firebase first.');
  }
  return getMessaging();
};
```

### Step 3: Create FCM Service

Create `src/services/FCMService.ts`:
```typescript
import { getFirebaseMessaging } from '../config/firebase';
import { Message } from 'firebase-admin/messaging';

export class FCMService {
  
  /**
   * Send OTP via FCM to specific device
   */
  async sendOTPNotification(fcmToken: string, otp: string, phone: string): Promise<{success: boolean, messageId?: string, error?: string}> {
    try {
      const messaging = getFirebaseMessaging();
      
      const message: Message = {
        token: fcmToken,
        notification: {
          title: 'AbiliLife Verification Code',
          body: `Your verification code is: ${otp}`,
        },
        data: {
          type: 'otp',
          otp: otp,
          phone: phone,
          timestamp: new Date().toISOString(),
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'otp-notifications',
            priority: 'high',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: 'AbiliLife Verification Code',
                body: `Your verification code is: ${otp}`,
              },
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await messaging.send(message);
      console.log('✅ FCM OTP sent successfully:', response);
      
      return {
        success: true,
        messageId: response,
      };
    } catch (error: any) {
      console.error('❌ Error sending FCM OTP:', error);
      return {
        success: false,
        error: error.message || 'Unknown FCM error',
      };
    }
  }

  /**
   * Send OTP to multiple devices (if user has multiple devices)
   */
  async sendOTPToMultipleDevices(fcmTokens: string[], otp: string, phone: string): Promise<{successCount: number, failureCount: number, responses: any[]}> {
    try {
      const messaging = getFirebaseMessaging();
      
      const messages: Message[] = fcmTokens.map(token => ({
        token,
        notification: {
          title: 'AbiliLife Verification Code',
          body: `Your verification code is: ${otp}`,
        },
        data: {
          type: 'otp',
          otp: otp,
          phone: phone,
          timestamp: new Date().toISOString(),
        },
      }));

      const response = await messaging.sendAll(messages);
      
      console.log(`✅ FCM batch sent: ${response.successCount} success, ${response.failureCount} failures`);
      
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      };
    } catch (error: any) {
      console.error('❌ Error sending batch FCM:', error);
      return {
        successCount: 0,
        failureCount: fcmTokens.length,
        responses: [],
      };
    }
  }
}
```

### Step 4: Update AuthService

Modify `src/services/AuthService.ts`:
```typescript
import { FCMService } from './FCMService';

export class AuthService {
  private fcmService = new FCMService();

  async sendOTP(otpData: OTPRequest): Promise<OTPResponse> {
    try {
      const firestore = this.getFirestoreService();
      const otp = this.generateOTP();
      
      // Store OTP in Firestore (existing code)
      await firestore.collection('otps').doc(otpData.phone).set({
        otp: otp,
        phone: otpData.phone,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: false,
        createdAt: new Date()
      });

      // NEW: Get user's FCM tokens and send notification
      const userDoc = await firestore.collection('users')
        .where('phone', '==', otpData.phone)
        .limit(1)
        .get();

      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const fcmTokens = userData.fcmTokens || []; // Array of tokens for multiple devices
        
        if (fcmTokens.length > 0) {
          const fcmResult = await this.fcmService.sendOTPToMultipleDevices(fcmTokens, otp, otpData.phone);
          
          if (fcmResult.successCount > 0) {
            return {
              success: true,
              message: `OTP sent via notification to ${fcmResult.successCount} device(s)`,
              // Don't return OTP in production!
              ...(process.env.NODE_ENV === 'development' && { otp })
            };
          }
        }
      }

      // Fallback: No FCM tokens found
      if (process.env.NODE_ENV === 'development') {
        console.log('📱 OTP for development (no FCM):', otp);
        return {
          success: true,
          message: 'OTP generated (check console - no FCM tokens)',
          otp: otp
        };
      }

      return {
        success: false,
        message: 'No notification tokens found for this phone number'
      };

    } catch (error: any) {
      console.error('❌ Error in sendOTP:', error);
      return {
        success: false,
        message: error.message || 'OTP sending failed'
      };
    }
  }
}
```

### Step 5: Add FCM Token Storage Endpoint

Create `src/routes/fcm.ts`:
```typescript
import { Router } from 'express';
import { getFirestore } from '../config/firebase';

const router = Router();

// Store FCM token for user
router.post('/token', async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user?.uid; // From auth middleware
    
    if (!fcmToken || !userId) {
      return res.status(400).json({
        success: false,
        message: 'FCM token and user ID required'
      });
    }

    const firestore = getFirestore();
    
    // Add token to user's FCM tokens array (support multiple devices)
    await firestore.collection('users').doc(userId).update({
      fcmTokens: admin.firestore.FieldValue.arrayUnion(fcmToken),
      lastTokenUpdate: new Date(),
    });

    res.json({
      success: true,
      message: 'FCM token stored successfully'
    });
  } catch (error: any) {
    console.error('Error storing FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store FCM token'
    });
  }
});

export default router;
```

---

## 🔄 OTP Delivery Flow

### Complete Flow:
```
1. User enters phone number and requests OTP
2. Frontend calls backend /api/v1/auth/send-otp
3. Backend generates OTP and stores in Firestore
4. Backend looks up user's FCM tokens from their profile
5. Backend sends FCM message with OTP to all user devices
6. User receives push notification with OTP
7. User can tap notification to auto-fill or manually enter OTP
8. Frontend calls backend /api/v1/auth/verify-otp
9. Backend verifies OTP against Firestore
10. User is authenticated
```

### Message Payload Structure:
```json
{
  "notification": {
    "title": "AbiliLife Verification Code",
    "body": "Your verification code is: 123456"
  },
  "data": {
    "type": "otp",
    "otp": "123456",
    "phone": "+1234567890",
    "timestamp": "2025-10-11T..."
  }
}
```

---

## 🧪 Testing & Debugging

### Frontend Testing:
```typescript
// Add to your test screen or dev menu
export async function testFCM() {
  try {
    const token = await getFCMToken();
    console.log('FCM Token:', token);
    
    // Test message listener
    messaging().onMessage(async (remoteMessage) => {
      console.log('Test message received:', remoteMessage);
      Alert.alert('FCM Test', JSON.stringify(remoteMessage, null, 2));
    });
  } catch (error) {
    console.error('FCM Test Error:', error);
  }
}
```

### Backend Testing:
```bash
# Test FCM sending via REST client or curl
curl -X POST https://abililife-backend-api.onrender.com/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'
```

### Firebase Console Testing:
1. Go to Firebase Console → Cloud Messaging
2. Send test message to your FCM token
3. Verify your app receives the message

---

## 🚀 Production Considerations

### Security:
- ✅ Never include OTP in notification title/body in production
- ✅ Use data payload only for sensitive information
- ✅ Implement token cleanup for inactive devices
- ✅ Rate limiting on OTP requests

### Performance:
- ✅ Batch FCM messages for multiple devices
- ✅ Handle FCM token expiration gracefully
- ✅ Implement retry logic for failed deliveries

### User Experience:
- ✅ Show notification permission request at appropriate time
- ✅ Handle case when user denies notification permission
- ✅ Provide fallback (SMS via Twilio) if FCM fails
- ✅ Auto-fill OTP when notification is tapped

### Monitoring:
- ✅ Log FCM delivery success/failure rates
- ✅ Monitor FCM token refresh frequency
- ✅ Alert on high FCM failure rates

---

## 📚 Next Steps

1. **Implement Frontend FCM Setup** - Add Firebase config and message listeners
2. **Update Backend AuthService** - Integrate FCM service with OTP flow  
3. **Add FCM Token Management** - Store and update user tokens
4. **Test on Physical Devices** - Verify notification delivery
5. **Add Fallback Mechanisms** - SMS via Twilio for FCM failures
6. **Production Hardening** - Security, monitoring, and error handling

This approach gives you:
- ✅ Free push notifications via Google's infrastructure
- ✅ Reliable delivery even when app is closed
- ✅ Support for multiple devices per user
- ✅ Secure OTP delivery without exposing codes
- ✅ Better user experience with auto-fill capabilities
