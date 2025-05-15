import { Stack } from 'expo-router';

export default function InsuranceLayout() {
    return (
        <Stack>
          <Stack.Screen name="insurance" options={{ headerShown: false }} />
        </Stack>
    );
}
