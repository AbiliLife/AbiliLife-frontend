import React from 'react'
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native'
import { Link, useRouter } from 'expo-router';

import { images } from '@/constants/Images';
import FormField from '@/components/common/FormField'
import CustomButton from '@/components/common/CustomButton';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import AccessibilityOption from '@/components/accessibility/AccessibilityOption';
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';



export default function LoginScreen() {
    const router = useRouter();

    const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

    // State for the form fields
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <>
            {/* Accessibility Settings Button (fixed position) */}
            <AccessibilityOption
                handlePress={toggleAccessibilityDrawer}
            />

            {/* Accessibility Drawer */}
            {accessibilityDrawerVisible && (
                <AccessibilityDrawer
                    handlePress={toggleAccessibilityDrawer}
                />
            )}
            <ScrollView style={styles.container}>
                {/* Header Image */}
                <Image
                    source={images.login}
                    style={{ width: '100%', height: 300, borderRadius: 10, marginBottom: 20 }}
                    resizeMode='contain'
                    accessibilityLabel="Login Header Image"
                    accessibilityHint="An image representing the login process"
                    accessibilityRole="image"
                />

                <Text style={styles.subTitle} accessibilityRole="text" accessibilityLabel="Login Subtitle">
                    Please enter your credentials to access your account.
                </Text>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <View style={styles.fieldsContainer}>
                        <Text style={styles.fieldLabel} accessibilityRole="text" accessibilityLabel="Email Field Label">
                            Email
                        </Text>
                        <FormField
                            type='email'
                            title='Email'
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            icon={true}
                            iconName='mail'
                            iconFamily='Ionicons'
                            accessibilityLabel="Email Input Field"
                            accessibilityHint="Enter your email address"
                        />
                    </View>

                    <View style={styles.fieldsContainer}>
                        <Text style={styles.fieldLabel} accessibilityRole="text" accessibilityLabel="Password Field Label">
                            Password
                        </Text>
                        <FormField
                            type='password'
                            title='Password'
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            icon={true}
                            iconName='lock-closed'
                            iconFamily='Ionicons'
                            accessibilityLabel="Password Input Field"
                            accessibilityHint="Enter your password"
                        />
                    </View>
                </View>

                {/* Forgot Password Link */}
                <Link href="/(auth)/login" style={styles.forgotPasswordContainer} accessibilityLabel='Forgot Password Link' accessibilityHint='Navigate to the forgot password screen' accessibilityRole='link'>
                    <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                    </Text>
                </Link>

                {/* Login Button */}
                <CustomButton
                    title="Login"
                    handlePress={() => router.replace('/(tabs)')}
                    containerStyle={{ marginBottom: 20 }}
                    textStyle={{ color: '#fff' }}
                    leading={true}
                    leadingIconName='log-in-outline'
                    iconFamily='Ionicons'
                    accessibilityLabel="Login Button"
                    accessibilityHint="Press to log in to your account"
                    accessibilityRole="button"
                />
            </ScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    subTitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: '#46216E'
    },
    formContainer: {
        marginBottom: 20,
    },
    fieldsContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
})