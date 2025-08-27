import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Toast } from 'toastify-react-native';

// Assets & Constants
import { images } from '@/constants/Images';
import Colors from '@/constants/Colors';

// Components
import Button from '@/components/onboard/Button';
import OTPInput from '@/components/onboard/OTPInput';
import CustomModal from '@/components/common/CustomModal';

// Context & Store
import { ThemeContext } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingStore } from '@/store/onboardingStore';

// Utility Functions
import { formatHiddenPhoneNumber, formatPhoneNumber } from '@/utils/formatPhone';
import { formatTime } from '@/utils/formatTimer';

// Beta Badge - for pilot mode
const BetaBadge = () => {
    return (
        <View style={styles.betaBadgeContainer}>
            <Text style={styles.betaBadgeText}>Pilot Mode - Early Access</Text>
        </View>
    );
};

export default function OTPVerificationScreen() {

    // Local state variables
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
    const [error, setError] = useState('');
    const [resendModalVisible, setResendModalVisible] = useState(false);

    // Obtain context values
    const { currentTheme } = React.useContext(ThemeContext);
    const { user } = useOnboardingStore();
    const { verifyOTP, isAuthLoading, requestOTP } = useAuth();

    // Effect to handle countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const handleResendCode = async () => {
        if (timeLeft === 0) {
            setResendModalVisible(true);
            const otpResponse = await requestOTP({ phone: formatPhoneNumber(user.phone) });
            if (otpResponse.success) {
                if (Platform.OS !== 'web') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                };
                Toast.show({
                    type: 'success',
                    text1: 'OTP Sent',
                    text2: otpResponse.message,
                    visibilityTime: 3000,
                    position: 'top',
                    theme: currentTheme === 'light' ? 'light' : 'dark',
                });
                setTimeLeft(5 * 60); // Reset timer to 5 minutes
                setResendModalVisible(false);
            } else {
                if (Platform.OS !== 'web') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                };
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: otpResponse.message,
                    visibilityTime: 3000,
                    position: 'top',
                    theme: currentTheme === 'light' ? 'light' : 'dark',
                });
            }
        }
    };

    const handleVerify = async () => {
        // 1. Validate OTP length
        if (otp.length !== 6) {
            Toast.error('Please enter a valid 6-digit code');
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            return;
        }

        // 2. Send OTP for verification
        const otpResponseData = await verifyOTP({
            phone: user.phone,
            otp: otp,
        });

        // 3. Handle response
        if (otpResponseData.success) {
            Toast.show({
                type: 'success',
                text1: 'Verification Successful',
                text2: otpResponseData.message,
                position: 'top',
                visibilityTime: 2000,
                theme: currentTheme,
                onHide: () => router.replace('/profileSetup')
            })
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: otpResponseData.message,
                position: 'bottom',
                visibilityTime: 2000,
                theme: currentTheme,
            });
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            setError(otpResponseData.message || 'Verification failed. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
        >
            <BetaBadge />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                accessible={true}
            >

                <Image
                    source={images.signup}
                    style={{ width: '100%', height: 300, borderRadius: 10, marginBottom: 20 }}
                    resizeMode='contain'
                    accessible={true}
                    accessibilityRole="image"
                    accessibilityLabel="OTP Header Image"
                    accessibilityHint="An image representing the OTP verification process"
                />

                <Text style={[styles.subtitle, { color: currentTheme === 'light' ? Colors.black : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel={`Verify your phone number to continue. We've sent a 6-digit code to ${user.phone}`}>
                    We've sent a 6-digit code to{`\n`}
                    <Text style={styles.contactInfo}>
                        {formatHiddenPhoneNumber(user.phone)}
                    </Text>
                </Text>

                <OTPInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    error={error}
                />

                <View style={styles.resendContainer}>
                    <Text style={[styles.resendText, { color: currentTheme === 'light' ? Colors.black : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Didn't receive the code?">
                        Didn't receive the code?{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={handleResendCode}
                        disabled={timeLeft > 0}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend Code'}
                        accessibilityHint={timeLeft > 0 ? `Wait ${formatTime(timeLeft)} to resend` : "Tap to resend verification code"}
                    >
                        <Text style={[
                            styles.resendButton,
                            timeLeft > 0 && styles.resendButtonDisabled,
                        ]}>
                            {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend Code'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <CustomModal
                visible={resendModalVisible}
                onRequestClose={() => setResendModalVisible(false)}
                title="Resend Code"
                message={`Resend the verification code to ${formatHiddenPhoneNumber(user.phone)}?`}
                handlePressAction={handleResendCode}
                actionLoading={isAuthLoading}
                handleCancel={() => setResendModalVisible(false)}
                otherProps={{
                    accessibilityLabel: 'OTP Modal',
                    accessibilityHint: 'A modal for requesting OTP',
                }}
            />

            <View style={[styles.footer, { borderTopColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]}>
                <Button
                    title="Verify"
                    onPress={handleVerify}
                    loading={isAuthLoading}
                    style={styles.button}
                />
            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: Colors.secondary,
        fontSize: 16,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        fontSize: 14,
    },
    resendButton: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
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
        backgroundColor: Colors.transparent,
        borderTopWidth: 1,
    },
    button: {
        width: '100%',
    },


    betaBadgeContainer: {
        alignSelf: 'center',
        backgroundColor: Colors.orange,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 10,
    },
    betaBadgeText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
});