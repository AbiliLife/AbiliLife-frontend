import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/contexts/ThemeContext';

import Colors from '@/constants/Colors';

export default function OnboardingLayout() {
  const { currentTheme } = React.useContext(ThemeContext);
  return (
      <Stack>
        <Stack.Screen name="onboard" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="profileSetup" options={{ headerShown: false }} />
        <Stack.Screen name="bookingGuide" options={{
          headerTitle: 'How to Book a Ride',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: currentTheme === 'light' ? Colors.blue : Colors.white,
          },
          headerStyle: {
            backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
          },
          headerRight: () => <Ionicons name="help-circle-outline" size={32} color={currentTheme === 'light' ? Colors.blue : Colors.white}  />,
        }} />
      </Stack>
  );
}
