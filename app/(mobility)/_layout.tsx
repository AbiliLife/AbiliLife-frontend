import { Stack } from 'expo-router';

export default function MobilityLayout() {
    return (
        <Stack>
          <Stack.Screen name="mobility" options={{ headerShown: false }} />
        </Stack>
    );
}
