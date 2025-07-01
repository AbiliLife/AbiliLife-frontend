import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import illustrations from '@/assets/data/illustrations';

import { images } from '@/constants/Images';
import Colors from '@/constants/Colors';
import Button from '@/components/onboard/Button';
import Carousel from '@/components/onboard/Carousel';

import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';

const { width } = Dimensions.get('window');

const Welcome = () => {
    const router = useRouter();

    const { currentTheme } = React.useContext(ThemeContext);

    const [currentSlide, setCurrentSlide] = useState(0);
    const { setCurrentStep } = useOnboardingStore();

    const handleNext = () => {
        if (currentSlide < 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            handleGetStarted();
        }
    };

    const handleGetStarted = () => {
        setCurrentStep(1);
        router.replace('/auth');
    };

    const slides = [
        {
            title: "Welcome to AbiliLife",
            subtitle: "Your journey to a more accessible life starts here.",
            image: illustrations.welcome,
        },
        {
            title: "Accessible Rides at Your Fingertips",
            subtitle: "Book, plan, and track mobility with ease",
            image: illustrations.accessibleRide,
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}>
            <View style={styles.skipContainer}>
                <Button
                    title="Skip"
                    variant="outline"
                    onPress={handleGetStarted}
                    style={styles.skipButton}
                    textStyle={styles.skipButtonText}
                />
            </View>

            <Carousel
                currentIndex={currentSlide}
                showPagination={true}
                onPageChange={setCurrentSlide}
            >
                {slides.map((slide, index) => (
                    <View key={index} style={styles.slide}>
                        <Image
                            source={{ uri: slide.image }}
                            style={styles.image}
                            resizeMode="cover"
                            accessibilityLabel={`Illustration for ${slide.title}`}
                        />
                        <View style={styles.textContainer}>
                            <Text style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel={slide.title}>
                                {slide.title}
                            </Text>
                            <Text style={[styles.subtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel={slide.subtitle}>
                                {slide.subtitle}
                            </Text>
                        </View>
                    </View>
                ))}
            </Carousel>

            <View style={styles.footer}>
                <Button
                    title={currentSlide < slides.length - 1 ? "Next" : "Get Started"}
                    onPress={handleNext}
                    style={styles.button}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: 20,
        marginBottom: 40,
    },
    skipContainer: {
        position: 'absolute',
        top: 45,
        right: 16,
        zIndex: 10,
    },
    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 0,
    },
    skipButtonText: {
        fontSize: 14,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    button: {
        width: '100%',
    },
})

export default Welcome