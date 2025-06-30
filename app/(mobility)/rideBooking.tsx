import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Linking, Alert, Modal, Pressable, KeyboardAvoidingView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from "expo-location";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import Colors from '@/constants/Colors';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import { ThemeContext } from '@/contexts/ThemeContext';

import CustomButton from '@/components/common/CustomButton';
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';
import AccessibilityOption from '@/components/accessibility/AccessibilityOption';
import FormField from '@/components/common/FormField';



// // Create an interface for our map components
// interface MapComponents {
//     MapView: any;
//     Marker: any;
//     PROVIDER_GOOGLE?: any; // Optional, only if using Google Maps
// }

// // Initialize map components based on platform
// const getMapComponents = (): MapComponents => {
//     if (Platform.OS !== 'web') {
//         try {
//             const Maps = require('react-native-maps');
//             return {
//                 MapView: Maps.default,
//                 Marker: Maps.Marker,
//                 PROVIDER_GOOGLE: Maps.PROVIDER_GOOGLE, // If you need Google Maps provider
//             };
//         } catch (error) {
//             console.warn('Failed to load react-native-maps:', error);
//             return {
//                 MapView: null,
//                 Marker: null,
//                 PROVIDER_GOOGLE: null, // No Google Maps provider available
//             };
//         }
//     }
//     return {
//         MapView: null,
//         Marker: null,
//         PROVIDER_GOOGLE: null, // No Google Maps provider on web
//     };
// };

// // Get map components
// const { MapView, Marker, PROVIDER_GOOGLE } = getMapComponents();

const RideBooking = () => {
    const router = useRouter();

    const { currentTheme } = React.useContext(ThemeContext);
    const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

    // Form state
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [rideTimeType, setRideTimeType] = useState<'ASAP' | 'SCHEDULE'>('ASAP');
    const [scheduledDate, setScheduledDate] = useState(''); // Format: YYYY-MM-DD
    const [scheduledTime, setScheduledTime] = useState(''); // Format: HH:MM
    const [isDatePickerModalVisible, setDatePickerModalVisible] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date'); // Default to date picker
    const [ramp, setRamp] = useState(false);
    const [assistiveDevice, setAssistiveDevice] = useState(false);
    const [signLanguage, setSignLanguage] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [sosVisible, setSosVisible] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [userAddress, setUserAddress] = useState<string | null>(null);

    // Bottom sheet ref and dynamic snap points
    const bottomSheetRef = useRef<BottomSheet>(null);
    // Use percentages that provide more space for the content
    const snapPoints = useMemo(() => ['25%', '60%', '90%'], [])

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
            setUserAddress(address[0]?.street || address[0]?.name || 'Unknown Location');
            setPickup(address[0]?.street || address[0]?.name || 'Unknown Location'); // Mock pickup with address
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
            // console.log('Current location:', location);
            let address = await Location.reverseGeocodeAsync(location.coords);
            // console.log('Pickup Address:', address);
            setUserLocation(location);
            setUserAddress(address[0]?.street || `${address[0]?.city}, ${address[0].country}` || 'Unknown Location');
            setPickup(address[0]?.street || `${address[0]?.city}, ${address[0].country}` || 'Unknown Location'); // Autofill pickup
            Alert.alert('Location Set', `Pickup location set to: ${address[0]?.street || `${address[0]?.city}, ${address[0].country}` || 'Unknown Location'}`);
            setLoadingLocation(false);
        } catch (e) {
            setLoadingLocation(false);
            Alert.alert('Error', 'Could not get current location.');
        }
    };

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

    // WhatsApp deep link
    const handleWhatsAppRequest = () => {
        let rideTime = rideTimeType === 'ASAP' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`;
        let needs = [];
        if (ramp) needs.push('Ramp');
        if (assistiveDevice) needs.push('Assistive Device');
        if (signLanguage) needs.push('Sign Language');
        let needsStr = needs.length ? needs.join(', ') : 'None';
        let msg = `Hello Ace Mobility, I’d like to request a ride:\n\nPickup: ${pickup}\nDrop-off: ${dropoff}\nTime: ${rideTime}\nAccessibility needs: ${needsStr}\n\n`;
        if (instructions) msg += `Instructions: ${instructions}`;
        // console.log('WhatsApp message:', msg); // Debugging line
        const url = `https://wa.me/254742560540?text=${msg}`; // Replace with Ace Mobility's WhatsApp number
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

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            accessibilityLabel="Ride Booking Screen"
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
                    {/* Pickup Location */}
                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Pickup Location Label"
                    >
                        Where should we pick you up?
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <FormField
                            type='text'
                            title='Pickup'
                            value={pickup}
                            icon={true}
                            iconName='location-outline'
                            iconFamily='Ionicons'
                            placeholder="Enter pickup location"
                            onChangeText={setPickup}
                            otherStyles={{ flex: 1 }}
                            accessibilityLabel="Pickup Location Input Field"
                            accessibilityHint="Enter your pickup location"
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
                        Where are you going?
                    </Text>
                    <FormField
                        type='text'
                        title='Drop-off'
                        value={dropoff}
                        icon={true}
                        iconName='flag-outline'
                        iconFamily='Ionicons'
                        placeholder="Enter drop-off location"
                        onChangeText={setDropoff}
                        otherStyles={{ marginBottom: 16 }}
                        accessibilityLabel="Drop-off Location Input Field"
                        accessibilityHint="Enter your drop-off location"
                    />

                    {/* Ride Time Selection */}
                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Ride Time Selection Label"
                    >
                        When would you like to ride?
                    </Text>
                    <View style={styles.radioRow}>
                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setRideTimeType('ASAP')}
                            accessibilityLabel="Select ASAP Ride Time"
                            accessibilityHint="Select to request a ride as soon as possible"
                            accessibilityRole="radio"
                            aria-label="Select ASAP Ride Time"
                        >
                            <View style={[styles.radioCircle, rideTimeType === 'ASAP' && { borderColor: Colors.secondary }]} >
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
                        >
                            <View style={[styles.radioCircle, rideTimeType === 'SCHEDULE' && { borderColor: Colors.secondary }]} >
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
                                    accessibilityHint="Press to select a date for your scheduled ride"
                                    accessibilityRole="button"
                                    aria-label="Open Date Picker"
                                >
                                    <FormField
                                        type='text'
                                        title='Scheduled Date'
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
                                    accessibilityHint="Press to select a time for your scheduled ride"
                                    accessibilityRole="button"
                                    aria-label="Open Time Picker"
                                >
                                    <FormField
                                        type='text'
                                        title='Scheduled Time'
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
                    <View style={{ width: '100%' }}>
                        <Text
                            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                            accessibilityRole="text"
                            accessibilityLabel="Additional Instructions Label"
                        >
                            Additional Instructions
                        </Text>
                        <Text
                            style={{ color: Colors.accent, fontSize: 13, marginBottom: 8 }}
                            accessibilityRole="text"
                            accessibilityLabel="Additional Instructions Hint"
                            accessibilityHint="Enter any special instructions for the driver"
                        >
                            Optional notes for the driver (e.g. pickup notes)
                        </Text>
                        <FormField
                            type='text'
                            title='Instructions'
                            value={instructions}
                            onChangeText={setInstructions}
                            placeholder="Enter any special instructions"
                            multiline={true}
                            numberOfLines={3}
                            otherStyles={styles.instructionInput}
                            accessibilityLabel="Additional Instructions Input Field"
                            accessibilityHint="Enter any additional instructions for the driver"
                        />
                    </View>

                    {/* Summary Preview Card */}
                    <View
                        style={[styles.summaryCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                        accessibilityRole="summary"
                        accessibilityLabel="Trip Summary"
                    >
                        <Text style={[styles.summaryTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='text' accessibilityLabel='Ride Summary Title'>
                            Ride Summary
                        </Text>

                        <View style={styles.summaryRow}>
                            <Ionicons name="location" size={24} color={Colors.secondary} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Pickup Location: ${pickup}`}>
                                From: {pickup}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="flag" size={24} color={Colors.secondary} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Drop-off Location: ${dropoff}`}>
                                To: {dropoff}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="time" size={24} color={Colors.secondary} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Ride Time: ${rideTimeType === 'ASAP' ? 'ASAP' : `${scheduledDate} at ${scheduledTime}`}`}>
                                Ride time: {rideTimeType === 'ASAP' ? 'ASAP' : `${scheduledDate} at ${scheduledTime}`}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color={ramp ? Colors.secondary : Colors.accent} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Ramp/Lift Accessibility: ${ramp ? 'Yes' : 'No'}`}>
                                Ramp: {ramp ? '✅' : '❌'}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <FontAwesome5 name="walking" size={24} color={assistiveDevice ? Colors.secondary : Colors.accent} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Assistive Device Accessibility: ${assistiveDevice ? 'Yes' : 'No'}`}>
                                Assistive Device: {assistiveDevice ? '✅' : '❌'}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="hand-peace" size={24} color={signLanguage ? Colors.secondary : Colors.accent} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Sign Language Accessibility: ${signLanguage ? 'Yes' : 'No'}`}>
                                Sign Language: {signLanguage ? '✅' : '❌'}
                            </Text>
                        </View>

                        {
                            instructions &&
                            <View style={styles.summaryRow}>
                                <Ionicons name="chatbox-ellipses" size={24} color={Colors.secondary} />
                                <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                    Notes:
                                    <Text style={{ fontStyle: 'italic', color: Colors.accent }}>
                                        {' '}
                                        {instructions}
                                    </Text>
                                </Text>
                            </View>}
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
        </KeyboardAvoidingView>
    )
}

export default RideBooking

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject, // Full screen map
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 6,
        alignSelf: 'flex-start',
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
    toggleRow: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 8,
        width: '100%',
        justifyContent: 'space-between',
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
    },
    sosRow: {
        marginVertical: 28,
        alignItems: 'center',
        width: '100%',
    },
    instructionInput: {
        width: '100%',
        padding: 12,
        borderRadius: 8,
        fontSize: 15,
        borderWidth: 1,
    },
    sosText: {
        fontSize: 15,
        color: Colors.accent,
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
        backgroundColor: '#fff',
    },
})