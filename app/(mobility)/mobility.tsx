import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { useAccessibility } from '@/contexts/AccessibilityContext'

import { Text, useThemeColor, View } from '@/components/Themed'
import CustomButton from '@/components/common/CustomButton'
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer'
import AccessibilityOption from '@/components/accessibility/AccessibilityOption'

import { images } from '@/constants/Images'

const MobilityHomeScreen = () => {
  const router = useRouter();

  const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

  // Theme colors
  const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#fff', dark: '#333' }, 'background');

  return (
    <View style={{ flex: 1}}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      <Image
        source={images.mobility}
        style={{ width: '100%', height: 300, borderRadius: 12, marginBottom: 16 }}
        resizeMode="cover"
      />
        <Text style={styles.title}>Mobility Options</Text>
        
        {/* Private Ride Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: cardBackgroundColor }]} 
          onPress={() => router.push('/(mobility)/rideBooking')}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="car" size={24} color={primaryColor} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: textColor }]}>Private Ride (Ace)</Text>
              <Text style={styles.cardDescription}>Book a private ride with Ace Mobility</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Public Transport Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: cardBackgroundColor }]} 
          onPress={() => router.push('/(mobility)/publicTransport')}
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons name="bus" size={24} color={primaryColor} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: textColor }]}>Public Transport Info</Text>
              <Text style={styles.cardDescription}>Get information about public transportation</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Schedule Ride Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: cardBackgroundColor }]} 
          onPress={() => router.push('/(mobility)/rideBooking')}
        >
          <View style={styles.cardContent}>
            <Ionicons name="calendar" size={24} color={primaryColor} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: textColor }]}>Schedule a Ride</Text>
              <Text style={styles.cardDescription}>Plan and schedule transportation in advance</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Caregiver Mode Button */}
        <CustomButton 
          title="Caregiver Mode" 
          handlePress={() => router.push('/(mobility)/caregiverBook')}
          containerStyle={styles.caregiverButton}
          textStyle={styles.caregiverButtonText}
        />
      </ScrollView>

      {/* Accessibility Settings Button (fixed position) */}
      <AccessibilityOption
        handlePress={toggleAccessibilityDrawer}
        otherStyle={{ position: 'absolute', top: 20, right: 20 }}
      />

      {/* Accessibility Drawer */}
      {accessibilityDrawerVisible && (
        <AccessibilityDrawer
          handlePress={toggleAccessibilityDrawer}
        />
      )}
    </View>
  )
}

export default MobilityHomeScreen

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  caregiverButton: {
    width: '70%',
    padding: 14,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#7135B1',
  },
  caregiverButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})