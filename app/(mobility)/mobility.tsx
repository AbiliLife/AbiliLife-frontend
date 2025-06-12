import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { useAccessibility } from '@/contexts/AccessibilityContext'

import CustomButton from '@/components/common/CustomButton'
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer'
import AccessibilityOption from '@/components/accessibility/AccessibilityOption'

import { images } from '@/constants/Images'

const MobilityHomeScreen = () => {
  const router = useRouter();

  const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={[styles.container, { backgroundColor: '#F5F5F5' }]} 
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Mobility options screen"
      >
        <Image
          source={images.mobility}
          style={{ width: '100%', height: 300, borderRadius: 12, marginBottom: 16 }}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel="Mobility services illustration"
        />
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="Mobility Options"
        >
          Mobility Options
        </Text>
        
        {/* Private Ride Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#FFFFFF' }]} 
          onPress={() => router.push('/(mobility)/rideBooking')}
          accessible={true}
          accessibilityLabel="Private Ride with Ace Mobility"
          accessibilityHint="Book a private accessible ride with Ace Mobility"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="car" size={24} color="#7135B1" style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: '#46216E' }]}>Private Ride (Ace)</Text>
              <Text style={styles.cardDescription}>Book a private ride with Ace Mobility</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Public Transport Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#FFFFFF' }]} 
          onPress={() => router.push('/(mobility)/publicTransport')}
          accessible={true}
          accessibilityLabel="Public Transport Information"
          accessibilityHint="Get information about accessible public transportation options"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons name="bus" size={24} color="#7135B1" style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: '#46216E' }]}>Public Transport Info</Text>
              <Text style={styles.cardDescription}>Get information about public transportation</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Schedule Ride Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#FFFFFF' }]} 
          onPress={() => router.push('/(mobility)/rideBooking')}
          accessible={true}
          accessibilityLabel="Schedule a Ride"
          accessibilityHint="Plan and schedule transportation in advance"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <Ionicons name="calendar" size={24} color="#7135B1" style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: '#46216E' }]}>Schedule a Ride</Text>
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
          accessibilityLabel="Caregiver Mode"
          accessibilityHint="Book transportation for someone in your care"
          accessibilityRole="button"
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