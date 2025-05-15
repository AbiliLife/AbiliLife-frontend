import { Stack } from 'expo-router';

export default function HealthCareLayout() {
    return (
        <Stack>
          <Stack.Screen name="healthcare" options={{ headerShown: false }} />
          <Stack.Screen name="doctors/[doc]" options={{ headerShown: false, title: "Doctor Details" }} />
        </Stack>
    );
}
