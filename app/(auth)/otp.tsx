import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { images } from '@/constants/Images';
import Colors from '@/constants/Colors';
import Button from '@/components/onboard/Button';
import OTPInput from '@/components/onboard/OTPInput';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function OTPVerificationScreen() {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user, setAuthenticated, setCurrentStep } = useOnboardingStore();

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const handleResendCode = () => {
        if (timeLeft === 0) {
            if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
            }
            setTimeLeft(60);
            setError('');
            // Mock resend code logic
        }
    };

    const handleVerify = async () => {
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Mock verification delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For demo purposes, any 6-digit code is valid
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            setAuthenticated(true);
            setCurrentStep(3);
            router.replace('/profileSetup');
        } catch (error) {
            console.error('OTP verification error:', error);
            setError('Invalid verification code. Please try again.');
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >

                    <Image
                        source={images.signup}
                        style={{ width: '100%', height: 300, borderRadius: 10, marginBottom: 20 }}
                        resizeMode='contain'
                        accessibilityLabel="Signup Header Image"
                        accessibilityHint="An image representing the signup process"
                        accessibilityRole="image"
                    />
                    <Text style={styles.subtitle}>
                        We've sent a 6-digit code to{' '}
                        <Text style={styles.contactInfo}>
                            {user.phone || user.email}
                        </Text>
                    </Text>

                    <OTPInput
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        error={error}
                    />

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive the code? </Text>
                        <TouchableOpacity
                            onPress={handleResendCode}
                            disabled={timeLeft > 0}
                            accessibilityRole="button"
                            accessibilityLabel="Resend verification code"
                            accessibilityHint={timeLeft > 0 ? `Wait ${timeLeft} seconds to resend` : "Tap to resend verification code"}
                        >
                            <Text style={[
                                styles.resendButton,
                                timeLeft > 0 && styles.resendButtonDisabled
                            ]}>
                                {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend Code'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <Button
                        title="Verify"
                        onPress={handleVerify}
                        loading={loading}
                        style={styles.button}
                    />
                </View>

            </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.accent,
        textAlign: 'center',
        lineHeight: 24,
    },
    contactInfo: {
        fontWeight: '600',
        color: Colors.primary,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        fontSize: 14,
        color: Colors.accent,
    },
    resendButton: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    resendButtonDisabled: {
        color: Colors.mediumGray,
    },
    errorText: {
        color: Colors.error,
        fontSize: 14,
        marginVertical: 8,
        textAlign: 'center',
    },
    footer: {
        padding: 24,
        backgroundColor: Colors.background,
    },
    button: {
        width: '100%',
    },
});