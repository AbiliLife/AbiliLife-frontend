import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function MobilityLayout() {
  const { currentTheme } = React.useContext(ThemeContext);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack>
        <Stack.Screen name="mobility" options={{ headerShown: false }} />
        <Stack.Screen name="caregiverBook" options={{
          headerTitle: 'Caregiver Booking',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: currentTheme === 'light' ? Colors.blue : Colors.white,
          },
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: currentTheme === 'light' ? Colors.blue : Colors.white,
          headerStyle: {
            backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
          },
        }} />
        <Stack.Screen name="rideBooking" options={{
          headerTitle: 'Book a Private Ride',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: currentTheme === 'light' ? Colors.blue : Colors.white,
          },
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: currentTheme === 'light' ? Colors.blue : Colors.white,
          headerStyle: {
            backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
          },
        }} />
        <Stack.Screen name="publicTransport" options={{ 
          headerTitle: 'Public Transport',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color:'#18181B',
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
         }} />
        <Stack.Screen name="rideConfirm" options={{ title: 'Ride Confirmation' }} />
        <Stack.Screen name="rideHistory" options={{ title: 'Ride History' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
