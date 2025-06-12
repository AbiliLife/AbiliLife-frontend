import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function MobilityLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack>
        <Stack.Screen name="mobility" options={{
          headerTitle: 'AbiliLife Mobility',
          headerShadowVisible: false,
          headerTintColor: '#7135B1',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#7135B1',
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
        }} />
        <Stack.Screen name="caregiverBook" options={{
          headerTitle: 'Caregiver Booking',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color:'#18181B',
          },
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: {
            backgroundColor: '#fff',
          },
        }} />
        <Stack.Screen name="rideBooking" options={{
          headerTitle: 'Book a Private Ride',
          headerTitleAlign: 'center',
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
