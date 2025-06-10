import { Stack } from 'expo-router';

export default function MarketplaceLayout() {
    return (
        <Stack>
          <Stack.Screen name="marketplace" options={{ headerShown: false }} />
        </Stack>
    );
}
