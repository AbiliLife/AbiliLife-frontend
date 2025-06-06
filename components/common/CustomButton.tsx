import { ActivityIndicator, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';
import { StyleProp, TextStyle, ViewStyle } from "react-native";

interface CustomButtonProps {
    title: string;
    handlePress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loading?: boolean;
    disabled?: boolean;
    leading?: boolean;
    trailing?: boolean;
    leadingIconName?: string;
    trailingIconName?: string;
    iconFamily?: 'Ionicons' | 'FontAwesome' | 'MaterialIcons' | 'Entypo' | 'Feather';
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

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    handlePress,
    containerStyle = {},
    textStyle = {},
    loading = false,
    disabled = false,
    leading = false,
    trailing = false,
    leadingIconName,
    trailingIconName,
    iconFamily = 'Ionicons',
}) => {
    const IconComponent = getIconComponent(iconFamily);

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled || loading}
            style={[
                styles.button,
                disabled && styles.buttonDisabled,
                containerStyle
            ]}
        >
            <View style={styles.contentRow}>
                {leading && leadingIconName && (
                    <IconComponent
                        name={leadingIconName as any}
                        size={26}
                        color={disabled ? "#ccc" : "#fff"}
                        style={{ marginRight: 8 }}
                    />
                )}
                {loading ? (
                    <ActivityIndicator color="#fff" style={styles.loader} />
                ) : (
                    <Text
                        style={[
                            styles.buttonText,
                            disabled && styles.buttonTextDisabled,
                            textStyle
                        ]}
                    >
                        {title}
                    </Text>
                )}
                {trailing && trailingIconName && (
                    <IconComponent
                        name={trailingIconName as any}
                        size={20}
                        color={disabled ? "#ccc" : "#fff"}
                        style={{ marginLeft: 8 }}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#7135B1',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 48,
    },
    buttonDisabled: {
        backgroundColor: '#C7B8E0',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonTextDisabled: {
        color: '#eee',
    },
    loader: {
        marginHorizontal: 8,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});