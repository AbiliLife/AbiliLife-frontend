import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle
}: ButtonProps) {

    const { currentTheme } = React.useContext(ThemeContext);

    const buttonStyles = [
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && (currentTheme === 'light' ? styles.outlineButton : { borderColor: Colors.white, borderWidth: 1 }),
        disabled && styles.disabledButton,
        style
    ];

    const textStyles = [
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'outline' && (currentTheme === 'light' ? styles.outlineText : { color: Colors.white }),
        disabled && styles.disabledText,
        textStyle
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading }}
            accessibilityLabel={title}
            accessibilityHint={loading ? 'Loading, please wait' : `Tap to ${title.toLowerCase()}`}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? Colors.primary : Colors.white}
                    size="small"
                />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
    },
    secondaryButton: {
        backgroundColor: Colors.accent,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    disabledButton: {
        backgroundColor: Colors.lightGray,
        borderColor: Colors.lightGray,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: Colors.white,
    },
    secondaryText: {
        color: Colors.white,
    },
    outlineText: {
        color: Colors.primary,
    },
    disabledText: {
        color: Colors.mediumGray,
    },
});