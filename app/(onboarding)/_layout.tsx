import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/contexts/ThemeContext';

import Colors from '@/constants/Colors';

export default function OnboardingLayout() {
  const { currentTheme } = React.useContext(ThemeContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Stack>
        <Stack.Screen name="onboard" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="profileSetup" options={{ headerShown: false }} />
        <Stack.Screen name="bookingGuide" options={{
          headerTitle: 'How to Book a Ride',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F5F5F5',
          },
        }} />
      </Stack>
      <StatusBar backgroundColor={currentTheme === 'light' ? Colors.lightContainer : Colors.black} style={currentTheme === 'light' ? 'dark' : 'light'} />
    </SafeAreaView>
  );
}
