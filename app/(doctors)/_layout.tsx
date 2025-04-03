import { Stack } from 'expo-router';

export default function ServicesLayout() {
    return (
        <Stack>
          <Stack.Screen name="doc1" options={{ headerShown: false }} />
          <Stack.Screen name="doc2" options={{ headerShown: false }} />
        </Stack>
    );
}
