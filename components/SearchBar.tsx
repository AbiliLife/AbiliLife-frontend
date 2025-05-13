import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor, View } from '@/components/Themed';

interface SearchBarProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onPress: () => void;
}

const SearchBar = ({
    placeholder,
    value,
    onChangeText,
    onPress,
}: SearchBarProps) => {

    // Theme colors
    const backgroundColor = useThemeColor({
        light: '#F5F5F5',
        dark: '#1E1E1E',
    }, 'background');
    const iconColor = useThemeColor({
        light: '#5E35B1',
        dark: '#fff',
    }, 'text');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Ionicons
                name='search'
                size={24}
                color={iconColor}
            />
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#A0A0A0"
                style={styles.textInput}
            />
            <Ionicons
                name='mic'
                size={24}
                color={iconColor}
            />
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 10,
    },
    textInput: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        color: '#5E35B1',
    }
})