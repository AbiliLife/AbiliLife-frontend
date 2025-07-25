import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Toast } from 'toastify-react-native';

import { images } from '@/constants/Images';
import Colors from '@/constants/Colors';

import Button from '@/components/onboard/Button';
import FormField from '@/components/common/FormField';

import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuth } from '@/contexts/AuthContext';
import { formatPhoneNumber } from '@/utils/formatPhone';

type AuthTab = 'login' | 'signup';

export default function AuthScreen() {
    const router = useRouter();
    const { fromOnboarding } = useLocalSearchParams();

    const [activeTab, setActiveTab] = useState<AuthTab>(fromOnboarding === 'true' ? 'signup' : 'login');

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('muthokaelikeli@gmail.com');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup Form State
    const [email, setEmail] = useState('muthokaelikeli@gmail.com');
    const [newPassword, setNewPassword] = useState('qwerty123');
    const [confirmPassword, setConfirmPassword] = useState('qwerty123');
    const [phone, setPhone] = useState('+254742560540');
    const [fullName, setFullName] = useState('Eli Keli Muthoka');

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Obtain Context and Store
    const { currentTheme } = React.useContext(ThemeContext);
    const { updateUser, setCurrentStep, user } = useOnboardingStore();
    const { isAuthLoading, login, signup } = useAuth();

    const handleTabChange = (tab: AuthTab) => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }
        setActiveTab(tab);
        setErrors({});
    };

    // Validate a single field
    const validateField = useCallback((field: string, value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(?:\+254|0)(7\d{8}|1\d{8})$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        let error = '';

        switch (field) {
            case 'fullName':
                if (!value.trim()) error = 'Full name is required';
                break;
            case 'email':
            case 'loginEmail':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Invalid email address';
                }
                break;
            case 'phone':
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else if (!phoneRegex.test(value)) {
                    error = 'Invalid phone number (format: +2547XXXXXXXXX, 07XXXXXXXX, or 01XXXXXXXX)';
                }
                break;
            case 'newPassword':
                if (!value.trim()) {
                    error = 'Password is required';
                } else if (!passwordRegex.test(value)) {
                    error = 'Use a stronger password (min 8 characters, at least 1 letter and 1 number)';
                }
                break;
            case 'confirmPassword':
                if (!value.trim()) {
                    error = 'Please confirm your password';
                } else if (newPassword !== value) {
                    error = 'Passwords do not match';
                }
                break;
            case 'loginPassword':
                if (!value.trim()) error = 'Password is required';
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        return error;
    }, [newPassword]);

    // Validate all fields for login or signup
    const validateAllFields = useCallback(() => {
        let newErrors: Record<string, string> = {};
        if (activeTab === 'login') {
            newErrors.loginEmail = validateField('loginEmail', loginEmail) || '';
            newErrors.loginPassword = validateField('loginPassword', loginPassword) || '';
        } else {
            newErrors.fullName = validateField('fullName', fullName) || '';
            newErrors.email = validateField('email', email) || '';
            newErrors.phone = validateField('phone', phone) || '';
            newErrors.newPassword = validateField('newPassword', newPassword) || '';
            newErrors.confirmPassword = validateField('confirmPassword', confirmPassword) || '';
        }
        setErrors(newErrors);
        // Return true if no errors
        return Object.values(newErrors).every(e => !e);
    }, [
        activeTab,
        loginEmail,
        loginPassword,
        fullName,
        email,
        phone,
        newPassword,
        confirmPassword,
        validateField,
    ]);

    // Apply validation on every field change
    useEffect(() => {
        if (activeTab === 'login') {
            validateField('loginEmail', loginEmail);
            validateField('loginPassword', loginPassword);
        } else {
            validateField('fullName', fullName);
            validateField('email', email);
            validateField('phone', phone);
            validateField('newPassword', newPassword);
            validateField('confirmPassword', confirmPassword);
        }
    }, [activeTab, loginEmail, loginPassword, fullName, email, phone, newPassword, confirmPassword]);

    // Update handleLogin and handleSignup to use validateAllFields
    const handleLogin = async () => {
        if (!validateAllFields()) {
            Toast.show({
                type: 'warn',
                text1: 'Validation Error',
                text2: 'Please make sure all fields are filled out correctly',
                visibilityTime: 3000,
                position: 'top',
                theme: currentTheme === 'light' ? 'light' : 'dark',
            });
            return;
        }

        // 2. Call login function from context
        const loginResponse = await login({ email: loginEmail, password: loginPassword });

        // 3. Handle login response
        if (loginResponse.success) {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: loginResponse.message,
                visibilityTime: 3000,
                position: 'top',
                theme: currentTheme === 'light' ? 'light' : 'dark',
            })

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            setLoginEmail('');
            setLoginPassword('');

            router.replace('/(tabs)');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: loginResponse.message,
                visibilityTime: 3000,
                position: 'top',
                theme: currentTheme === 'light' ? 'light' : 'dark',
            });

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
    };

    const handleSignup = async () => {
        if (!validateAllFields()) {
            Toast.show({
                type: 'warn',
                text1: 'Validation Error',
                text2: 'Please make sure all fields are filled out correctly',
                visibilityTime: 3000,
                position: 'top',
                theme: currentTheme === 'light' ? 'light' : 'dark',
            });
            return;
        }
        // ...rest of the function remains unchanged
        const signupResponse = await signup({
            fullName,
            email,
            phone: formatPhoneNumber(phone),
            password: newPassword,
        });

        if (signupResponse.success) {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: signupResponse.message,
                visibilityTime: 3000,
                position: 'top',
                theme: currentTheme === 'light' ? 'light' : 'dark',
            });

            updateUser({
                fullName,
                email,
                phone: formatPhoneNumber(phone),
            });
            setCurrentStep(1);

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            setFullName('');
            setEmail('');
            setPhone('');
            setNewPassword('');
            setConfirmPassword('');

            router.push('/otp');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: signupResponse.message,
                visibilityTime: 3000,
                position: 'top',
                theme: currentTheme === 'light' ? 'light' : 'dark',
            });

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
    };

    // const testToast = () => {
    //     Toast.show({
    //         type: 'success',
    //         text1: 'This is the main message',
    //         text2: 'This is the secondary message',
    //         visibilityTime: 4000,
    //         position: 'top',
    //         theme: currentTheme === 'light' ? 'light' : 'dark',
    //     });
    // }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }}
            edges={['top', 'left', 'right']}
        >
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


            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.formContainer}>
                        {activeTab === 'signup' && (
                            <>
                                <View>
                                    <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Full Name Label">
                                        Full Name*
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
                                    {errors.fullName && (
                                        <Text style={styles.errorText}>
                                            {errors.fullName}
                                        </Text>
                                    )}
                                </View>

                                <View>
                                    <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Email Address Label">
                                        Email Address*
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
                                    {errors.email && (
                                        <Text style={styles.errorText}>
                                            {errors.email}
                                        </Text>
                                    )}
                                </View>

                                <View>
                                    <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Phone Number Label">
                                        Phone Number*
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
                                    {errors.phone && (
                                        <Text style={styles.errorText}>
                                            {errors.phone}
                                        </Text>
                                    )}
                                </View>

                                <View>
                                    <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Create Password Label">
                                        Create Password*
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
                                    {errors.newPassword && (
                                        <Text style={styles.errorText}>
                                            {errors.newPassword}
                                        </Text>
                                    )}
                                </View>

                                <View>
                                    <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Confirm Password Label">
                                        Confirm Password*
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
                                    {errors.confirmPassword && (
                                        <Text style={styles.errorText}>
                                            {errors.confirmPassword}
                                        </Text>
                                    )}
                                </View>
                            </>
                        )}

                        {activeTab === 'login' && (
                            <>
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
                                        value={loginEmail}
                                        onChangeText={setLoginEmail}
                                        accessibilityLabel="Email input"
                                        accessibilityHint="Enter your email address"
                                    />
                                    {errors.email && (
                                        <Text style={styles.errorText}>
                                            {errors.email}
                                        </Text>
                                    )}
                                </View>

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
                                        value={loginPassword}
                                        onChangeText={setLoginPassword}
                                        accessibilityLabel="Password input"
                                        accessibilityHint="Enter your password'"
                                    />
                                    {errors.password && (
                                        <Text style={styles.errorText}>
                                            {errors.password}
                                        </Text>
                                    )}
                                </View>
                                <Image
                                    source={images.login}
                                    style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 20 }}
                                    resizeMode='contain'
                                    accessibilityLabel="Login Header Image"
                                    accessibilityHint="An image representing the login process"
                                    accessibilityRole="image"
                                />
                            </>

                        )}
                    </View>

                </ScrollView>

                <View style={[styles.footer, { borderTopColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]}>
                    <Button
                        title={activeTab === 'login' ? "Log In" : "Sign Up"}
                        onPress={activeTab === 'login' ? handleLogin : handleSignup}
                        loading={isAuthLoading}
                        disabled={isAuthLoading}
                        style={styles.button}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        paddingHorizontal: 16,
        marginBottom: 24,
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
        borderRadius: 12,
        backgroundColor: Colors.lightGray,
        padding: 4,
        marginVertical: 32,
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
        marginBottom: 8,
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