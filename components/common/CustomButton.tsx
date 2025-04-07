import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Text } from '@/components/Themed';

interface CustomButtonProps {
    title: string;
    handlePress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loading?: boolean;
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    handlePress,
    containerStyle,
    textStyle,
    loading = false,
    disabled = false
}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={[
                styles.button, 
                containerStyle,
                (disabled || loading) && styles.buttonDisabled
            ]}
            disabled={disabled || loading}
        >

            {loading ? (
                <ActivityIndicator
                animating={loading}
                color="#fff"
                size="small"
                style={styles.loader}
                />
            ) : (
                <Text style={[styles.buttonText, textStyle]}>{title}</Text>
            )
        }
        </TouchableOpacity>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    button: {
        width: '100%',
        padding: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    loader: {
        width: 20,
        height: 20,
    },
    buttonTextDisabled: {
        opacity: 0.7,
    },
});