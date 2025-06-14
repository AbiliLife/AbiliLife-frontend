import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{
          headerTitle: 'Verify Your Phone',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F5F5F5',
          },
        }} />
      </Stack>
    </SafeAreaView>
  );
}
