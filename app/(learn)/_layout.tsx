import { Stack } from 'expo-router';

export default function EducationLayout() {
    return (
        <Stack>
          <Stack.Screen name="education" options={{ headerShown: false }} />
        </Stack>
    );
}
