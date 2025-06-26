import React, { useContext } from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet
} from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';

interface ToggleSwitchProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    description?: string;
}

export default function ToggleSwitch({
    label,
    value,
    onValueChange,
    description
}: ToggleSwitchProps) {

    const { currentTheme } = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text 
                style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} 
                accessibilityRole="text" 
                accessibilityLabel={label}
                >
                    {label}
                </Text>
                {description && (
                    <Text style={styles.description} accessibilityRole="text" accessibilityLabel={description}>
                        {description}
                    </Text>
                )}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: Colors.lightGray, true: Colors.secondary}}
                thumbColor={Colors.white}
                accessibilityRole="switch"
                accessibilityState={{ checked: value }}
                accessibilityLabel={label}
                accessibilityHint={`Toggle ${label} to ${value ? 'off' : 'on'}`}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        color: Colors.accent,
        marginTop: 4,
    },
});