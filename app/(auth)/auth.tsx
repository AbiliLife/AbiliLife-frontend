import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { images } from '@/constants/Images';
import Colors from '@/constants/Colors';

import Button from '@/components/onboard/Button';
import FormField from '@/components/common/FormField';

import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';

type AuthTab = 'login' | 'signup';

export default function AuthScreen() {
    const [activeTab, setActiveTab] = useState<AuthTab>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { currentTheme } = React.useContext(ThemeContext);
    const { updateUser, setCurrentStep, user } = useOnboardingStore();

    const handleTabChange = (tab: AuthTab) => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }
        setActiveTab(tab);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{10,15}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        if (activeTab === 'signup') {
            if (!fullName.trim()) newErrors.fullName = 'Full name is required';

            if (!email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!emailRegex.test(email)) {
                newErrors.email = 'Invalid email address';
            }

            if (!phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (!phoneRegex.test(phone)) {
                newErrors.phone = 'Invalid phone number';
            }

            if (!newPassword.trim()) {
                newErrors.newPassword = 'Password is required';
            } else if (!passwordRegex.test(newPassword)) {
                newErrors.newPassword = 'Password must be at least 8 characters and include a letter and a number';
            }

            if (!confirmPassword.trim()) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (newPassword !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        if (activeTab === 'login') {
            if (!email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!emailRegex.test(email)) {
                newErrors.email = 'Invalid email address';
            }

            if (!password.trim()) {
                newErrors.password = 'Password is required';
            }

            if (user.email && user.email !== email) {
                newErrors.email = 'Email does not match our records';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            // Mock API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));


            if (activeTab === 'signup') {
                // Here you would typically call your signup API
                // For demonstration, we will just log the data
                console.log('Signing up with:', {
                    fullName,
                    email,
                    phone,
                    password: newPassword,
                });

                // Update user data
                updateUser({
                    fullName: activeTab === 'signup' ? fullName : '',
                    email,
                    phone,
                });

                // Reset form fields
                setFullName('');
                setEmail('');
                setPhone('');
                setNewPassword('');
                setConfirmPassword('');

                // Navigate to OTP screen
                router.push('/otp');
                setCurrentStep(2);
            } else if (activeTab === 'login') {
                // Here you would typically call your login API
                // For demonstration, we will just log the data
                console.log('Logging in with:', {
                    email,
                    password,
                });

                // Reset form fields
                setEmail('');
                setPassword('');

                // Navigate to home screen
                router.push('/(tabs)');
            }

        } catch (error) {
            console.error('Auth error:', error);
            setErrors({ general: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel={activeTab === 'login' ? "Welcome Back!" : "Create an Account"}>
                    {activeTab === 'login' ? "Welcome Back!" : "Create an Account"}
                </Text>
                <Text style={[styles.subtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel={activeTab === 'login' ? "Enter your credentials to access your account." : "Fill in the details to create a new account."}>
                    {activeTab === 'login'
                        ? "Enter your credentials to access your account."
                        : "Fill in the details to create a new account."}
                </Text>
            </View>

            <View style={[styles.tabContainer, { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        {
                            backgroundColor:
                                activeTab === 'login'
                                    ? (currentTheme === 'light' ? Colors.white : Colors.darkGray)
                                    : (currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray),
                        },
                    ]}
                    onPress={() => handleTabChange('login')}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: activeTab === 'login' }}
                    accessibilityLabel="Login Tab"
                    accessibilityHint="Switch to login tab"
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'login'
                                ? (currentTheme === 'light' ? styles.activeTabText : { color: Colors.white })
                                : { color: currentTheme === 'light' ? Colors.primary : Colors.lightGray },
                        ]}
                    >
                        Log In
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        {
                            backgroundColor:
                                activeTab === 'signup'
                                    ? (currentTheme === 'light' ? Colors.white : Colors.darkGray)
                                    : (currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray),
                        },
                    ]}
                    onPress={() => handleTabChange('signup')}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: activeTab === 'signup' }}
                    accessibilityLabel="Sign Up Tab"
                    accessibilityHint="Switch to sign up tab"
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'signup'
                                ? (currentTheme === 'light' ? styles.activeTabText : { color: Colors.white })
                                : { color: currentTheme === 'light' ? Colors.primary : Colors.lightGray },
                        ]}
                    >
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.formContainer}>
                    {activeTab === 'signup' && (
                        <>
                            <Image
                                source={images.signup}
                                style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 20 }}
                                resizeMode='contain'
                                accessibilityLabel="Signup Header Image"
                                accessibilityHint="An image representing the signup process"
                                accessibilityRole="image"
                            />
                            <View>
                                <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Full Name Label">
                                    Full Name
                                </Text>
                                <FormField
                                    icon={true}
                                    iconName="person"
                                    iconFamily="Ionicons"
                                    title="Full Name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                    accessibilityLabel="Full name input"
                                    accessibilityHint="Enter your full name"
                                />
                            </View>
                            {errors.fullName && (
                                <Text style={styles.errorText}>
                                    {errors.fullName}
                                </Text>
                            )}

                            <View>
                                <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Email Address Label">
                                    Email Address
                                </Text>
                                <FormField
                                    icon={true}
                                    iconName="mail"
                                    iconFamily="Ionicons"
                                    title="Email"
                                    type="email"
                                    placeholder='Enter your email address'
                                    value={email}
                                    onChangeText={setEmail}
                                    accessibilityLabel="Email input"
                                    accessibilityHint="Enter your email address"
                                />
                            </View>
                            {errors.email && (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            )}

                            <View>
                                <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Phone Number Label">
                                    Phone Number
                                </Text>
                                <FormField
                                    icon={true}
                                    iconName="call"
                                    iconFamily="Ionicons"
                                    title="Phone"
                                    type="phone"
                                    placeholder='Enter your phone number'
                                    value={phone}
                                    onChangeText={setPhone}
                                    accessibilityLabel="Phone input"
                                    accessibilityHint="Enter your phone number"
                                />
                            </View>
                            {errors.phone && (
                                <Text style={styles.errorText}>
                                    {errors.phone}
                                </Text>
                            )}

                            <View>
                                <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Create Password Label">
                                    Create Password
                                </Text>
                                <FormField
                                    icon={true}
                                    iconName="lock-closed"
                                    iconFamily="Ionicons"
                                    title="Password"
                                    type="password"
                                    placeholder='Enter your password'
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    accessibilityLabel="Password input"
                                    accessibilityHint="Create a password for your account"
                                />
                            </View>

                            <View>
                                <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Confirm Password Label">
                                    Confirm Password
                                </Text>
                                <FormField
                                    icon={true}
                                    iconName="lock-closed"
                                    iconFamily="Ionicons"
                                    title="Confirm Password"
                                    type="password"
                                    placeholder='Re-enter your password'
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    accessibilityLabel="Confirm password input"
                                    accessibilityHint="Re-enter your password to confirm"
                                />
                            </View>
                            {errors.newPassword && (
                                <Text style={styles.errorText}>
                                    {errors.newPassword}
                                </Text>
                            )}
                        </>
                    )}

                    {activeTab === 'login' && (
                        <>
                            <Image
                                source={images.login}
                                style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 20 }}
                                resizeMode='contain'
                                accessibilityLabel="Login Header Image"
                                accessibilityHint="An image representing the login process"
                                accessibilityRole="image"
                            />
                            <View>
                                <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Email Address Label">
                                    Email Address
                                </Text>
                                <FormField
                                    icon={true}
                                    iconName="mail"
                                    iconFamily="Ionicons"
                                    title="Email"
                                    type="email"
                                    placeholder='Enter your email address'
                                    value={email}
                                    onChangeText={setEmail}
                                    accessibilityLabel="Email input"
                                    accessibilityHint="Enter your email address"
                                />
                            </View>
                            {errors.email && (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            )}

                            <View>
                                <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Password Label">
                                    Password
                                </Text>
                                <FormField
                                    icon={true}
                                    iconName="lock-closed"
                                    iconFamily="Ionicons"
                                    title="Password"
                                    type="password"
                                    placeholder='Enter your password'
                                    value={password}
                                    onChangeText={setPassword}
                                    accessibilityLabel="Password input"
                                    accessibilityHint="Enter your password'"
                                />
                            </View>
                            {errors.password && (
                                <Text style={styles.errorText}>
                                    {errors.password}
                                </Text>
                            )}
                        </>

                    )}
                </View>

            </ScrollView>

            <View style={[styles.footer, { borderTopColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]}>
                <Button
                    title="Continue"
                    onPress={handleContinue}
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
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        marginVertical: 32,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.accent,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        borderRadius: 12,
        backgroundColor: Colors.lightGray,
        padding: 4,
        marginHorizontal: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: Colors.white,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
    },
    activeTabText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    formContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    errorText: {
        color: Colors.error,
        fontSize: 14,
        marginVertical: 8,
    },
    footer: {
        padding: 24,
        backgroundColor: Colors.transparent,
        borderTopWidth: 1,
    },
    button: {
        width: '100%',
    },
});