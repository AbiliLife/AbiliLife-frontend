import { Stack, usePathname } from 'expo-router';
import 'react-native-reanimated';

import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import ThemeProvider from '@/contexts/ThemeContext';
import AuthProvider from '@/contexts/AuthContext';
import ToastManager from 'toastify-react-native';

import GlobalAccessibilityFAB from '@/components/common/GlobalAccessibilityFAB';
// FUTUTRE FABs TO ADD:
// 1. GlobalThemeFAB - to toggle themes quickly - IMPORTANT
// 2. GlobalLanguageFAB - to switch app languages on the fly - OPTIONAL (can be added later)
// 3. Abby - to access AI assistant features (chat, help, tips, etc.) - IMPORTANT

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync(); --- already called in app/index.tsx

export default function RootLayout() {
  // 1. Wrap the entire app in AccessibilityProvider to manage accessibility settings globally.
  // 2. Wrap in ThemeProvider to handle theming (light/dark/system) across the app.
  // 3. Wrap in AuthProvider to manage user authentication state and provide auth functions.
  // 4. Define the Stack navigator for routing between screens.
  // 5. Include GlobalAccessibilityFAB to allow users to access accessibility settings from anywhere in the app.
  // 6. Include ToastManager for displaying toast notifications throughout the app.

  // NOTE: Can be done in a different order if needed, but this order ensures context providers are available to all screens.

  const pathname = usePathname();
  const shouldShowFAB = pathname !== "/"; // Hide FAB on splash screen (index.tsx)

  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: true, presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ headerShown: true, presentation: 'modal' }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: true, presentation: 'modal' }} />
            <Stack.Screen name="simple-test" options={{ headerShown: false }} />
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
          {shouldShowFAB && <GlobalAccessibilityFAB />}
          <ToastManager />
        </AuthProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );;
}
