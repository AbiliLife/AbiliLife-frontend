import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';

// Tab configuration for the bottom tab navigator
const TAB_CONFIG = [
    { name: 'index', label: 'Home', icon: 'home' },
    { name: 'services', label: 'All Services', icon: 'grid', huge: true },
    { name: 'profile', label: 'Profile', icon: 'person' },
];

export default function CustomTabBar({
    state, // BottomTabBarState - https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarstate
    navigation, // BottomTabBarNavigation - https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarnavigation
}: BottomTabBarProps) {

    const { currentTheme } = React.useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer, borderTopColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
            {TAB_CONFIG.map((tab) => {
                const currentRoute = state.routes.find(route => route.name === tab.name); // Find the route for the current tab
                if (!currentRoute) return null;

                const isFocused = state.index === state.routes.findIndex(route => route.name === tab.name);
                const onPress = () => {
                    if (!isFocused) {
                        navigation.navigate(currentRoute.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={currentRoute.key}
                        accessible={true}
                        accessibilityRole="tab"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityHint={`Go to ${tab.name} tab`}
                        onPress={onPress}
                        style={[
                            styles.tab,
                            tab.huge && styles.hugeTab,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={tab.icon as any}
                            size={tab.huge ? 40 : 28}
                            color={
                                isFocused ? currentTheme === 'light' ? Colors.secondary : Colors.white : Colors.gray600
                            }
                        />
                        <Text
                            style={[
                                styles.label,
                                tab.huge && styles.hugeLabel,
                                { color: isFocused ? (currentTheme === 'light' ? Colors.secondary : Colors.white) : Colors.gray600 },
                            ]}
                            numberOfLines={1}
                            accessibilityRole='text'
                            accessibilityLabel={tab.label}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: '11%',
        borderTopWidth: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
    },
    hugeTab: {
        flex: 1.5, // Increased flex for the huge tab
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
        textAlign: 'center',
    },
    hugeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 6,
    },
});