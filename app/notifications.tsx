import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { X } from 'lucide-react-native';

import Colors from '@/constants/Colors'
import { ThemeContext } from '@/contexts/ThemeContext'

export default function NotificationsSreen() {
    const router = useRouter();
    const headerHeight = useHeaderHeight();

    const { currentTheme} = useContext(ThemeContext);

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
                    >
                        <X size={24} color={currentTheme === 'light' ? Colors.primary : Colors.white} />
                    </TouchableOpacity>
                ),
                headerTitle: 'Notifications',
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
                <Text style={styles.subtitle} accessibilityRole='header' accessibilityLabel='Manage your notifications'>
                    Manage your notifications
                </Text>
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
})