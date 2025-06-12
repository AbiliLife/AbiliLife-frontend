import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

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

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#f0f0f0' }}>
            <TextInput
                style={{ flex: 1, padding: 10, fontSize: 16 }}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onPress}
            />
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    
})