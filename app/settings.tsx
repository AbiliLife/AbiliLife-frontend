import React, { useContext } from 'react'
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ThemeContext } from '@/contexts/ThemeContext'

const SettingsModal = () => {

    const { currentTheme, toggleTheme, toggleSystemTheme, isSystemTheme } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                    General Settings
                </Text>
                <Text style={styles.subtitle}>
                    Customize your experience
                </Text>
            </View>

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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        marginTop: 32,
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

export default SettingsModal