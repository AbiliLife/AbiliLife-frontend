import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { ThemeContext } from '@/contexts/ThemeContext';

import Colors from '@/constants/Colors';
import { guideSteps } from '@/constants/Onboard';

import Button from '@/components/onboard/Button';
import Carousel from '@/components/onboard/Carousel';
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';
import AccessibilityOption from '@/components/accessibility/AccessibilityOption';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

const { width } = Dimensions.get('window');

export default function BookingGuide() {
    const { currentTheme } = React.useContext(ThemeContext);
    const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

    const [currentSlide, setCurrentSlide] = useState(0);

    const handleFinish = () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        router.back();
    };
    const goToNextSlide = () => {
        if (currentSlide < guideSteps.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            handleFinish();
        }
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const goToPreviousSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const cancelGuide = () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        router.back();
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }}
            edges={['top', 'left', 'right']}
        >
            <Carousel
                currentIndex={currentSlide}
                showPagination={true}
                onPageChange={setCurrentSlide}
            >
                {guideSteps.map((tip, index) => (
                    <View key={index} style={styles.slide} accessibilityLabel={`Slide ${index + 1} of ${guideSteps.length}`} accessibilityHint='Swipe left or right to navigate through the tips'>
                        <Image
                            source={{ uri: tip.image }}
                            style={styles.image}
                            resizeMode="cover"
                            accessibilityRole='image'
                            accessibilityLabel={`Illustration for ${tip.title}`}
                        />
                    </View>
                ))}
            </Carousel>

            <View style={styles.contentContainer}>
                <Text
                    style={[styles.stepTitle, { color: currentTheme === 'light' ? Colors.blue : Colors.white }]}
                    accessibilityRole="header"
                    accessibilityLabel={`Step ${currentSlide + 1} of ${guideSteps.length}: ${guideSteps[currentSlide].title}`}
                    accessibilityHint="This is the title of the current step in the guide"
                >
                    {guideSteps[currentSlide].title}
                </Text>

                <View style={styles.stepsContainer}>
                    {guideSteps[currentSlide].steps.map((step, idx) => (
                        <View key={idx} style={styles.stepItem}>
                            <View style={styles.stepContent}>
                                <Text style={[styles.stepText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={`Step ${idx + 1} of ${guideSteps[currentSlide].steps.length}: ${step.main}`}>
                                    {step.main}
                                </Text>

                                {/* Sub-steps with bullets */}
                                {step.subSteps && step.subSteps.length > 0 && (
                                    <View style={styles.subStepsContainer}>
                                        {step.subSteps.map((subStep, subIdx) => (
                                            <View key={subIdx} style={styles.subStepItem}>
                                                {/* <Text style={styles.bulletPoint}>•</Text> */}
                                                <Text style={[styles.bulletPoint, { color: currentTheme === 'light' ? Colors.darkGray : Colors.lightGray }]}>
                                                    •
                                                </Text>
                                                <Text style={[styles.subStepText, { color: currentTheme === 'light' ? Colors.darkGray : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel={`Sub-step ${subIdx + 1} of ${step.subSteps?.length}: ${subStep}`}>
                                                    {subStep}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={currentSlide === 0 ? cancelGuide : goToPreviousSlide}
                    accessibilityRole="button"
                    accessibilityLabel="Previous step"
                    accessibilityHint="Go to the previous step in the guide"
                >
                    {currentSlide !== 0 && (
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={currentTheme === 'light' ? Colors.blue : Colors.white}
                        />
                    )}
                    <Text style={[styles.navButtonText, { color: currentSlide === 0 ? Colors.mediumGray : currentTheme === 'light' ? Colors.blue : Colors.white }]}>
                        {currentSlide === 0 ? 'Cancel' : 'Previous'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={currentSlide < guideSteps.length - 1 ? goToNextSlide : handleFinish}
                    accessibilityRole="button"
                    accessibilityLabel="Next step"
                    accessibilityHint="Go to the next step in the guide"
                >
                    <Text style={[styles.navButtonText, { color: currentTheme === 'light' ? Colors.blue : Colors.white }]}>
                        {currentSlide < guideSteps.length - 1 ? 'Next' : 'Done'}
                    </Text>

                    {currentSlide < guideSteps.length - 1 && (
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color={currentTheme === 'light' ? Colors.blue : Colors.white}
                        />
                    )}
                </TouchableOpacity>
            </View>

            {/* Accessibility Settings Button (fixed position) */}
            <AccessibilityOption
                handlePress={toggleAccessibilityDrawer}
                otherStyle={{ position: 'absolute', top: 0, left: 20, backgroundColor: Colors.blue, opacity: 0.8 }}
            />

            {/* Accessibility Drawer */}
            {accessibilityDrawerVisible && (
                <AccessibilityDrawer
                    handlePress={toggleAccessibilityDrawer}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: width * 0.8,
        height: width * 0.6,
        borderRadius: 20,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: Colors.accent,
        textAlign: 'center',
        lineHeight: 24,
    },
    contentContainer: {
        padding: 16,
        height: '50%',
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    stepsContainer: {
        marginBottom: 16,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stepContent: {
        flex: 1,
    },
    stepText: {
        fontSize: 16,
        marginBottom: 8,
    },
    subStepsContainer: {
        marginLeft: 8,
        marginTop: 4,
    },
    subStepItem: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        fontSize: 18,
        marginRight: 8,
        lineHeight: 20,
    },
    subStepText: {
        fontSize: 14,
        flex: 1,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    button: {
        width: '100%',
    },
});