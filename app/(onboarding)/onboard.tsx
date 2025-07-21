import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import illustrations from '@/assets/data/illustrations';
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
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            handleGetStarted();
        }
    };

    const handleGetStarted = () => {
        setCurrentStep(1);
        router.replace({
            pathname: '/auth',
            params: { fromOnboarding: 'true' }
        });
    };

    const slides = [
        {
            title: "Welcome to AbiliLife",
            subtitle: "Empowering independence through accessible solutions",
            image: illustrations.welcome,
        },
        {
            title: "Explore Mobility Options",
            subtitle: "Find the best transport solutions tailored for you",
            image: illustrations.mobilityOption,
        },
        {
            title: "Book Your Ride",
            subtitle: "Schedule rides with just a few taps",
            image: illustrations.bookRide,
        },
        {
            title: "Caregiver Support",
            subtitle: "Connect with caregivers for added assistance",
            image: illustrations.caregiver,
        },
        {
            title: "Personalize Your Experience",
            subtitle: "Set preferences to enhance your journey",
            image: illustrations.preferences,
        },
        {
            title: "We're Here to Help",
            subtitle: "24/7 support for all your needs",
            image: illustrations.support,
        }
    ];

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }}
            edges={['top', 'left', 'right']}
        >
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
                    title={currentSlide < slides.length - 1 ? "Next" : "Create an Account"}
                    onPress={handleNext}
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
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