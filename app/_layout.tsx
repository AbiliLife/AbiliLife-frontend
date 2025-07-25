import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import ThemeProvider from '@/contexts/ThemeContext';
import AuthProvider from '@/contexts/AuthContext';
import ToastManager from 'toastify-react-native'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: true, presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ headerShown: true, presentation: 'modal' }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: true, presentation: 'modal' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(insurance)" options={{ headerShown: false }} />
            <Stack.Screen name="(mobility)" options={{ headerShown: false }} />
            <Stack.Screen name="(care)" options={{ headerShown: false }} />
            <Stack.Screen name="(work)" options={{ headerShown: false }} />
            <Stack.Screen name="(learn)" options={{ headerShown: false }} />
            <Stack.Screen name="(access)" options={{ headerShown: false }} />
          </Stack>
          <ToastManager />
        </AuthProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );;
}
