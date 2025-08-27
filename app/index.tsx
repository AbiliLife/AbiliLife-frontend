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
import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();
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
          router.replace('/welcome');
        }
      }, 2000); // Short delay for smooth transition
    }
  }, [isAuthLoading, isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}>
      <Animated.Text style={[styles.textLarge, { color: currentTheme === 'light' ? Colors.primary : Colors.white }, animatedStyle]}>
        AbiliLife
      </Animated.Text>
      <Animated.Text style={[styles.version, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }, animatedStyle]}>
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
