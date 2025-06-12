import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{
        headerTitle: 'Welcome Back!',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: 'bold',
          color: '#7135B1',
        },
        headerTintColor: '#7135B1',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#F5F5F5',
        },
        headerBackButtonDisplayMode: 'minimal',
      }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}
