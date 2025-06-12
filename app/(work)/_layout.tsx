import { Stack } from 'expo-router';

export default function JobsLayout() {
    return (
        <Stack>
          <Stack.Screen name="employment" options={{ headerShown: false }} />
        </Stack>
    );
}
