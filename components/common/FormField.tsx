import React, { useContext } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';

import Colors from "@/constants/Colors";

import { ThemeContext } from "@/contexts/ThemeContext";

interface FormFieldProps {
    icon?: boolean;
    iconName?: string;
    iconFamily?: 'Ionicons' | 'FontAwesome' | 'MaterialIcons' | 'Entypo' | 'Feather';
    type: 'number' | 'phone' | 'email' | 'password' | 'text';
    title: string;
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    otherStyles?: object;
    [key: string]: any; // For additional props
}

const getIconComponent = (family: string) => {
    switch (family) {
        case 'FontAwesome': return FontAwesome;
        case 'MaterialIcons': return MaterialIcons;
        case 'Entypo': return Entypo;
        case 'Feather': return Feather;
        default: return Ionicons;
    }
};

const FormField: React.FC<FormFieldProps> = ({
    icon = false,
    iconName,
    iconFamily = 'Ionicons',
    type,
    title,
    value,
    placeholder,
    onChangeText,
    otherStyles = {},
    ...props
}) => {
    const { currentTheme } = useContext(ThemeContext);

    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const IconComponent = getIconComponent(iconFamily);

    // Keyboard type mapping
    const keyboardType =
        type === 'email' ? 'email-address'
            : type === 'number' ? 'numeric'
                : type === 'phone' ? 'phone-pad'
                    : 'default';

    // Secure text entry for password
    const secureTextEntry = type === 'password' && !showPassword;

    return (
        <View style={[
            styles.fieldContainer,
            otherStyles,
            (isFocused || !!value) && styles.fieldContainerFocused,
            { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: isFocused ? Colors.secondary : !!value ? Colors.white : currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }
        ]}>
            {icon && iconName && (
            <View style={styles.iconWrapper}>
                <IconComponent name={iconName as any} size={20} color={isFocused || !!value ? currentTheme === 'light' ? Colors.secondary : Colors.white : '#A29EB6'} />
            </View>
            )}
            <TextInput
            style={[
                styles.input,
                icon && styles.inputWithIcon,
                { color: currentTheme === 'light' ? Colors.primary : Colors.lightGray }
            ]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            autoCorrect={type !== 'email' && type !== 'password'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
            />
            {type === 'password' && (
            <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
            >
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#A29EB6" />
            </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 4,
        position: 'relative',
    },
    fieldContainerFocused: {
        borderColor: Colors.secondary,
    },
    iconWrapper: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    eyeIcon: {
        marginLeft: 8,
        padding: 4,
    },
});

export default FormField;