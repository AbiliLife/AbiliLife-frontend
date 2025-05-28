import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function MobilityLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#18181B' : '#fff' }}>
      <Stack>
        <Stack.Screen name="mobility" options={{
          headerTitle: 'AbiliLife Mobility',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#18181B',
          },
          headerLeft: () => (
            <ChevronLeft
              size={28}
              color={colorScheme === 'dark' ? '#fff' : '#18181B'}
              onPress={() => router.back()}
            />
          ),
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#18181B' : '#fff',
          },
        }} />
        <Stack.Screen name="caregiverBook" options={{
          headerTitle: 'Caregiver Booking',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#18181B',
          },
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#18181B' : '#fff',
          },
          headerLeft: () => (
            <ChevronLeft
              size={28}
              color={colorScheme === 'dark' ? '#fff' : '#18181B'}
              onPress={() => router.back()}
            />
          )
        }} />
        <Stack.Screen name="rideBooking" options={{
          headerTitle: 'Book a Private Ride',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#18181B',
          },
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#18181B' : '#fff',
          },
          headerLeft: () => (
            <ChevronLeft
              size={28}
              color={colorScheme === 'dark' ? '#fff' : '#18181B'}
              onPress={() => router.back()}
            />
          )
        }} />
        <Stack.Screen name="rideConfirm" options={{ title: 'Ride Confirmation' }} />
        <Stack.Screen name="rideHistory" options={{ title: 'Ride History' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
