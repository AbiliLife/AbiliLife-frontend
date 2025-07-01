import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/contexts/ThemeContext';

import Colors from '@/constants/Colors';

export default function AuthLayout() {
  const { currentTheme } = React.useContext(ThemeContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
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
          headerBackButtonDisplayMode: 'minimal',
        }} />
      </Stack>
      <StatusBar backgroundColor={currentTheme === 'light' ? Colors.lightContainer : Colors.black} style={currentTheme === 'light' ? 'dark' : 'light'} />
    </SafeAreaView>
  );
}
