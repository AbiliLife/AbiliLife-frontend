import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constants
import Colors from '@/constants/Colors';

// Store
import { useOnboardingStore } from '@/store/onboardingStore';

interface Step {
    id: number;
    title: string;
    description: string;
}

interface Props {
    steps: Step[];
    currentStep: number;
    completedSteps: number[];
    currentTheme: 'light' | 'dark';
}

const StepIndicator: React.FC<Props> = ({ steps, currentStep, completedSteps, currentTheme }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const scaleAnimations = useRef(steps.map(() => new Animated.Value(0.8))).current;
    const progressAnimation = useRef(new Animated.Value(0)).current;

    const { currentOnboardingStep } = useOnboardingStore();

    useEffect(() => {
        // Animate progress bar
        const safeCompletedSteps = Array.isArray(completedSteps) ? completedSteps : [];
        const nextStep = currentOnboardingStep;
        const nextCompletedSteps = safeCompletedSteps.includes(nextStep) ? safeCompletedSteps : [...safeCompletedSteps, nextStep];
        const progressPercent = Math.max(0, Math.min(100, (nextCompletedSteps.length / steps.length) * 100));
        Animated.timing(progressAnimation, {
            toValue: progressPercent,
            duration: 600,
            useNativeDriver: false,
        }).start();

        // Animate step scales
        steps.forEach((step, index) => {
            const status = getStepStatus(step.id);
            const targetScale = status === 'current' ? 1 : status === 'completed' ? 1 : 0.9;

            Animated.spring(scaleAnimations[index], {
                toValue: targetScale,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }).start();
        });

        // Auto-scroll to current step
        if (scrollViewRef.current) {
            const stepWidth = 120; // Approximate width of each step
            const scrollPosition = Math.max(0, (currentStep - 2) * stepWidth);

            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: scrollPosition,
                    animated: true,
                });
            }, 100);
        }
    }, [currentStep, completedSteps]);

    const getStepStatus = (stepId: number) => {
        if (completedSteps && completedSteps.includes(stepId)) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'upcoming';
    };

    const getStepStyle = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                };
            case 'current':
                return {
                    backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800,
                    borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.white,
                    borderWidth: 2,
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 6,
                };
            default:
                return {
                    backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800,
                    borderColor: Colors.gray400,
                    borderWidth: 2,
                };
        }
    };

    const getStepTextColor = (status: string) => {
        switch (status) {
            case 'completed':
                return Colors.white;
            case 'current':
                return currentTheme === 'light' ? Colors.primary : Colors.white;
            default:
                return Colors.gray300;
        }
    };

    return (
        <View style={styles.container}>
            {/* Animated Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { backgroundColor: currentTheme === 'light' ? Colors.gray700 : Colors.gray300 }]} accessible={true} accessibilityRole="progressbar" accessibilityLabel={`Onboarding progress: ${currentStep} of ${steps.length}`}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: progressAnimation.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                }),
                                backgroundColor: Colors.primary,
                            }
                        ]}
                    />
                </View>
                <Text style={[styles.progressText, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='text' accessibilityLabel={`Step ${currentStep} of ${steps.length}`}>
                    Step {currentStep} of {steps.length}
                </Text>
            </View>

            {/* Horizontal Scrollable Steps */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stepsContainer}
                style={styles.scrollView}
                accessible={true}
                accessibilityLabel="Onboarding steps"
                accessibilityHint='Horizontal scroll to view all steps'
            >
                {steps.map((step, index) => {
                    const status = getStepStatus(step.id);
                    const stepStyle = getStepStyle(status);
                    const textColor = getStepTextColor(status);

                    return (
                        <View key={step.id} style={styles.stepWrapper}>
                            <Animated.View
                                style={[
                                    styles.step,
                                    { transform: [{ scale: scaleAnimations[index] }] }
                                ]}
                            >
                                <View style={[styles.stepCircle, stepStyle]}>
                                    {status === 'completed' ? (
                                        <Animated.View style={{ transform: [{ scale: scaleAnimations[index] }] }}>
                                            <Ionicons name="checkmark" size={20} color={Colors.white} />
                                        </Animated.View>
                                    ) : status === 'current' ? (
                                        <Animated.View style={{ transform: [{ scale: scaleAnimations[index] }] }}>
                                            <View style={styles.currentStepInner}>
                                                <Text style={[styles.stepNumber, { color: textColor, fontSize: 16, fontWeight: 'bold' }]}>
                                                    {step.id}
                                                </Text>
                                            </View>
                                        </Animated.View>
                                    ) : (
                                        <Text style={[styles.stepNumber, { color: textColor }]}>
                                            {step.id}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.stepContent}>
                                    <Text style={[
                                        styles.stepTitle,
                                        {
                                            color: status === 'current'
                                                ? Colors.white
                                                : status === 'completed'
                                                    ? Colors.white
                                                    : currentTheme === 'light' ? Colors.gray600 : Colors.gray400,
                                            fontWeight: status === 'current' ? 'bold' : '600',
                                            fontSize: status === 'current' ? 14 : 12,
                                        }
                                    ]}
                                        accessibilityRole='text'
                                        accessibilityLabel={step.title}
                                    >
                                        {step.title}
                                    </Text>

                                    {status === 'current' && (
                                        <Animated.View style={{ opacity: scaleAnimations[index] }}>
                                            <Text style={[
                                                styles.stepDescription,
                                                { color: currentTheme === 'light' ? Colors.gray600 : Colors.gray400 }
                                            ]}
                                                accessibilityRole='text'
                                                accessibilityLabel={step.description}
                                            >
                                                {step.description}
                                            </Text>
                                        </Animated.View>
                                    )}
                                </View>
                            </Animated.View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    progressBarContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    scrollView: {
        paddingVertical: 4,
        backgroundColor: Colors.transparent,
    },
    stepsContainer: {
        paddingHorizontal: 16,
        alignItems: 'center',
        minWidth: '100%',
    },
    stepWrapper: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    step: {
        alignItems: 'center',
        minWidth: 100,
        overflow: 'hidden',
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    currentStepInner: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '600',
    },
    stepContent: {
        alignItems: 'center',
        minHeight: 44,
        justifyContent: 'flex-start',
    },
    stepTitle: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 10,
        textAlign: 'center',
        lineHeight: 14,
        maxWidth: 80,
    },
});

export default StepIndicator;
