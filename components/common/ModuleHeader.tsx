import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ModuleHeaderProps {
    title: string;
    subtitle: string;
    onBackPress: () => void;
    color: string;
    iconFamily?: 'Ionicons' | 'FontAwesome' | 'MaterialIcons' | 'Entypo' | 'Feather';
    iconName?: string;
};

const getIconComponent = (family: string) => {
    switch (family) {
        case 'FontAwesome': return FontAwesome;
        case 'MaterialIcons': return MaterialIcons;
        case 'Entypo': return Entypo;
        case 'Feather': return Feather;
        default: return Ionicons;
    }
};

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
    title,
    subtitle,
    onBackPress,
    color,
    iconFamily = 'Ionicons',
    iconName
}) => {
    const IconComponent = getIconComponent(iconFamily);

    return (
        <View style={[styles.headerContainer, { backgroundColor: color }]}>
            <TouchableOpacity style={styles.headerButton} onPress={onBackPress}>
                <ChevronLeft size={32} color={Colors.white} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.transparent }}>
                {iconName && (
                    <IconComponent
                        name={iconName as any}
                        size={40}
                        color={Colors.white}
                    />
                )}
                <View style={{ backgroundColor: Colors.transparent }}>
                    <Text style={styles.headerTitle} accessibilityRole='header' accessibilityLabel={title}>
                        {title}
                    </Text>
                    <Text style={styles.headerSubtitle} accessibilityRole='text' accessibilityLabel={subtitle}>
                        {subtitle}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default ModuleHeader

const styles = StyleSheet.create({
    headerContainer: {
        height: 150,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 50,
        paddingHorizontal: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        marginBottom: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.white,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.white,
    },
})