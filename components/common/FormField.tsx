import React from "react";
import { TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome, MaterialCommunityIcons, Feather, FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

import { useThemeColor, View } from '@/components/Themed';

interface FormFieldProps {
    title: string;
    icon?: string;
    value: string;
    placeholder: string;
    handleChangeText: (text: string) => void;
    otherStyles?: object;
    [key: string]: any;
}

const FormField: React.FC<FormFieldProps> = ({
    title,
    icon,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const backgroundColor = useThemeColor(
        { light: 'rgba(194, 195, 203, 0.5)', dark: '#1E1E1E' },
        'background'
    );
    const borderColor = useThemeColor(
        { light: '#ccc', dark: '#1E1E1E' },
        'background'
    );
    const textColor = useThemeColor({}, 'text');
        const iconColor = useThemeColor({
            light: '#7135B1',
            dark: '#fff',
        }, 'text');

    return (
        <View style={[styles.container, otherStyles]}>
            <View style={[
                styles.inputContainer,
                { backgroundColor, borderColor: isFocused ? textColor : borderColor },
                isFocused ? styles.inputContainerFocused : null,
                value ? styles.inputContainerWithValue : null
            ]}>

                {icon && (
                    React.createElement(
                        Ionicons || FontAwesome || MaterialCommunityIcons || Feather || FontAwesome5 || FontAwesome6 || MaterialIcons,
                        {
                            name: icon as any,
                            size: 20,
                            color: iconColor,
                            style: styles.icon,
                        }
                    )
                )}

                <TextInput
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    secureTextEntry={title === "Password" && !showPassword}
                    keyboardType={title === "Email" ? "email-address" : title === "Phone" ? "phone-pad" : "default"}
                    style={[styles.input, { color: textColor }]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {title === "Password" && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <Ionicons name="eye-off" size={20} color={textColor} />
                        ) : (
                            <Ionicons name="eye" size={20} color={textColor} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        height: 65,
        paddingHorizontal: 16,
        paddingVertical: 22,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    inputContainerFocused: {
        borderWidth: 1,
    },
    inputContainerWithValue: {
        borderWidth: 1,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});

export default FormField;