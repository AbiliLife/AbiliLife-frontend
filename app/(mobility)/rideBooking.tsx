import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Linking, Alert, Pressable, KeyboardAvoidingView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from "expo-location";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Types - Location
import type { GeosearchResult } from '@/types/location';

// Location Services
import { getAddressFromCoordinates } from '@/services/locationService';

// Assets & Constants
import Colors from '@/constants/Colors';
import { images } from '@/constants/Images';

// Context & Store
import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';

// Components
import CustomButton from '@/components/common/CustomButton';
import FormField from '@/components/common/FormField';
import LocationSearchModal from '@/components/location/LocationSearchModal';

const RideBooking = () => {
    const router = useRouter();

    // Obtain context values
    const { currentTheme } = React.useContext(ThemeContext);
    const { user } = useOnboardingStore();

    // Form state
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [rideTimeType, setRideTimeType] = useState<'immediate' | 'scheduled'>('immediate');
    const [scheduledDate, setScheduledDate] = useState(''); // Format: YYYY-MM-DD
    const [scheduledTime, setScheduledTime] = useState(''); // Format: HH:MM
    const [isDatePickerModalVisible, setDatePickerModalVisible] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date'); // Default to date picker

    // Location search modals
    const [isPickupModalVisible, setPickupModalVisible] = useState(false);
    const [isDropoffModalVisible, setDropoffModalVisible] = useState(false);

    // Accessibility preferences
    const [ramp, setRamp] = useState(user.accessibilityPreferences.mobility.needsRamp || false);
    const [assistiveDevice, setAssistiveDevice] = useState(user.accessibilityPreferences.mobility.needsAssistiveDevice || false);
    const [signLanguage, setSignLanguage] = useState(user.accessibilityPreferences.hearing.needsSignLanguage || false);
    const [writtenCommunication, setWrittenCommunication] = useState(user.accessibilityPreferences.hearing.needsWrittenCommunication || false);
    const [transferAssist, setTransferAssist] = useState(user.accessibilityPreferences.mobility.transferAssistance || false);

    const [instructions, setInstructions] = useState('');
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
            setUserLocation(location);
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
            setUserLocation(location);

            // Use our location service for better address formatting
            const address = await getAddressFromCoordinates(
                location.coords.latitude,
                location.coords.longitude
            );

            setUserAddress(address);
            setPickup(address);
            setLoadingLocation(false);
        } catch (e) {
            setLoadingLocation(false);
            Alert.alert('Error', 'Could not get current location.');
        }
    };

    // Location selection handlers
    const handleLocationSelect = (location: GeosearchResult, isPickup: boolean) => {
        if (isPickup) {
            setPickup(location.name);
        } else {
            setDropoff(location.name);
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setMode(currentMode);
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: new Date(),
                onChange: (event, selectedDate) => {
                    if (event.type === 'dismissed') {
                        // Reset State when user cancels
                        setDatePickerModalVisible(false);
                        if (currentMode === 'date') setScheduledDate('');
                        if (currentMode === 'time') setScheduledTime('');
                        return;
                    }
                    if (currentMode === 'date') {
                        handleScheduledDateChange(event, selectedDate);
                    } else {
                        handleScheduledTimeChange(event, selectedDate);
                    }
                },
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
        let rideTime = rideTimeType === 'immediate' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`;
        let needs = [];
        if (ramp) needs.push('Ramp');
        if (assistiveDevice) needs.push('Assistive Device');
        if (signLanguage) needs.push('Sign Language');
        let needsStr = needs.length ? needs.join(', ') : 'None';
        let msg = `Hello Ace Mobility, I’d like to request a ride:\n\nPickup: ${pickup}\nDrop-off: ${dropoff}\nTime: ${rideTime}\nAccessibility needs: ${needsStr}\n\n`;
        if (instructions) msg += `Instructions: ${instructions}`;
        // console.log('WhatsApp message:', msg); // Debugging line
        const url = `https://wa.me/254738218657?text=${msg}`; // Replace with Ace Mobility's WhatsApp number
        Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
    };

    // SMS Deep Link
    const handleSmsRequest = () => {
        let rideTime = rideTimeType === 'immediate' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`;
        let needs = [];
        if (ramp) needs.push('Ramp');
        if (assistiveDevice) needs.push('Assistive Device');
        if (signLanguage) needs.push('Sign Language');
        let needsStr = needs.length ? needs.join(', ') : 'None';
        let msg = `Hello Ace Mobility, I’d like to request a ride:\n\nPickup: ${pickup}\nDrop-off: ${dropoff}\nTime: ${rideTime}\nAccessibility needs: ${needsStr}\n\n`;
        if (instructions) msg += `Instructions: ${instructions}`;
        // console.log('SMS message:', msg); // Debugging line
        const url = `sms:+254738218657?body=${msg}`;
        Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open SMS.'));
    };

    // ACE Mobility Deep Link
    const handleAceMobilityRequest = () => {
        // For now, just Alert the user
        Alert.alert('ACE Mobility', 'We are currently working on this integration. Please request via WhatsApp/SMS for now.', [
            { text: 'WhatsApp', onPress: () => handleWhatsAppRequest() },
            { text: 'SMS', onPress: () => handleSmsRequest() },
            { text: 'Call', onPress: () => Linking.openURL('tel:+254738218657') },
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
                        // loadingEnabled={true} // Show loading indicator while map is loading
                        // loadingIndicatorColor={Colors.primary} // Customize loading indicator color
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
                index={2} // Start with more space (90% height)
                snapPoints={snapPoints}
                keyboardBehavior="extend" // Handle keyboard better
                android_keyboardInputMode="adjustResize" // Android specific
                enableContentPanningGesture={true}
                enableHandlePanningGesture={true} // Allow dragging the bottom sheet
                handleIndicatorStyle={{ backgroundColor: currentTheme === 'light' ? Colors.black : Colors.white }} // Customize handle color
                backgroundStyle={{ backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }} // Background color of the bottom sheet
            >
                <BottomSheetScrollView
                    contentContainerStyle={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
                    showsVerticalScrollIndicator={true}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                    overScrollMode="never"
                >
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={32} color={Colors.emergency} />
                        <Text style={styles.infoText}>
                            WE ARE WORKING ON OUR GOOGLE MAPS PLATFORM INTEGRATION. IN THE MEANTIME, PLEASE REQUEST YOUR RIDE VIA WHATSAPP OR SMS.
                        </Text>
                    </View>
                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Where should we pick you up?"
                    >
                        Where should we pick you up?
                    </Text>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <TouchableOpacity
                            style={{ width: '100%' }}
                            onPress={() => setPickupModalVisible(true)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityHint="Tap to select pickup location"
                        >
                            <View pointerEvents="none">
                                <FormField
                                    type='text'
                                    title='Pickup'
                                    value={pickup}
                                    icon={true}
                                    iconName='location-outline'
                                    iconFamily='Ionicons'
                                    placeholder="Select pickup location"
                                    onChangeText={() => { }} // Disabled, handled by modal
                                    otherStyles={{ opacity: 1 }}
                                    accessibilityLabel="Pickup Location Input Field"
                                    accessibilityHint="Tap to search for pickup location"
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleUseCurrentLocation}
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}
                            disabled={loadingLocation}
                            accessibilityLabel="Use Current Location Button"
                            accessibilityHint="Press to use your current location as pickup"
                            accessibilityRole="button"
                            aria-label="Use Current Location Button"
                        >
                            <Text style={{ color: currentTheme === 'light' ? Colors.secondary : Colors.gray300, fontSize: 14 }}>
                                Use Current Location
                            </Text>
                            <Ionicons name="locate" size={24} color={Colors.secondary} />
                        </TouchableOpacity>
                    </View>

                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Where are you going?"
                    >
                        Where are you going?
                    </Text>
                    <TouchableOpacity
                        style={{ width: '100%' }}
                        onPress={() => setDropoffModalVisible(true)}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityHint="Tap to select drop-off location"
                    >
                        <View pointerEvents="none">
                            <FormField
                                type='text'
                                title='Drop-off'
                                value={dropoff}
                                icon={true}
                                iconName='flag-outline'
                                iconFamily='Ionicons'
                                placeholder="Select drop-off location"
                                onChangeText={() => { }} // Disabled, handled by modal
                                otherStyles={{ marginBottom: 16, opacity: 1 }}
                                accessibilityLabel="Drop-off Location Input Field"
                                accessibilityHint="Tap to search for drop-off location"
                            />
                        </View>
                    </TouchableOpacity>

                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="When would you like to ride?"
                    >
                        When would you like to ride?
                    </Text>
                    <View style={[styles.tabContainer, { backgroundColor: currentTheme === 'light' ? Colors.gray200 : Colors.gray600  }]} accessible={true}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                {
                                    backgroundColor:
                                        rideTimeType === 'immediate'
                                            ? (currentTheme === 'light' ? Colors.white : Colors.gray800)
                                            : (currentTheme === 'light' ? Colors.gray200 : Colors.gray600 ),
                                },
                            ]}
                            onPress={() => setRideTimeType('immediate')}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: rideTimeType === 'immediate' }}
                            accessibilityLabel="Immediate Tab"
                            accessibilityHint="Select to book a ride now"
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    rideTimeType === 'immediate'
                                        ? (currentTheme === 'light' ? styles.activeTabText : { color: Colors.white })
                                        : { color: currentTheme === 'light' ? Colors.primary : Colors.gray300 },
                                ]}
                            >
                                Now
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tab,
                                {
                                    backgroundColor:
                                        rideTimeType === 'scheduled'
                                            ? (currentTheme === 'light' ? Colors.white : Colors.gray800)
                                            : (currentTheme === 'light' ? Colors.gray200 : Colors.gray600 ),
                                },
                            ]}
                            onPress={() => setRideTimeType('scheduled')}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: rideTimeType === 'scheduled' }}
                            accessibilityLabel="Scheduled Tab"
                            accessibilityHint="Switch to scheduled tab"
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    rideTimeType === 'scheduled'
                                        ? (currentTheme === 'light' ? styles.activeTabText : { color: Colors.white })
                                        : { color: currentTheme === 'light' ? Colors.primary : Colors.gray300 },
                                ]}
                            >
                                Later
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {rideTimeType === 'scheduled' && (
                        <View style={{ marginTop: 16 }}>
                            <View style={styles.dateTimeContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.dateTimeButton,
                                        { borderColor: currentTheme === 'light' ? Colors.black : Colors.borderDark },
                                        scheduledDate && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white }
                                    ]}
                                    onPress={openDatePicker}
                                    accessible={true}
                                    accessibilityRole='button'
                                    accessibilityState={{ selected: !!scheduledDate }}
                                    accessibilityLabel="Open Date Picker"
                                    accessibilityHint="Press to select a date for your scheduled ride"
                                >
                                    <Ionicons name="calendar-outline" size={24} color={
                                        scheduledDate ? (currentTheme === 'light' ? Colors.secondary : Colors.white) : (currentTheme === 'light' ? Colors.black : Colors.borderDark)
                                    } />
                                    <Text style={[
                                        styles.dateTimeText,
                                        { color: currentTheme === 'light' ? Colors.gray500 : Colors.gray300 },
                                        scheduledDate && { color: currentTheme === 'light' ? Colors.secondary : Colors.white }
                                    ]}>
                                        {scheduledDate || "Select date"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.dateTimeButton,
                                        { borderColor: currentTheme === 'light' ? Colors.black : Colors.borderDark },
                                        scheduledTime && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white }
                                    ]}
                                    onPress={openTimePicker}
                                    accessible={true}
                                    accessibilityRole='button'
                                    accessibilityState={{ selected: !!scheduledTime }}
                                    accessibilityLabel="Open Time Picker"
                                    accessibilityHint="Press to select a time for your scheduled ride"
                                >
                                    <Ionicons name="time-outline" size={24} color={
                                        scheduledTime ? (currentTheme === 'light' ? Colors.secondary : Colors.white) : (currentTheme === 'light' ? Colors.black : Colors.borderDark)
                                    } />
                                    <Text style={[
                                        styles.dateTimeText,
                                        { color: currentTheme === 'light' ? Colors.gray500 : Colors.gray300 },
                                        scheduledTime && { color: currentTheme === 'light' ? Colors.secondary : Colors.white }
                                    ]}>
                                        {scheduledTime || "Select time"}
                                    </Text>
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
                        </View>
                    )}
                    <Text style={{ color: Colors.info, fontSize: 14, marginTop: 8, fontWeight: '500' }}>
                        NOTE: Driver dispatch times may vary based on traffic and availability.
                    </Text>

                    {/* Accessibility Preferences */}
                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Accessibility Preferences"
                    >
                        Accessibility Preferences
                    </Text>

                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                { backgroundColor: currentTheme === 'light' ? Colors.gray300 : Colors.gray800, borderWidth: 1 },
                                ramp && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white, backgroundColor: currentTheme === 'light' ? Colors.secondary : Colors.gray500, borderWidth: 2 }
                            ]}
                            onPress={() => setRamp(v => !v)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Toggle Ramp/Lift Accessibility"
                            accessibilityHint="Press to indicate if you need a ramp or lift for wheelchair access"
                            accessibilityState={{ checked: ramp }}
                        >
                            <MaterialCommunityIcons name="wheelchair-accessibility" size={22} color={Colors.blue} />
                            <Text style={[
                                styles.toggleLabel, 
                                { color: currentTheme === 'light' ? Colors.black : Colors.white },
                                ramp && { color: Colors.white}
                                ]}>
                                Ramp/Lift
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                { backgroundColor: currentTheme === 'light' ? Colors.gray300 : Colors.gray800, borderWidth: 1 },
                                transferAssist && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white, backgroundColor: currentTheme === 'light' ? Colors.secondary : Colors.gray500, borderWidth: 2 }
                            ]}
                            onPress={() => setTransferAssist(v => !v)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Toggle Transfer Assistance"
                            accessibilityHint="Press to indicate if you need assistance transferring into the vehicle"
                            accessibilityState={{ checked: transferAssist }}
                        >
                            <MaterialCommunityIcons name="wheelchair-accessibility" size={22} color={Colors.blue} />
                            <Text style={[
                                styles.toggleLabel, 
                                { color: currentTheme === 'light' ? Colors.black : Colors.white },
                                transferAssist && { color: Colors.white}
                                ]}>
                                Transfer Assistance
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                { backgroundColor: currentTheme === 'light' ? Colors.gray300 : Colors.gray800, borderWidth: 1 },
                                assistiveDevice && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white, backgroundColor: currentTheme === 'light' ? Colors.secondary : Colors.gray500, borderWidth: 2 }
                            ]}
                            onPress={() => setAssistiveDevice(v => !v)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Toggle Assistive Device Accessibility"
                            accessibilityHint="Press to indicate if you need assistance with an assistive device"
                            accessibilityState={{ checked: assistiveDevice }}
                        >
                            <FontAwesome5 name="walking" size={20} color={Colors.blue} />
                            <Text style={[
                                styles.toggleLabel, 
                                { color: currentTheme === 'light' ? Colors.black : Colors.white },
                                assistiveDevice && { color: Colors.white}
                                ]}>
                                Assistive Device
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                { backgroundColor: currentTheme === 'light' ? Colors.gray300 : Colors.gray800, borderWidth: 1 },
                                signLanguage && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white, backgroundColor: currentTheme === 'light' ? Colors.secondary : Colors.gray500, borderWidth: 2 }
                            ]}
                            onPress={() => setSignLanguage(v => !v)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Toggle Sign Language Accessibility"
                            accessibilityHint="Press to indicate if you need a driver who knows sign language"
                            accessibilityState={{ checked: signLanguage }}
                        >
                            <MaterialCommunityIcons name="hand-peace" size={22} color={Colors.blue} />
                            <Text style={[styles.toggleLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                Sign Language
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                { backgroundColor: currentTheme === 'light' ? Colors.gray300 : Colors.gray800, borderWidth: 1 },
                                writtenCommunication && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white, backgroundColor: currentTheme === 'light' ? Colors.secondary : Colors.gray500, borderWidth: 2 }
                            ]}
                            onPress={() => setWrittenCommunication(v => !v)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Toggle Written Communication Accessibility"
                            accessibilityHint="Press to indicate if you prefer written communication with the driver"
                            accessibilityState={{ checked: writtenCommunication }}
                        >
                            <Ionicons name="chatbox-ellipses" size={22} color={Colors.blue} />
                            <Text style={[styles.toggleLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                Written Communication
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: Colors.info, fontSize: 14, marginTop: 4, fontWeight: '500' }}>
                        NOTE: Make sure you have configured your accessibility preferences on your profile. These preferences will be shared with the driver for a better experience.
                    </Text>


                    <View style={{ width: '100%' }}>
                        <Text
                            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                            accessibilityRole="text"
                            accessibilityLabel="Additional Instructions Label"
                        >
                            Additional Instructions
                        </Text>
                        <Text
                            style={{ color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300, fontSize: 13, marginBottom: 8 }}
                            accessibilityRole="text"
                            accessibilityLabel="Additional Instructions Hint"
                            accessibilityHint="Enter any special instructions for the driver"
                        >
                            Optional notes for the driver (e.g. "Call upon arrival", "Meet at the main entrance", etc.)
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
                        style={[styles.summaryCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800 }]}
                        accessibilityRole="summary"
                        accessibilityLabel="Trip Summary"
                    >
                        <Text style={[styles.summaryTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='text' accessibilityLabel='Ride Summary Title'>
                            Ride Summary
                        </Text>

                        <View style={styles.summaryRow}>
                            <Ionicons name="location" size={24} color={Colors.blue} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Pickup Location: ${pickup}`}>
                                From: {pickup}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="flag" size={24} color={Colors.blue} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Drop-off Location: ${dropoff}`}>
                                To: {dropoff}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="time" size={24} color={Colors.blue} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Ride Time: ${rideTimeType === 'immediate' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`}`}>
                                Ride time: {rideTimeType === 'immediate' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color={ramp ? Colors.blue : Colors.gray700} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Ramp/Lift Accessibility: ${ramp ? 'Yes' : 'No'}`}>
                                Ramp: {ramp ? '✅' : '❌'}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <FontAwesome5 name="walking" size={24} color={assistiveDevice ? Colors.blue : Colors.gray700} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Assistive Device Accessibility: ${assistiveDevice ? 'Yes' : 'No'}`}>
                                Assistive Device: {assistiveDevice ? '✅' : '❌'}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="hand-peace" size={24} color={signLanguage ? Colors.blue : Colors.gray700} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Sign Language Accessibility: ${signLanguage ? 'Yes' : 'No'}`}>
                                Sign Language: {signLanguage ? '✅' : '❌'}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Ionicons name="chatbox-ellipses" size={24} color={writtenCommunication ? Colors.blue : Colors.gray700} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={` Written Communication Accessibility: ${writtenCommunication ? 'Yes' : 'No'}`}>
                                Written Communication: {writtenCommunication ? '✅' : '❌'}
                            </Text>
                        </View>

                        {
                            instructions &&
                            <View style={styles.summaryRow}>
                                <Ionicons name="chatbox-ellipses" size={24} color={Colors.secondary} />
                                <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                    Notes:
                                    <Text style={{ fontStyle: 'italic', color: Colors.gray700 }}>
                                        {' '}
                                        {instructions}
                                    </Text>
                                </Text>
                            </View>}
                    </View>

                    {/* Primary Action Button */}
                    <CustomButton
                        title="Request with "
                        handlePress={handleAceMobilityRequest}
                        containerStyle={{ marginTop: 18, backgroundColor: Colors.orange, width: '100%' }}
                        textStyle={{ color: Colors.white, fontWeight: 'bold' }}
                        disabled={!pickup || !dropoff}
                        trailing={true}
                        trailingImage={images.aceLogo}
                    />

                    {/* Secondary Action Button */}
                    <CustomButton
                        title="📲 Request via WhatsApp"
                        handlePress={handleWhatsAppRequest}
                        containerStyle={{ marginTop: 12, backgroundColor: Colors.green, width: '100%' }}
                        textStyle={{ color: Colors.white, fontWeight: 'bold' }}
                        disabled={!pickup || !dropoff}
                    />

                    <CustomButton
                        title="📲 Request via SMS"
                        handlePress={handleSmsRequest}
                        containerStyle={{ marginTop: 12, backgroundColor: Colors.blue, width: '100%' }}
                        textStyle={{ color: Colors.white, fontWeight: 'bold' }}
                        disabled={!pickup || !dropoff}
                    />

                    {/* Emergency Contact Option */}
                    <TouchableOpacity
                        style={styles.sosRow}
                        onPress={() =>
                            Alert.alert(
                                'Emergency Ride Assistance',
                                'If you need immediate assistance, please call our emergency hotline. Our team is here to help you with urgent ride requests.',
                                [
                                    {
                                        text: 'Call Now',
                                        onPress: () => Linking.openURL('tel:+254738218657'),
                                        style: 'default',
                                    },
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                ]
                            )
                        }
                        accessibilityRole='button'
                        accessibilityLabel='Emergency Ride Assistance'
                        accessibilityHint='Press to request emergency ride assistance'
                    >
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

                    {/* Location Search Modals */}
                    <LocationSearchModal
                        visible={isPickupModalVisible}
                        onClose={() => setPickupModalVisible(false)}
                        onSelect={(location) => handleLocationSelect(location, true)}
                        placeholder="Search for pickup location"
                        initialQuery={pickup}
                        title="Select Pickup Location"
                    />

                    <LocationSearchModal
                        visible={isDropoffModalVisible}
                        onClose={() => setDropoffModalVisible(false)}
                        onSelect={(location) => handleLocationSelect(location, false)}
                        placeholder="Search for drop-off location"
                        initialQuery={dropoff}
                        title="Select Drop-off Location"
                    />
                </BottomSheetScrollView>
            </BottomSheet>
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
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.yellow,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        width: '100%',
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.black,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 6,
        alignSelf: 'flex-start',
    },
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: Colors.white,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
    },
    activeTabText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    dateTimeContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    dateTimeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 2,
        borderRadius: 8,
        gap: 4,
    },
    dateTimeText: {
        fontSize: 14,
    },
    toggleRow: {
        flexDirection: 'row',
        marginVertical: 8,
        gap: 8,
        width: '100%',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    toggleOption: {
        width: '48%',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        borderWidth: 2,
    },
    toggleLabel: {
        fontSize: 13,
        marginTop: 4,
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
    },
    sosButton: {
        fontSize: 16,
        color: Colors.emergency,
        fontWeight: 'bold',
        marginTop: 2,
    },
})