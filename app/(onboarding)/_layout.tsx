import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingLayout() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Stack>
          <Stack.Screen name="onboard" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="profileSetup" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    );
}
