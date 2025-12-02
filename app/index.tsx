/* 
  THIS IS THE FILE FOR THE SPLASH SCREEN WITH SHORT ANIMATION AND NAVIGATION LOGIC
  IT HANDLES THE ANIMATION USING REANIMATED AND NAVIGATES BASED ON AUTHENTICATION STATUS
*/

// Tests todo:
// 1. Make sure splash screen shows correctly on app launch.
// 2. Verify animation plays smoothly without glitches. make sure it loops while auth is loading.
// 3. Confirm navigation to main app or welcome screen based on auth status.

// If is first time user, after splash screen, navigate to welcome screen. 
// If authenticated, navigate to main app.

import { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// Assets & Constants
import Colors from '@/constants/Colors';

// Context and Store
import { ThemeContext } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();

  // Obtain context and store values
  const { currentTheme } = useContext(ThemeContext);
  const { isAuthenticated, isAuthLoading } = useAuth();

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

  // Animation effect: keep animating while loading
  useEffect(() => {
    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;
      opacity.value = withTiming(1, { duration: 600 });
      scale.value = withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      );
      // Repeat animation if still loading
      if (isAuthLoading) {
        setTimeout(animate, 2300);
      }
    };
    animate();
    return () => { isMounted = false; };
  }, [isAuthLoading]);

  // Effect to hide splash and navigate when loading is done
  useEffect(() => {
    if (!isAuthLoading) {
      SplashScreen.hideAsync();
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          // router.replace('/simple-test'); // Go to test screen first TESTING ONLY
          router.replace('/(onboarding)/welcome');
        }
      }, 2000); // Short delay for smooth transition
    }
  }, [isAuthLoading, isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}>
      <Animated.Text style={[styles.textLarge, { color: currentTheme === 'light' ? Colors.primary : Colors.white }, animatedStyle]}>
        AbiliLife
      </Animated.Text>
      <Animated.Text style={[styles.version, { color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300 }, animatedStyle]}>
        Early Access Version 1.0.0
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLarge: {
    fontSize: 24,
    fontWeight: '500',
  },
  version: {
    fontSize: 12,
    marginTop: 8,
    position: 'absolute',
    bottom: '10%',
  }
});
