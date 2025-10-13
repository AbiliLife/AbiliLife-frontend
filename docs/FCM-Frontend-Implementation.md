# FCM Frontend Implementation Guide

## ✅ **Complete FCM Frontend Implementation**

### **📁 Files Created:**

1. **`config/firebase.ts`** - Firebase configuration and token management
2. **`services/fcmMessageService.ts`** - Message listeners and handlers  
3. **`services/fcmTokenService.ts`** - Token storage and backend sync
4. **`services/fcmIntegration.ts`** - Integration example and usage guide

---

## 🚀 **Integration Steps**

### **Step 1: Update Your Main Layout**

Add this to your `app/_layout.tsx` or main App component:

```typescript
import { setupBackgroundMessageHandler } from '@/services/fcmMessageService';
import { useFCMIntegration } from '@/services/fcmIntegration';

// IMPORTANT: Call this at the top level (outside components)
setupBackgroundMessageHandler();

export default function RootLayout() {
  // Initialize FCM integration
  const { fcmInitialized } = useFCMIntegration();

  // Your existing layout code...
  return (
    <Stack>
      {/* Your screens */}
    </Stack>
  );
}
```

### **Step 2: Update AuthContext for FCM Token Management**

Add to your `contexts/AuthContext.tsx`:

```typescript
import { initializeFCMForUser, cleanupFCMForUser } from '@/services/fcmTokenService';

// In your login function, after successful authentication:
const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  // ... existing login code
  
  if (responseData.success) {
    // ... existing success handling
    
    // Initialize FCM for the authenticated user
    if (responseData.user?.phone) {
      await initializeFCMForUser(responseData.user.phone);
    }
  }
  
  // ... rest of function
};

// In your logout function:
const logout = async () => {
  // ... existing logout code
  
  // Cleanup FCM
  await cleanupFCMForUser();
};
```

### **Step 3: Update OTP Screen for FCM Messages**

Modify your `app/(auth)/otp.tsx` to handle FCM-delivered OTPs:

```typescript
import { useFCMListeners, OTPMessageData } from '@/services/fcmMessageService';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState('');
  
  // Listen for FCM OTP messages
  useFCMListeners({
    onOTPReceived: (otpData: OTPMessageData) => {
      console.log('🔐 OTP received via FCM:', otpData.otp);
      
      // Auto-fill the OTP input
      setOtp(otpData.otp);
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Verification Code Received',
        text2: 'Code auto-filled from notification',
        visibilityTime: 3000,
      });
    }
  });

  // Rest of your existing OTP screen code...
}
```

### **Step 4: Remove OTP from URL Parameters**

Update your `app/(auth)/auth.tsx` to remove the temporary OTP passing:

```typescript
// In the OTP request success handler, change from:
router.replace({ 
  pathname: '/otp', 
  params: { otp: otpResponse.otp } // REMOVE THIS
});

// To:
router.replace('/otp'); // Clean navigation
```

Also remove the OTP toast display in `otp.tsx`:

```typescript
// REMOVE this useEffect that shows OTP in toast:
// useEffect(() => {
//   if (sentOtp) {
//     Toast.show({
//       type: 'info',
//       text1: `YOUR OTP IS: ${sentOtp}`,
//       // ... rest of toast config
//     });
//   }
// }, []);
```

---

## 🔧 **Testing Your Implementation**

### **Test 1: FCM Token Registration**
1. Run your app on a physical device
2. Sign up or log in with a phone number
3. Check console logs for FCM token registration success

### **Test 2: OTP Delivery via FCM**
1. Request an OTP during signup/login
2. Check if notification appears on device
3. Verify OTP auto-fills in the input field

### **Test 3: Backend Integration**
1. Use the test endpoint: `POST /api/v1/auth/fcm-test`
2. Send test notification to your phone number
3. Verify notification is received

### **Test Command for Backend:**
```bash
curl -X POST https://abililife-backend-api.onrender.com/api/v1/auth/fcm-test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "message": "Test from manual testing"}'
```

---

## 🎯 **Key Features Implemented**

### **✅ Firebase Configuration**
- FCM token generation and validation
- iOS/Android permission handling
- Device compatibility checks

### **✅ Message Handling**
- Foreground message listeners
- Background message processing
- Notification tap navigation
- OTP-specific message handling

### **✅ Token Management**
- Local token storage with timestamps
- Automatic backend synchronization
- Token refresh handling
- Cleanup on logout

### **✅ Error Handling**
- Network failure recovery
- Permission denial handling
- Token validation
- Comprehensive logging

---

## 🔄 **Current vs New OTP Flow**

### **Before (Current):**
```
User requests OTP → Backend generates → Returns in API response → Passed via URL → Displayed in toast
```

### **After (With FCM):**
```
User requests OTP → Backend generates → Sends via FCM → Push notification → Auto-fills in app
```

---

## 🛠️ **Optional Enhancements**

### **1. Add FCM Test Button (Development)**
Add a test button in your settings or debug screen:

```typescript
import { testFCMFunctionality } from '@/services/fcmIntegration';

// In your component:
<Button 
  title="Test FCM" 
  onPress={() => testFCMFunctionality(user.phone)} 
/>
```

### **2. Add Notification Settings**
Allow users to enable/disable notifications:

```typescript
import { requestPermissionsWithDialog } from '@/config/firebase';

const handleEnableNotifications = async () => {
  const granted = await requestPermissionsWithDialog();
  if (granted) {
    // Re-initialize FCM for user
    await initializeFCMForUser(user.phone, true);
  }
};
```

### **3. Add Fallback for FCM Failures**
You mentioned adding Twilio later - the current implementation already has fallback handling in place.

---

## 🚨 **Important Notes**

1. **Physical Device Required**: FCM only works on real devices, not simulators
2. **Permissions**: iOS requires explicit permission request
3. **Background Handler**: Must be set up outside React components
4. **Token Refresh**: Handled automatically with listeners
5. **Security**: FCM tokens are stored securely using expo-secure-store

---

## 🎉 **Ready for Testing!**

Your FCM implementation is now complete and ready for manual testing on a physical device. The system will:

1. ✅ Initialize FCM when user authenticates
2. ✅ Store FCM tokens in backend 
3. ✅ Listen for OTP notifications
4. ✅ Auto-fill OTP codes
5. ✅ Handle token refresh automatically
6. ✅ Clean up on logout

**Next Steps:**
1. Test on a physical device
2. Verify OTP delivery works
3. Add any custom notification handling
4. Consider adding Twilio fallback later