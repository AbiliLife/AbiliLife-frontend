import { Stack } from 'expo-router';

export default function ServicesLayout() {
    return (
        <Stack>
          <Stack.Screen name="healthcare" options={{ headerShown: false }} />
          <Stack.Screen name="education" options={{ headerShown: false }} />
          <Stack.Screen name="employment" options={{ headerShown: false }} />
          <Stack.Screen name="insurance" options={{ headerShown: false }} />
        </Stack>
    );
}
