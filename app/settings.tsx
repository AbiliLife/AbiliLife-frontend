import React, { useContext } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { X } from 'lucide-react-native';

import Colors from '@/constants/Colors'
import { ThemeContext } from '@/contexts/ThemeContext'

export default function SettingsScreen() {
    const router = useRouter();
    const headerHeight = useHeaderHeight();

    const { currentTheme, toggleTheme, toggleSystemTheme, isSystemTheme } = useContext(ThemeContext);

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: Platform.OS === 'ios' ? headerHeight : 24, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen options={{
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.selectionAsync();
                            router.back();
                        }}
                        accessibilityRole='button'
                        accessibilityLabel="Back to previous screen"
                        accessibilityHint='Returns to the previous screen without saving changes'
                    >
                        <X size={24} color={currentTheme === 'light' ? Colors.primary : Colors.white} />
                    </TouchableOpacity>
                ),
                headerTitle: 'General Settings',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: currentTheme === 'light' ? Colors.primary : Colors.white,
                },
                headerStyle: {
                    backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
                },
                headerLargeTitle: Platform.OS === 'ios',
                headerShadowVisible: false,
            }} />
                <Text style={styles.subtitle} accessibilityRole='header' accessibilityLabel='Settings subtitle'>
                    Customize your experience
                </Text>

            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                    Theme Switch
                </Text>
            </View>

            <View style={[styles.settingRow, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
                <View style={styles.settingLabelContainer}>
                    <Ionicons name="moon" size={24} color={Colors.secondary} />
                    <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                        Dark Mode
                    </Text>
                </View>
                <Switch
                    value={currentTheme === 'dark'}
                    onValueChange={() => toggleTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                    trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
                    thumbColor={Colors.white}
                    accessibilityRole='switch'
                    accessibilityLabel='Toggle Dark Mode'
                    accessibilityHint='Switch between light and dark mode'
                />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                    Theme Settings
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.settingRow, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }, !isSystemTheme && currentTheme === 'light' && styles.selectedRow]}
                activeOpacity={0.7}
                onPress={() => toggleTheme('light')}
            >
                <View style={styles.settingLabelContainer}>
                    <Ionicons
                        name="sunny"
                        size={24}
                        color={!isSystemTheme && currentTheme === 'light' ? Colors.white : Colors.secondary}
                    />
                    <Text style={[
                        styles.settingLabel,
                        { color: !isSystemTheme && currentTheme === 'light' ? Colors.white : Colors.white }
                    ]}>
                        Light
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.settingRow, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }, !isSystemTheme && currentTheme === 'dark' && styles.selectedRow]}
                activeOpacity={0.7}
                onPress={() => toggleTheme('dark')}
            >
                <View style={styles.settingLabelContainer}>
                    <Ionicons
                        name="moon"
                        size={24}
                        color={!isSystemTheme && currentTheme === 'dark' ? Colors.white : Colors.secondary}
                    />
                    <Text style={[
                        styles.settingLabel,
                        { color: !isSystemTheme && currentTheme === 'dark' ? Colors.white : currentTheme === 'light' ? Colors.primary : Colors.white }
                    ]}>
                        Dark
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.settingRow, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }, isSystemTheme && styles.selectedRow]}
                activeOpacity={0.7}
                onPress={toggleSystemTheme}
            >
                <View style={styles.settingLabelContainer}>
                    <Ionicons
                        name="contrast"
                        size={24}
                        color={isSystemTheme ? Colors.white : Colors.secondary}
                    />
                    <Text style={[
                        styles.settingLabel,
                        { color: isSystemTheme ? Colors.white : currentTheme === 'light' ? Colors.primary : Colors.white }
                    ]}>
                        System Default
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark, marginVertical: 16 }} />

            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                    Other Settings
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.accent,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.accent,
        paddingHorizontal: 4,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.mediumGray,
        backgroundColor: Colors.white,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        marginLeft: 12,
        fontSize: 16,
    },
    selectedRow: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    }
})