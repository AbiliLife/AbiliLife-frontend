import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Colors from '@/constants/Colors';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { ThemeContext } from '@/contexts/ThemeContext'

import CustomButton from '@/components/common/CustomButton'
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer'
import AccessibilityOption from '@/components/accessibility/AccessibilityOption'

import { images } from '@/constants/Images'

const MobilityHomeScreen = () => {
  const router = useRouter();

  const { currentTheme } = React.useContext(ThemeContext);
  const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]} 
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
          style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
          accessibilityRole="header"
          accessibilityLabel="Mobility Options"
        >
          Mobility Options
        </Text>
        
        {/* Private Ride Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]} 
          onPress={() => router.push('/(mobility)/rideBooking')}
          accessible={true}
          accessibilityLabel="Private Ride with Ace Mobility"
          accessibilityHint="Book a private accessible ride with Ace Mobility"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="car" size={24} color={Colors.secondary} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Private Ride with Ace Mobility">
                Private Ride with Ace Mobility
              </Text>
              <Text style={[styles.cardDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Book a private accessible ride with Ace Mobility">
                Book a private accessible ride with Ace Mobility
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Public Transport Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]} 
          onPress={() => router.push('/(mobility)/publicTransport')}
          accessible={true}
          accessibilityLabel="Public Transport Information"
          accessibilityHint="Get information about accessible public transportation options"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons name="bus" size={24} color={Colors.secondary} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Public Transport Information">
                Public Transport Information
              </Text>
              <Text style={[styles.cardDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Get information about accessible public transportation options">
                Get information about accessible public transportation options
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Schedule Ride Card */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]} 
          onPress={() => router.push('/(mobility)/rideBooking')}
          accessible={true}
          accessibilityLabel="Schedule a Ride"
          accessibilityHint="Plan and schedule transportation in advance"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <Ionicons name="calendar" size={24} color={Colors.secondary} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Schedule a Ride">
                Schedule a Ride
              </Text>
              <Text style={[styles.cardDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Plan and schedule transportation in advance">
                Plan and schedule transportation in advance
              </Text>
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
        
        {/* How to Book Guide Button */}
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => router.push('/bookingGuide')}
          accessible={true}
          accessibilityLabel="How to Book a Ride Guide"
          accessibilityHint="View step-by-step instructions for booking rides"
          accessibilityRole="button"
        >
          <Ionicons name="help-circle-outline" size={24} color={Colors.secondary} />
          <Text style={styles.helpButtonText}>
            How to Book a Ride
          </Text>
        </TouchableOpacity>
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
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 30,
    padding: 8,
  },
  helpButtonText: {
    color: Colors.secondary,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
})