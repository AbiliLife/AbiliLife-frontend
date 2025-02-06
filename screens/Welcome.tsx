import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { IconButton } from 'react-native-paper';

const Welcome = () => {

    const handleLogin = () => {
        // Navigate to Login Screen
    }

    const handleSignUp = () => {
        // Navigate to Sign Up Screen
    }

    const handleGoogleAuth = () => {
        // Authenticate using Google
    }

    const handleAppleAuth = () => {
        // Authenticate using Apple
    }


    return (
        <SafeAreaView style={styles.container}>

            {/* Accessibility Menu Icon */}
            <View style={styles.header}>
                <View style={styles.accessibilityContainer}>
                    <Ionicons name="accessibility" size={28} />
                    <Text style={styles.accessibilityText}>Accessibility Menu</Text>
                </View>
            </View>

            {/* Logo and Welcome Text */}
            <View style={styles.contentContainer}>
                <View style={styles.logo} />
                <View style={styles.textContainer}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.appNameText}>AbiliLife</Text>
                </View>
            </View>

            {/* Authentication Buttons */}
            <View style={styles.authContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.primaryButtonText}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleSignUp}
                >
                    <Text style={styles.secondaryButtonText}>Sign up</Text>
                </TouchableOpacity>

                <Text style={styles.dividerText}>Continue With Accounts</Text>

                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.socialButton, styles.googleButton]}
                        onPress={handleGoogleAuth}
                    >
                        <IconButton icon="google" size={32} />
                        <Text style={styles.socialButtonText}>GOOGLE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, styles.appleButton]}
                        onPress={handleAppleAuth}
                    >
                        <IconButton icon="apple" size={32} />
                        <Text style={styles.socialButtonText}>APPLE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        alignItems: 'flex-end',
        marginBottom: 40,
    },
    accessibilityContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    accessibilityText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666666',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        backgroundColor: '#F0F0F0',
        borderRadius: 24,
        marginBottom: 40,
    },
    textContainer: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
    },
    appNameText: {
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
        marginTop: 8,
    },
    authContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    primaryButton: {
        backgroundColor: '#000000',
        paddingVertical: 16,
        borderRadius: 50,
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 16,
        borderRadius: 50,
        marginBottom: 24,
    },
    secondaryButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    dividerText: {
        color: '#666666',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        width: '48%',
    },
    googleButton: {
        backgroundColor: '#4285F4',
    },
    appleButton: {
        backgroundColor: 'gray',
    },
    socialButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Welcome;