import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useAccessibility } from '@/contexts/AccessibilityContext';

import AccessibilityOption from '@/components/accessibility/AccessibilityOption';
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';
import CustomButton from '@/components/common/CustomButton';

export default function HomeScreen() {
    const router = useRouter();

    const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'AbiliLife Home',
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#7135B1',
                    },
                    headerTintColor: '#7135B1',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#F5F5F5',
                    },
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.push('/profile')}
                            style={{ padding: 10 }}
                            accessibilityLabel='Profile Button'
                            accessibilityRole='button'
                        >
                            <Ionicons name="person-circle-outline" size={28} color="#7135B1" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView style={styles.container}>
                {/* Welcome Message Card */}
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeText} accessibilityLabel='Welcome Message' accessibilityRole='text'>
                        Welcome to AbiliLife! {'\n'}{'\n'}
                        We are dedicated to providing accessible and inclusive services for everyone. Our platform is designed to empower individuals with disabilities by offering a range of services that cater to their unique needs. Whether you're looking for mobility assistance, communication tools, or community support, AbiliLife is here to help you live your best life.
                    </Text>
                </View>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} accessibilityLabel='Recommended Section Title' accessibilityRole='header'>
                        Recommended
                    </Text>
                </View>

                {/* Voice Navigation Tutorial Card */}
                <View style={styles.tutorialCard}>
                    <View style={styles.tutorialHeader}>
                        <Text style={styles.tutorialTitle} accessibilityLabel='Voice Navigation Tutorial Title' accessibilityRole='header'>
                            Voice Navigation Tutorial
                        </Text>
                        <Text style={styles.tutorialDescription} accessibilityLabel='Learn how to navigate AbiliLife with just your voice' accessibilityRole='text'>
                            Learn how to navigate AbiliLife with just your voice
                        </Text>
                    </View>
                    <View style={styles.tutorialFooter}>
                        <View style={styles.tutorialTimeContainer}>
                            <Ionicons name="mic" size={24} color='#7135B1' />
                            <Text style={styles.tutorialTimeText} accessibilityLabel='Estimated time to complete tutorial' accessibilityRole='text'>
                                3 minute guide
                            </Text>
                        </View>
                        <CustomButton
                            title="Start Tutorial"
                            handlePress={() => { }}
                            containerStyle={styles.startButton}
                            textStyle={styles.startButtonText}
                            leadingIconName="play"
                            leading
                            accessibilityLabel='Start Voice Navigation Tutorial'
                            accessibilityRole='button'
                        />
                    </View>
                </View>
            </ScrollView>

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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Welcome Message Card Styles
    welcomeCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    welcomeText: {
        fontSize: 16,
        color: '#333',
    },
    // Tutorial Card Styles
    tutorialCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tutorialHeader: {
        padding: 16,
        backgroundColor: '#7135B1', // Purple background
    },
    tutorialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#fff', // White text for contrast
    },
    tutorialDescription: {
        fontSize: 14,
        opacity: 0.9,
        marginBottom: 16,
        color: '#fff', // White text for contrast
    },
    tutorialFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F8FA', // Light background for footer
    },
    tutorialTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tutorialTimeText: {
        marginLeft: 8,
        fontSize: 16,
    },
    startButton: {
        borderRadius: 24,
        backgroundColor: '#9C27B0',
    },
    startButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#fff', // White text for contrast
    },
})
