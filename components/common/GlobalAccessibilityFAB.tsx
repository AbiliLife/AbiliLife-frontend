import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, PanResponder, TouchableOpacity, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withRepeat,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

// Assets & Constants
import Colors from '@/constants/Colors';
import { Accessibility } from 'lucide-react-native';

// Context
import { useAccessibility } from '@/contexts/AccessibilityContext';

// Components - Agent & Accessibility
import AccessibilityDrawer from '../accessibility/AccessibilityDrawer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window'); // Get screen dimensions

// Define FAB sizes
const FAB_SIZE = 60;
const MINIMIZED_SIZE = 20;
const BOUNDS_PADDING = 10;

export default function GlobalAccessibilityFAB() {

    // Obtain context
    const { state, setFabPosition } = useAccessibility();

    // local State
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    // Animation values
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.8);
    const position = useSharedValue({ x: state.fabPosition.x, y: state.fabPosition.y });

    // Update position when loaded from context
    useEffect(() => {
        if (!state.isLoading) {
            position.value = withSpring(state.fabPosition);
        }
    }, [state.fabPosition, state.isLoading]);

    // Trigger Haptic Feedback
    const triggerHaptic = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    //
    const constrainPosition = (x: number, y: number) => {
        const currentSize = state.isMinimized ? MINIMIZED_SIZE : FAB_SIZE;
        return {
            x: Math.max(BOUNDS_PADDING, Math.min(SCREEN_WIDTH - currentSize - BOUNDS_PADDING, x)),
            y: Math.max(BOUNDS_PADDING, Math.min(SCREEN_HEIGHT - currentSize - BOUNDS_PADDING, y)),
        };
    };

    // Pan responder for drag functionality
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
            },
            onPanResponderGrant: () => {
                runOnJS(setIsDragging)(true);
                runOnJS(triggerHaptic)();
                scale.value = withSpring(1.1, { damping: 15, stiffness: 300 });
                opacity.value = withSpring(1, { damping: 15, stiffness: 300 });
            },
            onPanResponderMove: (evt, gestureState) => {
                const newX = state.fabPosition.x + gestureState.dx;
                const newY = state.fabPosition.y + gestureState.dy;
                const constrainedPosition = constrainPosition(newX, newY);
                position.value = constrainedPosition;
            },
            onPanResponderRelease: (evt, gestureState) => {
                const newX = state.fabPosition.x + gestureState.dx;
                const newY = state.fabPosition.y + gestureState.dy;
                const finalPosition = constrainPosition(newX, newY);

                position.value = withSpring(finalPosition, { damping: 15, stiffness: 300 });
                scale.value = withSpring(1, { damping: 15, stiffness: 300 });
                opacity.value = withSpring(0.8, { damping: 15, stiffness: 300 });

                runOnJS(setFabPosition)(finalPosition);
                runOnJS(setIsDragging)(false);
                runOnJS(triggerHaptic)();
            },
        })
    ).current;

    const handlePress = () => {
        if (!isDragging) {
            triggerHaptic();
            scale.value = withSequence(
                withSpring(0.9, { damping: 15, stiffness: 300 }),
                withSpring(1, { damping: 15, stiffness: 300 })
            );
            runOnJS(setDrawerVisible)(!isDrawerVisible);
        }
    };

    // Handle double press - move to nearest edge
    const handleDoublePress = () => {
        if (!isDragging) {
            triggerHaptic();

            const currentSize = state.isMinimized ? MINIMIZED_SIZE : FAB_SIZE;
            const centerX = position.value.x + currentSize / 2;
            const isLeftSide = centerX < SCREEN_WIDTH / 2;
            const targetX = isLeftSide ? BOUNDS_PADDING : SCREEN_WIDTH - currentSize - BOUNDS_PADDING;

            const finalPosition = { x: targetX, y: position.value.y };
            position.value = withSpring(finalPosition, { damping: 15, stiffness: 300 });
            runOnJS(setFabPosition)(finalPosition);
        }
    };

    // Pulsing effect (smooth and slow)
    useEffect(() => {
        if (!isDragging && !state.isMinimized) {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        } else {
            scale.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });
        }
    }, [isDragging, state.isMinimized]);

    // Animated style for the FAB
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: position.value.x },
            { translateY: position.value.y },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    if (state.isLoading) {
        return null;
    }

    const currentSize = state.isMinimized ? MINIMIZED_SIZE : FAB_SIZE;
    const iconSize = state.isMinimized ? 16 : 24;

    return (
        <>
            <Animated.View
                style={[
                    styles.container,
                    {
                        width: currentSize,
                        height: currentSize,
                    },
                    animatedStyle,
                ]}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity
                    style={[
                        styles.fab,
                        {
                            width: currentSize,
                            height: currentSize,
                            borderRadius: currentSize / 2,
                        },
                    ]}
                    onPress={handlePress}
                    onLongPress={handleDoublePress}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityLabel="Accessibility settings"
                    accessibilityRole="button"
                    accessibilityHint="Tap to open accessibility drawer, long press to move to edge"
                >
                    <BlurView intensity={80} style={styles.blurContainer}>
                        <View style={styles.fabContent}>
                            <Accessibility size={iconSize} color={Colors.blue} />
                        </View>
                    </BlurView>
                </TouchableOpacity>
            </Animated.View>

            <AccessibilityDrawer
                isVisible={isDrawerVisible}
                onClose={() => setDrawerVisible(false)}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 999,
        elevation: 10,
    },
    fab: {
        overflow: 'hidden',
        elevation: 8,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    blurContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

