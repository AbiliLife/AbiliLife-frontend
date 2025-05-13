import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text, View } from '@/components/Themed';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
    image: any;
    title: string;
    description: string;
}

export default function OnboardingSlide({ item }: { item: OnboardingItem }) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withTiming(scale.value, { duration: 500 }) }],
        };
    });

    return (
        <View style={styles.slide}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
            </Animated.View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    slide: {
        width,
        height: '100%',
    },
    imageContainer: {
        height: '60%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: 350,
        height: 450,
    },
    textContainer: {
        paddingHorizontal: 24,
        paddingTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#AAAAAA',
        lineHeight: 22,
        textAlign: 'center',
    },
});