import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface AccessibilityOptionProps {
    handlePress: () => void
    otherStyle?: object
}

const AccessibilityOption = ({ handlePress, otherStyle }: AccessibilityOptionProps) => {
    return (
        <TouchableOpacity
            style={[styles.accessibilityButton, otherStyle]}
            onPress={handlePress}
            activeOpacity={0.9}
            accessible={true}
            accessibilityLabel="Accessibility Options"
            accessibilityHint="Open accessibility settings menu"
            accessibilityRole="button"
            importantForAccessibility="yes"
        >
            <Ionicons name="accessibility-outline" size={24} color="#fff" />
        </TouchableOpacity>
    )
}

export default AccessibilityOption

const styles = StyleSheet.create({
    accessibilityButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#7135B180', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1000,
    },
})