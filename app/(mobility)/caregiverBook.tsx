import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Alert, Linking, TextInput, Pressable, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';
import { ThemeContext } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';

const disabilityTypes = [
  'Physical',
  'Visual',
  'Hearing',
  'Cognitive',
  'Other',
];
const mobilityEquipments = [
  'Wheelchair',
  'Cane',
  'Walker',
  'None',
  'Other',
];

// // Create an interface for our map components
// interface MapComponents {
//   MapView: any;
//   Marker: any;
//   PROVIDER_GOOGLE?: any; // Optional, only if using Google Maps
// }

// // Initialize map components based on platform
// const getMapComponents = (): MapComponents => {
//   if (Platform.OS !== 'web') {
//     try {
//       const Maps = require('react-native-maps');
//       return {
//         MapView: Maps.default,
//         Marker: Maps.Marker,
//         PROVIDER_GOOGLE: Maps.PROVIDER_GOOGLE, // If you need Google Maps provider
//       };
//     } catch (error) {
//       console.warn('Failed to load react-native-maps:', error);
//       return {
//         MapView: null,
//         Marker: null,
//         PROVIDER_GOOGLE: null, // No Google Maps provider available
//       };
//     }
//   }
//   return {
//     MapView: null,
//     Marker: null,
//     PROVIDER_GOOGLE: null, // No Google Maps provider on web
//   };
// };

// // Get map components
// const { MapView, Marker, PROVIDER_GOOGLE } = getMapComponents();

const CaregiverBooking = () => {

  const { currentTheme } = React.useContext(ThemeContext);

  // Bottom sheet - Updated for better Android scrolling
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '60%', '90%'], []);

  // Rider info
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [disabilityType, setDisabilityType] = useState('Physical');
  const [mobilityEquipment, setMobilityEquipment] = useState('None');

  // Pickup/dropoff
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideTimeType, setRideTimeType] = useState<'ASAP' | 'SCHEDULE'>('ASAP');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  // Accessibility
  const [ramp, setRamp] = useState(false);
  const [assistiveDevice, setAssistiveDevice] = useState(false);
  const [signLanguage, setSignLanguage] = useState(false);
  const [notSure, setNotSure] = useState(false);

  // Caregiver info
  const [joining, setJoining] = useState(false);
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [instructions, setInstructions] = useState('');

  // Modal for SOS
  const [sosVisible, setSosVisible] = useState(false);

  // Add date picker state
  const [isDatePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date'); // Default to date picker

  // Request location permission
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') return; // Skip on web

      let { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (canAskAgain) {
          Alert.alert('Location Permission Required', 'Please enable location permissions to autofill your pickup location.');
        } else {
          Alert.alert('Location Permission Denied', 'You have denied location permissions. Please enable them in settings to use this feature.');
        }
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      // console.log('Current location:', location);
      let address = await Location.reverseGeocodeAsync(location.coords);
      // console.log('Address:', address);
      setUserLocation(location);
      setPickup(address[0]?.street || address[0]?.name || 'Unknown Location');
    })();
  }, [])

  // Autofill pickup with current location
  const handleUseCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (canAskAgain) {
          Alert.alert('Location Permission Required', 'Please enable location permissions to autofill your pickup location.');
        } else {
          Alert.alert('Location Permission Denied', 'You have denied location permissions. Please enable them in settings to use this feature.');
        }
        setLoadingLocation(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // console.log('Current location:', location); // Debugging line
      setUserLocation(location);
      let address = await Location.reverseGeocodeAsync(location.coords);
      // console.log('Address:', address); // Debugging line
      setPickup(address[0]?.street || `${address[0]?.city}, ${address[0].country}` || 'Unknown Location');
      setLoadingLocation(false);
    } catch (e) {
      setLoadingLocation(false);
      Alert.alert('Error', 'Could not get current location.');
    }
  };

  // WhatsApp message
  const handleWhatsAppRequest = () => {
    let rideTime = rideTimeType === 'ASAP' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`;
    let needs = [];
    if (notSure) needs.push("I'm not sure");
    else {
      if (ramp) needs.push('Ramp');
      if (assistiveDevice) needs.push('Assistive Device');
      if (signLanguage) needs.push('Sign Language');
    }
    let needsStr = needs.length ? needs.join(', ') : 'None';
    let msg = `Hello Ace Mobility, I'd like to book a ride for someone in my care:\n\n` +
      `🧑 Rider: ${riderName}\n` +
      `📞 Rider Phone: ${riderPhone}\n` +
      `♿ Disability Type: ${disabilityType}\n` +
      `🦽 Mobility Equipment: ${mobilityEquipment}\n` +
      `🚐 Pickup: ${pickup}\n` +
      `📍 Dropoff: ${dropoff}\n` +
      `⏰ Time: ${rideTime}\n` +
      `🔧 Needs: ${needsStr}\n\n`;
    if (instructions) msg += `📋 Notes: ${instructions}\n`;
    msg += ``;
    msg += joining ? '👤 I will be riding with them.\n' : '👤 I will NOT be riding with them.\n';
    if (caregiverPhone) msg += `📞 My Phone: ${caregiverPhone}`;
    // console.log('WhatsApp message:', msg); // Debugging line
    const url = `https://wa.me/254742560540?text=${msg}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
  };

  // ACE Mobility Deep Link
  const handleAceMobilityRequest = () => {
    // let rideTime = rideTimeType === 'ASAP' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`;
    // let needs = [];
    // if (ramp) needs.push('Ramp');
    // if (assistiveDevice) needs.push('Assistive Device');
    // if (signLanguage) needs.push('Sign Language');
    // let needsStr = needs.length ? needs.join(', ') : 'None';
    // let msg = `Hello Ace Mobility, I’d like to request a ride:\n\nPickup: ${pickup}\nDrop-off: ${dropoff}\nTime: ${rideTime}\nAccessibility needs: ${needsStr}\n\n`;
    // if (instructions) msg += `Instructions: ${instructions}`;
    // // console.log('ACE Mobility message:', msg); // Debugging line
    // const url = `https://acemobility.co.ke/request?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&time=${encodeURIComponent(rideTime)}&needs=${encodeURIComponent(needsStr)}&instructions=${encodeURIComponent(instructions)}`;
    // Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open ACE Mobility.'));

    // For now, just Alert the user
    Alert.alert('Make sure you have the ACE Mobility app installed', 'This feature is under development. Please use the WhatsApp option for now.', [
      { text: 'OK', onPress: () => handleWhatsAppRequest() },
      { text: 'Cancel', style: 'cancel' }
    ]);
  }

  // Add date/time picker functions
  const showMode = (currentMode: 'date' | 'time') => {
    setMode(currentMode);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(),
        onChange: currentMode === 'date' ? handleScheduledDateChange : handleScheduledTimeChange,
        mode: currentMode,
        is24Hour: true, // Use 24-hour format
      });
    } else {
      setDatePickerModalVisible(true);
    }
  }

  const handleScheduledDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setScheduledDate(currentDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD
  }

  const handleScheduledTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    setScheduledTime(`${hours}:${minutes}`); // Format: HH:MM
  }

  // Open date picker for scheduling
  const openDatePicker = () => {
    showMode('date');
  };

  // Open time picker for scheduling
  const openTimePicker = () => {
    showMode('time');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {
        MapView && Marker ? (
          <MapView
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Use Google Maps on Android, Apple Maps on iOS
            // mapType="hybrid" // Use hybrid map type
            // mapType="mutedStandard" // Use muted standard map type
            mapType="standard" // Use standard map type
            showsUserLocation={true} // Show user's current location
            // followUserLocation={true} // Follow user's location
            showsMyLocationButton={true} // Show button to center map on user's location
            showsPointsOfInterest={true} // Show points of interest
            showsCompass={true} // Show compass
            showsScale={true} // Show scale (Available on iOS only)
            showsTraffic={true} // Show traffic layer
            showsIndoors={true} // Show indoor maps if available
            showsBuildings={true} // Show 3D buildings if available
            showsIndoorLevelPicker={true} // Show indoor level picker ( Google Maps only )
            loadingEnabled={true} // Show loading indicator while map is loading
            loadingIndicatorColor={Colors.primary} // Customize loading indicator color
            zoomEnabled={true} // Allow zooming
            // maxZoomLevel={20} // Set maximum zoom level
            // cameraZoomRange={{ min: 5, max: 20 }} // Set zoom range
            scrollEnabled={true} // Allow scrolling
            pitchEnabled={true} // Allow tilting the map
            rotateEnabled={true} // Allow rotating the map
            initialRegion={{
              latitude: -1.2615302, // Default to Ace Mobility HQ
              longitude: 36.7132576, // Ace Mobility HQ coordinates
              latitudeDelta: 0.0922, // Adjust for your needs
              longitudeDelta: 0.0421, // Adjust for your needs
            }}
          >
            {userLocation && userLocation.coords && typeof userLocation.coords.latitude === 'number' && typeof userLocation.coords.longitude === 'number' && (
              <Marker
                coordinate={{ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }}
                title="Your Location"
                description="Current location"
                pinColor={Colors.primary}
              />
            )}
            <Marker
              coordinate={{ latitude: -1.2615302, longitude: 36.7132576 }}
              pinColor="#FAB515"
              title="Ace Mobility Ke"
              description="Ace Mobility Headquarters"
            />
          </MapView>
        ) : (
          <Text style={{ color: currentTheme === 'light' ? Colors.primary : Colors.white, textAlign: 'center', marginTop: 20 }}>
            Map not available. Please check your device settings or install the required maps app.
          </Text>
        )
      }

      <BottomSheet
        ref={bottomSheetRef}
        index={1} // Start with more space (60% height)
        snapPoints={snapPoints}
        keyboardBehavior="extend" // Handle keyboard better
        android_keyboardInputMode="adjustResize" // Android specific
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true} // Allow dragging the bottom sheet
        handleIndicatorStyle={{ backgroundColor: currentTheme === 'light' ? Colors.primary : Colors.white }} // Customize handle color
        backgroundStyle={{ backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }} // Background color of the bottom sheet
      >
        <BottomSheetScrollView
          contentContainerStyle={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
          showsVerticalScrollIndicator={true}
          keyboardDismissMode='on-drag'
          // Key settings for better Android scrolling:
          keyboardShouldPersistTaps="handled"
          bounces={false}
          overScrollMode="never"
        >
          {/* Rider Info */}
          <Text
            style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="header"
            accessibilityLabel="Who is this ride for?"
          >
            Who is this ride for?
          </Text>
          <FormField
            type='text'
            title="Full Name"
            icon={true}
            iconName="person-outline"
            iconFamily="Ionicons"
            value={riderName}
            placeholder="Rider's full name"
            onChangeText={setRiderName}
            otherStyles={{ marginBottom: 16 }}
            accessibilityLabel="Rider's full name"
            accessibilityHint="Enter the full name of the person who needs the ride"
          />
          <FormField
            type='phone'
            title="Phone Number"
            icon={true}
            iconName="call-outline"
            iconFamily="Ionicons"
            value={riderPhone}
            placeholder="Rider's phone number"
            onChangeText={setRiderPhone}
            accessibilityLabel="Rider's phone number"
            accessibilityHint="Enter the phone number of the person who needs the ride"
          />

          {/* Disability and Mobility */}
          <Text
            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
            accessibilityLabel="Disability Type Label"
          >
            Disability Type
          </Text>
          <View style={styles.selectRow}>
            {disabilityTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.selectOption, disabilityType === type && styles.selectOptionActive]}
                onPress={() => setDisabilityType(type)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${type} disability type`}
                accessibilityHint={`Selects ${type} as the disability type for the rider`}
              >
                <Text style={[styles.selectOptionText, disabilityType === type && styles.selectOptionTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
            accessibilityLabel="Mobility Equipment Label"
          >
            Mobility Equipment (if any)
          </Text>
          <View style={styles.selectRow}>
            {mobilityEquipments.map(eq => (
              <TouchableOpacity
                key={eq}
                style={[styles.selectOption, mobilityEquipment === eq && styles.selectOptionActive]}
                onPress={() => setMobilityEquipment(eq)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${eq} mobility equipment`}
                accessibilityHint={`Selects ${eq} as the mobility equipment for the rider`}
              >
                <Text style={[styles.selectOptionText, mobilityEquipment === eq && styles.selectOptionTextActive]}>{eq}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pickup Location */}
          <Text
            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
            accessibilityLabel="Pickup Location Label"
          >
            Where should we pick them(him/her) up?
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <FormField
              type='text'
              title="Pickup"
              icon={true}
              iconName="location-outline"
              iconFamily="Ionicons"
              value={pickup}
              placeholder="Enter pickup location"
              onChangeText={setPickup}
              otherStyles={{ flex: 1 }}
              accessibilityLabel="Pickup Location Input"
              accessibilityHint="Enter the location where the rider should be picked up"
            />
            <TouchableOpacity
              onPress={handleUseCurrentLocation}
              style={{ marginLeft: 8 }}
              disabled={loadingLocation}
              accessibilityLabel="Use Current Location Button"
              accessibilityHint="Press to use your current location as pickup"
              accessibilityRole="button"
              aria-label="Use Current Location Button"
            >
              <Ionicons name="locate" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Drop-off Location */}
          <Text
            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
            accessibilityLabel="Drop-off Location Label"
          >
            Where are they(him/her) going?
          </Text>
          <FormField
            type='text'
            title="Dropoff"
            icon={true}
            iconName="flag-outline"
            iconFamily="Ionicons"
            value={dropoff}
            placeholder="Enter drop-off location"
            onChangeText={setDropoff}
            accessibilityLabel="Drop-off Location Input"
            accessibilityHint="Enter the destination for the rider"
          />

          {/* Ride Time Selection */}
          <Text
            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
            accessibilityLabel="Ride Time Label"
          >
            Ride Time
          </Text>
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setRideTimeType('ASAP')}
              accessibilityLabel="Select ASAP Ride Time"
              accessibilityHint="Select to request a ride as soon as possible"
              accessibilityRole="radio"
              aria-label="Select ASAP Ride Time"
              accessibilityState={{ checked: rideTimeType === 'ASAP' }}
            >
              <View style={[styles.radioCircle, rideTimeType === 'ASAP' && { borderColor: Colors.secondary }]}>
                {rideTimeType === 'ASAP' && <View style={[styles.radioDot, { backgroundColor: Colors.secondary }]} />}
              </View>
              <Text style={[styles.radioLabel, rideTimeType === 'ASAP' && { color: currentTheme === 'light' ? Colors.primary : Colors.white }, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                As soon as possible
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setRideTimeType('SCHEDULE')}
              accessibilityLabel="Select Scheduled Ride Time"
              accessibilityHint="Select to schedule a ride for later"
              accessibilityRole="radio"
              aria-label="Select Scheduled Ride Time"
              accessibilityState={{ checked: rideTimeType === 'SCHEDULE' }}
            >
              <View style={[styles.radioCircle, rideTimeType === 'SCHEDULE' && { borderColor: Colors.secondary }]}>
                {rideTimeType === 'SCHEDULE' && <View style={[styles.radioDot, { backgroundColor: Colors.secondary }]} />}
              </View>
              <Text style={[styles.radioLabel, rideTimeType === 'SCHEDULE' && { color: currentTheme === 'light' ? Colors.primary : Colors.white }, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Schedule for later
              </Text>
            </TouchableOpacity>
          </View>
          {rideTimeType === 'SCHEDULE' && (
            <>
              <View style={{ flexDirection: 'row', width: '100%', gap: 8 }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={openDatePicker}
                  accessibilityLabel="Open Date Picker"
                  accessibilityHint="Press to select a date for the scheduled ride"
                  accessibilityRole="button"
                  aria-label="Open Date Picker"
                >
                  <FormField
                    type='text'
                    title='Date'
                    value={scheduledDate}
                    icon={true}
                    iconName='calendar-outline'
                    iconFamily='Ionicons'
                    placeholder="Select date"
                    onChangeText={() => { }}
                    otherStyles={{ flex: 1 }}
                    editable={false}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={openTimePicker}
                  accessibilityLabel="Open Time Picker"
                  accessibilityHint="Press to select a time for the scheduled ride"
                  accessibilityRole="button"
                  aria-label="Open Time Picker"
                >
                  <FormField
                    type='text'
                    title='Time'
                    value={scheduledTime}
                    icon={true}
                    iconName='time-outline'
                    iconFamily='Ionicons'
                    placeholder="Select time"
                    onChangeText={() => { }}
                    otherStyles={{ flex: 1 }}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
              {/* DateTimePickerModal for iOS */}
              {Platform.OS === 'ios' && (
                <DateTimePickerModal
                  isVisible={isDatePickerModalVisible}
                  mode={mode}
                  onConfirm={mode === 'date' ? handleScheduledDateChange : handleScheduledTimeChange}
                  onCancel={() => setDatePickerModalVisible(false)}
                  date={new Date()} // Default to current date/time
                />
              )}
            </>
          )}

          {/* Accessibility Preferences */}
          <Text
            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
            accessibilityLabel="Accessibility Preferences Label"
          >
            Accessibility Preferences
          </Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleOption, ramp && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white }, { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]}
              onPress={() => setRamp(v => !v)}
              accessibilityLabel="Toggle Ramp/Lift Accessibility"
              accessibilityHint="Press to indicate if you need a ramp or lift for wheelchair access"
              accessibilityRole="button"
              aria-label="Toggle Ramp/Lift Accessibility"
            >
              <MaterialCommunityIcons name="wheelchair-accessibility" size={22} color={ramp ? currentTheme === 'light' ? Colors.black : Colors.white : Colors.accent} />
              <Text style={[styles.toggleLabel, ramp && { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Ramp/Lift
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, assistiveDevice && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white }, { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]}
              onPress={() => setAssistiveDevice(v => !v)}
              accessibilityLabel="Toggle Assistive Device Accessibility"
              accessibilityHint="Press to indicate if you need assistance with an assistive device"
              accessibilityRole="button"
              aria-label="Toggle Assistive Device Accessibility"
            >
              <FontAwesome5 name="walking" size={20} color={assistiveDevice ? currentTheme === 'light' ? Colors.black : Colors.white : Colors.accent} />
              <Text style={[styles.toggleLabel, assistiveDevice && { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Assistive Device
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, signLanguage && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white }, { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]}
              onPress={() => setSignLanguage(v => !v)}
              accessibilityLabel="Toggle Sign Language Accessibility"
              accessibilityHint="Press to indicate if you need a driver who knows sign language"
              accessibilityRole="button"
              aria-label="Toggle Sign Language Accessibility"
            >
              <MaterialCommunityIcons name="hand-peace" size={22} color={signLanguage ? currentTheme === 'light' ? Colors.black : Colors.white : Colors.accent} />
              <Text style={[styles.toggleLabel, signLanguage && { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Sign Language
              </Text>
            </TouchableOpacity>
          </View>

          {/* Caregiver Info */}
          <Text
            style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="header"
            accessibilityLabel="Caregiver Accompanying Info"
          >
            Are you accompanying them?
          </Text>
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setJoining(true)}
              accessibilityLabel="Select Yes for Accompanying"
              accessibilityHint="Select if you will be riding with the person"
              accessibilityRole="radio"
              aria-label="Select Yes for Accompanying"
              accessibilityState={{ checked: joining }}
            >
              <View style={[styles.radioCircle, joining && { borderColor: Colors.secondary }]}>
                {joining && <View style={[styles.radioDot, { backgroundColor: Colors.secondary }]} />}
              </View>
              <Text style={[styles.radioLabel, joining && { color: currentTheme === 'light' ? Colors.primary : Colors.white }, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Yes, I will ride with them
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setJoining(false)}
              accessibilityLabel="Select No for Accompanying"
              accessibilityHint="Select if you will not be riding with the person"
              accessibilityRole="radio"
              aria-label="Select No for Accompanying"
              accessibilityState={{ checked: !joining }}
            >
              <View style={[styles.radioCircle, !joining && { borderColor: Colors.primary }]}>
                {!joining && <View style={[styles.radioDot, { backgroundColor: Colors.primary }]} />}
              </View>
              <Text style={[styles.radioLabel, !joining && { color: currentTheme === 'light' ? Colors.primary : Colors.white }, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                No, I will NOT ride with them
              </Text>
            </TouchableOpacity>
          </View>
          <FormField
            type='phone'
            title="Phone"
            icon={true}
            iconName="call-outline"
            iconFamily="Ionicons"
            value={caregiverPhone}
            placeholder="Your phone number"
            onChangeText={setCaregiverPhone}
            accessibilityLabel="Caregiver Phone Number"
            accessibilityHint="Enter your phone number as the caregiver"
          />

          <View style={{ width: '100%' }}>
            <Text
              style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
              accessibilityRole="header"
              accessibilityLabel="Special Instructions Section"
            >
              Special Instructions (optional)
            </Text>
            <TextInput
              placeholder='E.g. Rider uses hearing aid, please speak clearly'
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={5}
              style={[styles.instructionInput, { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray, color: currentTheme === 'light' ? Colors.black : Colors.white }]}
              accessibilityLabel="Special Instructions Input"
              accessibilityHint="Enter any special instructions for the driver"
            />
          </View>

          {/* Summary Preview Card */}
          <View
            style={[styles.summaryCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
            accessibilityRole="summary"
            accessibilityLabel="Trip Summary"
          >
            <Text style={[styles.summaryTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Trip Summary Title">
              Trip Summary
            </Text>

            <View style={styles.summaryRow}>
              <Ionicons name="person" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Rider Name: ${riderName}`}>
                Rider: {riderName}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="call" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Rider Phone: ${riderPhone}`}>
                Rider Phone: {riderPhone}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Disability Type: ${disabilityType}`}>
                Disability: {disabilityType}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <MaterialCommunityIcons name="tools" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Mobility Equipment: ${mobilityEquipment}`}>
                Equipment: {mobilityEquipment}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="location" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Pickup Location: ${pickup}`}>
                From: {pickup}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="flag" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Drop-off Location: ${dropoff}`}>
                To: {dropoff}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Ionicons name="time" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Ride Time: ${rideTimeType === 'ASAP' ? 'ASAP' : `${scheduledDate} at ${scheduledTime}`}`}>
                Time: {rideTimeType === 'ASAP' ? 'ASAP' : `${scheduledDate} at ${scheduledTime}`}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <MaterialCommunityIcons name="tools" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Accessibility Needs: ${notSure ? "I'm not sure" : [ramp && 'Ramp', assistiveDevice && 'Assistive Device', signLanguage && 'Sign Language'].filter(Boolean).join(', ') || 'None'}`}>
                Needs: {notSure ? "I'm not sure" : [
                  ramp && 'Ramp',
                  assistiveDevice && 'Assistive Device',
                  signLanguage && 'Sign Language'
                ].filter(Boolean).join(', ') || 'None'}
              </Text>
            </View>

            {instructions && (
              <View style={styles.summaryRow}>
                <Ionicons name="chatbox-ellipses" size={24} color={Colors.secondary} />
                <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Special Instructions: ${instructions}`}>
                  Notes: <Text style={{ fontStyle: 'italic', color: '#666' }}>{instructions}</Text>
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Ionicons name="people" size={24} color={Colors.secondary} />
              <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Caregiver Accompanying: ${joining ? 'Yes' : 'No'}`}>
                {joining ? 'You will ride with them.' : 'You will NOT ride with them.'}
              </Text>
            </View>

            {caregiverPhone && (
              <View style={styles.summaryRow}>
                <Ionicons name="call" size={24} color={Colors.secondary} />
                <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Caregiver Phone: ${caregiverPhone}`}>
                  Your Phone: {caregiverPhone}
                </Text>
              </View>
            )}
          </View>

          {/* Primary Action Button */}
          <CustomButton
            title="Request with ACE Mobility"
            handlePress={handleAceMobilityRequest}
            containerStyle={{ marginTop: 18, backgroundColor: Colors.primary, width: '100%' }}
            textStyle={{ color: '#fff', fontWeight: 'bold' }}
            disabled={!pickup || !dropoff}
          />

          {/* Secondary Action Button */}
          <CustomButton
            title="📲 Request via WhatsApp"
            handlePress={handleWhatsAppRequest}
            containerStyle={{ marginTop: 12, backgroundColor: '#25D366', width: '100%' }}
            textStyle={{ color: '#fff', fontWeight: 'bold' }}
            disabled={!pickup || !dropoff}
          />

          {/* Emergency Contact Option */}
          <TouchableOpacity style={styles.sosRow} onPress={() => setSosVisible(true)} accessibilityRole='button' accessibilityLabel='Emergency Ride Assistance' accessibilityHint='Press to request emergency ride assistance'>
            <Text
              style={[styles.sosText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}
              accessibilityRole="text"
              accessibilityLabel="Need help right now?"
            >
              Need help right now?
            </Text>
            <Text
              style={styles.sosButton}
              accessibilityRole="text"
              accessibilityLabel="Emergency Ride Hotline"
            >
              🚨 Emergency Ride Hotline
            </Text>
          </TouchableOpacity>
          <Modal
            visible={sosVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setSosVisible(false)}
            accessibilityLabel="Emergency Ride Assistance Modal"
            accessibilityHint="Modal for emergency ride assistance"
            aria-label="Emergency Ride Assistance Modal"
          >
            <View style={styles.sosModalBg}>
              <View style={[styles.sosModalCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: currentTheme === 'light' ? Colors.primary : Colors.white }}>
                  🚨
                  Emergency Ride Assistance
                </Text>
                <Text style={{ marginBottom: 16, color: currentTheme === 'light' ? Colors.black : Colors.white }}>
                  If you need immediate assistance, please call our emergency ride hotline. Our team is available 24/7 to help you with urgent ride requests.
                </Text>
                <CustomButton
                  title="Call Now"
                  handlePress={() => {
                    setSosVisible(false);
                    Linking.openURL('tel:+254742560540').catch(() => {
                      Alert.alert('Error', 'Could not open dialer.');
                    });
                  }}
                  containerStyle={{ backgroundColor: '#D7263D' }}
                  textStyle={{ color: '#fff', fontWeight: 'bold' }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: true }}
                  accessibilityLabel="Call Emergency Ride Hotline"
                  accessibilityHint="Press to call the emergency ride hotline"
                />
                <Pressable
                  onPress={() => setSosVisible(false)} style={{ marginTop: 12 }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: true }}
                  accessibilityLabel="Cancel Emergency Assistance"
                  accessibilityHint="Press to close the emergency assistance modal"
                >
                  <Text style={{ color: currentTheme === 'light' ? Colors.primary : Colors.accent, fontWeight: 'bold', textAlign: 'center' }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </BottomSheetScrollView>
      </BottomSheet>
    </KeyboardAvoidingView>
  )
}

export default CaregiverBooking

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Full screen map
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 18,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 12,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  selectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    width: '100%',
    flexWrap: 'wrap',
  },
  selectOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: Colors.lightGray,
  },
  selectOptionActive: {
    backgroundColor: Colors.secondary,
  },
  selectOptionText: {
    fontWeight: '500',
  },
  selectOptionTextActive: {
    color: Colors.white,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
    width: '100%',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 15,
  },
  toggleOption: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleLabel: {
    fontSize: 13,
    marginTop: 4,
    color: Colors.accent,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  instructionInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sosRow: {
    marginVertical: 28,
    alignItems: 'center',
    width: '100%',
  },
  sosText: {
    fontSize: 15,
  },
  sosButton: {
    fontSize: 16,
    color: Colors.emergency,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sosModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosModalCard: {
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
})