import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import Button from '@/components/onboard/Button';
import Carousel from '@/components/onboard/Carousel';
import { guideSteps } from '@/constants/Onboard';

const { width } = Dimensions.get('window');

export default function BookingGuide() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleFinish = () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        router.replace('/mobility');
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

    return (
        <View style={styles.container}>
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
                    style={styles.stepTitle}
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
                                <Text style={styles.stepText}>{step.main}</Text>

                                {/* Sub-steps with bullets */}
                                {step.subSteps && step.subSteps.length > 0 && (
                                    <View style={styles.subStepsContainer}>
                                        {step.subSteps.map((subStep, subIdx) => (
                                            <View key={subIdx} style={styles.subStepItem}>
                                                <Text style={styles.bulletPoint}>•</Text>
                                                <Text style={styles.subStepText} accessibilityRole='text' accessibilityLabel={`Sub-step ${subIdx + 1} of ${step.subSteps?.length}: ${subStep}`}>
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
                    style={[styles.navButton, currentSlide === 0 && styles.navButtonDisabled]}
                    onPress={goToPreviousSlide}
                    disabled={currentSlide === 0}
                    accessibilityRole="button"
                    accessibilityLabel="Previous step"
                    accessibilityHint="Go to the previous step in the guide"
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={currentSlide === 0 ? '#CCCCCC' : '#7135B1'}
                    />
                    <Text style={[styles.navButtonText, currentSlide === 0 && styles.navButtonTextDisabled]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, currentSlide === guideSteps.length - 1 && styles.navButtonDisabled]}
                    onPress={currentSlide < guideSteps.length - 1 ? goToNextSlide : handleFinish}
                    accessibilityRole="button"
                    accessibilityLabel="Next step"
                    accessibilityHint="Go to the next step in the guide"
                >
                    <Text style={styles.navButtonText}>
                        {currentSlide < guideSteps.length - 1 ? 'Next' : 'Finish'}
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color='#7135B1'
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        height: '40%',
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#46216E',
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
    stepNumberContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#7135B1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumber: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    stepContent: {
        flex: 1,
    },
    stepText: {
        fontSize: 16,
        color: '#333333',
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
        color: '#7135B1',
        marginRight: 8,
        lineHeight: 20,
    },
    subStepText: {
        fontSize: 14,
        color: '#666666',
        flex: 1,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
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
        color: '#7135B1',
        fontWeight: '500',
    },
    navButtonTextDisabled: {
        color: '#CCCCCC',
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    button: {
        width: '100%',
    },
});