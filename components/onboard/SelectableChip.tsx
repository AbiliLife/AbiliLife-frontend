import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle
} from 'react-native';
import Colors from '@/constants/Colors';

interface SelectableChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

export default function SelectableChip({
    label,
    selected,
    onPress,
    style
}: SelectableChipProps) {
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                selected ? styles.selectedChip : styles.unselectedChip,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${label}, ${selected ? 'selected' : 'not selected'}`}
            accessibilityHint="Tap to select or deselect this option"
        >
            <Text
                style={[
                    styles.label,
                    selected ? styles.selectedLabel : styles.unselectedLabel
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedChip: {
        backgroundColor: Colors.secondary,
    },
    unselectedChip: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.lightGray,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    selectedLabel: {
        color: Colors.white,
    },
    unselectedLabel: {
        color: Colors.darkGray,
    },
});