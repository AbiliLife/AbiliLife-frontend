import React from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet
} from 'react-native';
import Colors from '@/constants/Colors';

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
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.label} accessibilityRole="text" accessibilityLabel={label}>
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
                trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.lightGray}
                accessibilityRole="switch"
                accessibilityState={{ checked: value }}
                accessibilityLabel={label}
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
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.black,
    },
    description: {
        fontSize: 14,
        color: Colors.accent,
        marginTop: 4,
    },
});