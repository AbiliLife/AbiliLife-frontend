import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Linking, TextInput, View, Text } from 'react-native';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Types - Location
import type { GeosearchResult } from '@/types/location';

// Location Services
import { getAddressFromCoordinates } from '@/services/locationService';

// Assets & Constants
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { images } from '@/constants/Images';

// Context & Store
import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';

// Components
import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';
import SelectableChip from '@/components/onboard/SelectableChip';
import LocationSearchModal from '@/components/location/LocationSearchModal';

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

const CaregiverBooking = () => {

    // Obtain context values
    const { currentTheme } = React.useContext(ThemeContext);
    const { user } = useOnboardingStore();

    // Bottom sheet
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '60%', '90%'], []);

    // Form State - Rider info
    const [riderName, setRiderName] = useState('');
    const [riderPhone, setRiderPhone] = useState('');
    const [disabilityType, setDisabilityType] = useState('Physical');
    const [mobilityEquipment, setMobilityEquipment] = useState('None');

    // Form State - Pickup/dropoff
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [rideTimeType, setRideTimeType] = useState<'immediate' | 'scheduled'>('immediate');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);

    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    // Location search modals
    const [isPickupModalVisible, setPickupModalVisible] = useState(false);
    const [isDropoffModalVisible, setDropoffModalVisible] = useState(false);

    // Accessibility preferences
    const [ramp, setRamp] = useState(user.accessibilityPreferences.mobility.needsRamp || false);
    const [assistiveDevice, setAssistiveDevice] = useState(user.accessibilityPreferences.mobility.needsAssistiveDevice || false);
    const [signLanguage, setSignLanguage] = useState(user.accessibilityPreferences.hearing.needsSignLanguage || false);
    const [writtenCommunication, setWrittenCommunication] = useState(user.accessibilityPreferences.hearing.needsWrittenCommunication || false);
    const [transferAssist, setTransferAssist] = useState(user.accessibilityPreferences.mobility.transferAssistance || false);
    const [notSure, setNotSure] = useState(false);

    // Caregiver info
    const [joining, setJoining] = useState(false);
    const [caregiverPhone, setCaregiverPhone] = useState('');
    const [instructions, setInstructions] = useState('');

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

    // WhatsApp message
    const handleWhatsAppRequest = () => {
        let rideTime = rideTimeType === 'immediate' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`;
        let needs = [];
        if (notSure) needs.push("I'm not sure");
        else {
            if (ramp) needs.push('Ramp');
            if (transferAssist) needs.push('Transfer Assistance');
            if (assistiveDevice) needs.push('Assistive Device');
            if (signLanguage) needs.push('Sign Language');
            if (writtenCommunication) needs.push('Written Communication');
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

    // SMS Deep Link
    const handleSmsRequest = () => {
        let rideTime = rideTimeType === 'immediate' ? 'As soon as possible' : `${scheduledDate} at ${scheduledTime}`;
        let needs = [];
        if (notSure) needs.push("I'm not sure");
        else {
            if (ramp) needs.push('Ramp');
            if (transferAssist) needs.push('Transfer Assistance');
            if (assistiveDevice) needs.push('Assistive Device');
            if (signLanguage) needs.push('Sign Language');
            if (writtenCommunication) needs.push('Written Communication');
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
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={32} color={Colors.emergency} />
                        <Text style={styles.infoText}>
                            WE ARE WORKING ON OUR GOOGLE MAPS PLATFORM INTEGRATION. IN THE MEANTIME, PLEASE REQUEST YOUR RIDE VIA WHATSAPP OR SMS.
                        </Text>
                    </View>
                    {/* Rider Info */}
                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
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
                        accessibilityLabel="Disability Type"
                    >
                        Disability Type
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {disabilityTypes.map(type => (
                            <SelectableChip
                                key={type}
                                label={type}
                                selected={disabilityType === type}
                                onPress={() => setDisabilityType(type)}
                            />
                        ))}
                    </View>

                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Mobility Equipment Label"
                    >
                        Mobility Equipment (if any)
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {mobilityEquipments.map(eq => (
                            <SelectableChip
                                key={eq}
                                label={eq}
                                selected={mobilityEquipment === eq}
                                onPress={() => setMobilityEquipment(eq)}
                            />
                        ))}
                    </View>

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
                            <MaterialCommunityIcons name="wheelchair-accessibility" size={22} color={currentTheme === 'light' ? Colors.black : Colors.white} />
                            <Text style={[styles.toggleLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
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
                            <MaterialCommunityIcons name="wheelchair-accessibility" size={22} color={currentTheme === 'light' ? Colors.black : Colors.white} />
                            <Text style={[styles.toggleLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
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
                            <FontAwesome5 name="walking" size={20} color={currentTheme === 'light' ? Colors.black : Colors.white} />
                            <Text style={[styles.toggleLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
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
                            <MaterialCommunityIcons name="hand-peace" size={22} color={currentTheme === 'light' ? Colors.black : Colors.white} />
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
                            <Ionicons name="chatbox-ellipses" size={22} color={currentTheme === 'light' ? Colors.black : Colors.white} />
                            <Text style={[styles.toggleLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                Written Communication
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleOption,
                                { backgroundColor: currentTheme === 'light' ? Colors.gray300 : Colors.gray800, borderWidth: 1 },
                                notSure && { borderColor: currentTheme === 'light' ? Colors.secondary : Colors.white, backgroundColor: currentTheme === 'light' ? Colors.secondary : Colors.gray500, borderWidth: 2 }
                            ]}
                            onPress={() => setNotSure(v => !v)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Toggle Not Sure Accessibility"
                            accessibilityHint="Press to indicate if you are not sure about something"
                            accessibilityState={{ checked: notSure }}
                        >
                            <FontAwesome5 name="question-circle" size={22} color={currentTheme === 'light' ? Colors.black : Colors.white} />
                            <Text style={[styles.toggleLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                Not Sure
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: Colors.info, fontSize: 14, marginTop: 4, fontWeight: '500' }}>
                        NOTE: These preferences help us match you with the right driver and vehicle.
                    </Text>

                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Where should we pick them(him/her) up?"
                    >
                        Where should we pick them(him/her) up?
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
                                    title="Pickup"
                                    icon={true}
                                    iconName="location-outline"
                                    iconFamily="Ionicons"
                                    value={pickup}
                                    placeholder="Select pickup location"
                                    onChangeText={() => { }} // Disabled, handled by modal
                                    otherStyles={{ opacity: 1 }}
                                    accessibilityLabel="Pickup Location Input"
                                    accessibilityHint="Enter the location where the rider should be picked up"
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
                        accessibilityLabel="Where are they(him/her) going?"
                    >
                        Where are they(him/her) going?
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
                                title="Dropoff"
                                icon={true}
                                iconName="flag-outline"
                                iconFamily="Ionicons"
                                value={dropoff}
                                placeholder="Select drop-off location"
                                onChangeText={() => { }} // Disabled, handled by modal
                                accessibilityLabel="Drop-off Location Input"
                                accessibilityHint="Tap to search for drop-off location"
                            />
                        </View>
                    </TouchableOpacity>

                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="When would they(him/her) like to ride?"
                    >
                        When would they(him/her) like to ride?
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

                    {/* Caregiver Info */}
                    <Text
                        style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                        accessibilityRole="text"
                        accessibilityLabel="Are you accompanying them?"
                    >
                        Are you accompanying them?
                    </Text>
                    <View style={styles.radioRow}>
                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setJoining(true)}
                            accessible={true}
                            accessibilityRole="radio"
                            accessibilityHint="Select if you will be riding with the person"
                            accessibilityState={{ checked: joining }}
                        >
                            <View style={[styles.radioCircle, joining && { borderColor: Colors.secondary }]}>
                                {joining && <View style={[styles.radioDot, { backgroundColor: Colors.secondary }]} />}
                            </View>
                            <Text style={[styles.radioLabel, joining && { color: currentTheme === 'light' ? Colors.primary : Colors.white }, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Yes, I will ride with them'>
                                Yes, I will ride with them
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setJoining(false)}
                            accessible={true}
                            accessibilityRole="radio"
                            accessibilityHint="Select if you will not be riding with the person"
                            accessibilityState={{ checked: !joining }}
                        >
                            <View style={[styles.radioCircle, !joining && { borderColor: Colors.primary }]}>
                                {!joining && <View style={[styles.radioDot, { backgroundColor: Colors.primary }]} />}
                            </View>
                            <Text style={[styles.radioLabel, !joining && { color: currentTheme === 'light' ? Colors.primary : Colors.white }, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='No, I will NOT ride with them'>
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
                            style={[styles.label, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
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
                            style={[styles.instructionInput, { backgroundColor: currentTheme === 'light' ? Colors.gray300 : Colors.gray800, color: currentTheme === 'light' ? Colors.black : Colors.white }]}
                            accessibilityLabel="Special Instructions Input"
                            accessibilityHint="Enter any special instructions for the driver"
                        />
                    </View>

                    {/* Summary Preview Card */}
                    <View
                        style={[styles.summaryCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800 }]}
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
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Ride Time: ${rideTimeType === 'immediate' ? 'As Soon As Possible' : `${scheduledDate} at ${scheduledTime}`}`}>
                                Time: {rideTimeType === 'immediate' ? 'As Soon As Possible' : `${scheduledDate} at ${scheduledTime}`}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="tools" size={24} color={Colors.secondary} />
                            <Text style={[styles.summaryText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Accessibility Needs: ${notSure ? "I'm not sure" : [ramp && 'Ramp', assistiveDevice && 'Assistive Device', signLanguage && 'Sign Language'].filter(Boolean).join(', ') || 'None'}`}>
                                Needs: {notSure ? "I'm not sure" : [
                                    ramp && 'Ramp',
                                    transferAssist && 'Transfer Assistance',
                                    assistiveDevice && 'Assistive Device',
                                    signLanguage && 'Sign Language',
                                    writtenCommunication && 'Written Communication'
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
        backgroundColor: Colors.gray300,
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
        // color: Colors.accent,
        textAlign: 'center',
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
        // borderColor: Colors.accent,
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
})