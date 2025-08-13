import React from 'react';
import { Stack } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

import Colors from '@/constants/Colors';

export default function AuthLayout() {
  const { currentTheme } = React.useContext(ThemeContext);
  return (
    <Stack>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="otp" options={{
        headerTitle: 'Verify Your Phone',
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: currentTheme === 'light' ? Colors.primary : Colors.white,
        },
        headerStyle: {
          backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
        },
        headerTintColor: currentTheme === 'light' ? Colors.primary : Colors.white,
        headerBackVisible: false,
      }} />
    </Stack>
  );
}
