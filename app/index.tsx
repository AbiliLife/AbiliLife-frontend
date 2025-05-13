import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { Text, useThemeColor, View } from '@/components/Themed';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const textColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Hide the native splash screen
    SplashScreen.hideAsync();

    // Fade in and animate the splash screen
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSequence(
      withTiming(1.1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(1, { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    );

    // Navigate to the login screen after animation
    const navigationTimer = setTimeout(() => {
      router.replace('/(onboarding)/onboard');
    }, 2500);

    return () => {
      clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Text style={styles.textLarge}>AbiliLife</Text>
        <Text style={styles.version}>Version 1.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  textLarge: {
    fontSize: 24,
    fontWeight: '500',
  },
  version: {
    fontSize: 12,
    marginTop: 8,
    color: '#666',
  }
});
