import { Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

import { Text, View } from '@/components/Themed'

interface AccessibilityDrawerProps {
    handlePress: () => void
}

const AccessibilityDrawer = ({ handlePress }: AccessibilityDrawerProps) => {
    return (
        <View style={styles.accessibilityDrawerOverlay}>
            <Pressable
                style={styles.accessibilityDrawerDismiss}
                onPress={handlePress}
            />
            <View style={styles.accessibilityDrawer}>
                <View style={styles.accessibilityDrawerContent}>
                    <Text style={styles.accessibilityDrawerTitle}>Accessibility Settings</Text>

                    <TouchableOpacity style={styles.accessibilityOption}>
                        <Text style={styles.accessibilityOptionText}>Voice Commands</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.accessibilityOption}>
                        <Text style={styles.accessibilityOptionText}>Text Size</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.accessibilityOption}>
                        <Text style={styles.accessibilityOptionText}>High Contrast</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.accessibilityOption}>
                        <Text style={styles.accessibilityOptionText}>Screen Reader</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AccessibilityDrawer

const styles = StyleSheet.create({
    accessibilityDrawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1001,
  },
  accessibilityDrawerDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1002,
  },
  accessibilityDrawer: {
    position: 'absolute',
    right: 20,
    bottom: 80, // Position above the accessibility button
    zIndex: 1003,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: 250,
  },
  accessibilityDrawerContent: {
    backgroundColor: '#f8f2ff', // Light purple background
    padding: 16,
  },
  accessibilityDrawerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7135B1',
    marginBottom: 16,
    textAlign: 'center',
  },
  accessibilityOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  accessibilityOptionText: {
    fontSize: 16,
    color: '#46216E',
  },
})