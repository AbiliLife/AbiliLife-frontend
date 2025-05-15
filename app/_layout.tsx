import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { AccessibilityProvider } from '@/contexts/AccessibilityContext';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AccessibilityProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(insurance)" options={{ headerShown: false }} />
          <Stack.Screen name="(mobility)" options={{ headerShown: false }} />
          <Stack.Screen name="(care)" options={{ headerShown: false }} />
          <Stack.Screen name="(work)" options={{ headerShown: false }} />
          <Stack.Screen name="(learn)" options={{ headerShown: false }} />
        </Stack>
      </AccessibilityProvider>
    </ThemeProvider>
  );;
}
