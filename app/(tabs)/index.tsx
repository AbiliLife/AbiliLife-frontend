import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Alert, Platform, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';

// Assets & Constants
import Colors from '@/constants/Colors';

// Context & Store
import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';

// Beta Badge - for pilot mode
const BetaBadge = () => {
    return (
        <View style={styles.betaBadgeContainer}>
            <Text style={styles.betaBadgeText}>Pilot Mode - Early Access</Text>
        </View>
    );
};

export default function HomeScreen() {
    const router = useRouter();

    // Obtain Conttext values
    const { currentTheme } = useContext(ThemeContext);
    const { user: userProfile } = useOnboardingStore();

    // Calendar state with simple date handling
    const [selectedDate, setSelectedDate] = useState(() => new Date(2025, 6, 15)); // July 15, 2025
    const [calendarViewMode, setCalendarViewMode] = useState<'week' | 'month'>('week');

    // Mock appointments data with simple dates
    const [upcomingAppointments] = useState([
        {
            id: '1',
            title: 'Doctor Appointment',
            date: new Date(2025, 6, 16), // July 16, 2025
            time: '10:00 AM',
            type: 'healthcare',
            location: 'City Hospital'
        },
        {
            id: '2',
            title: 'Mobility Service',
            date: new Date(2025, 6, 18), // July 18, 2025
            time: '2:30 PM',
            type: 'mobility',
            location: 'Shopping Mall'
        }
    ]);

    // Helper function to get safe time-based greeting
    const getGreeting = () => {
        try {
            const hour = new Date().getHours();
            if (hour < 12) return 'Morning';
            if (hour < 18) return 'Afternoon';
            return 'Evening';
        } catch (error) {
            return 'Day'; // Fallback greeting
        }
    };

    // Helper function to safely format calendar month ID
    const getCalendarMonthId = () => {
        try {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        } catch (error) {
            return '2025-07'; // Fallback to July 2025
        }
    };

    // Helper function to format date as "Month Year"
    const formatMonthYear = (date: Date) => {
        try {
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
        } catch (error) {
            return 'July 2025';
        }
    };

    // Helper function to format date as "Mon DD"
    const formatMonthDay = (date: Date) => {
        try {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}`;
        } catch (error) {
            return 'Jul 15';
        }
    };
    const getProfileCompleteness = () => {
        let completeness = 0;
        const totalFields = 7;

        if (userProfile.fullName) completeness++;
        if (userProfile.email) completeness++;
        if (userProfile.phone) completeness++;
        if (userProfile.disabilityTypes.length > 0) completeness++;
        if (userProfile.careRelationships.length > 0) completeness++;
        if (userProfile.emergencyContacts.length > 0) completeness++;
        if (userProfile.onboardingCompleted) completeness++;

        return Math.round((completeness / totalFields) * 100);
    };

    // Quick actions
    const quickActions = [
        {
            id: 'mobility',
            title: 'Request a Ride',
            icon: 'car',
            iconType: 'ionicons' as const,
            color: Colors.primary,
            route: '/mobility',
        },
        {
            id: 'caregiver',
            title: 'Contact Caregiver',
            icon: 'people',
            iconType: 'ionicons' as const,
            color: Colors.secondary,
            action: () => handleContactCaregiver(),
        },
        {
            id: 'emergency',
            title: 'Emergency',
            icon: 'warning',
            iconType: 'ionicons' as const,
            color: Colors.error,
            action: () => handleEmergencyContact(),
        },
        {
            id: 'accessibility',
            title: 'Accessibility Settings',
            icon: 'settings',
            iconType: 'ionicons' as const,
            color: Colors.accent,
        },
    ];

    // Service categories
    const serviceCategories = [
        {
            id: 'mobility',
            title: 'AbiliLife Mobility',
            description: 'Accesible Transport Services',
            icon: 'car',
            iconType: 'ionicons' as const,
            color: Colors.blue,
            route: '/(mobility)/mobility',
        },
        {
            id: 'healthcare',
            title: 'AbiliLife Care',
            description: 'Accessible Healthcare Services',
            icon: 'heart',
            iconType: 'ionicons' as const,
            color: Colors.lightGray,
            route: '/healthcare',
        },
        {
            id: 'marketplace',
            title: 'AbiliLife Access',
            description: 'Assistive Tech',
            icon: 'shopping-cart',
            iconType: 'fontawesome' as const,
            color: Colors.lightGray,
            route: '/marketplace',
        },
    ];

    const handleContactCaregiver = () => {
        const primaryCaregiver = userProfile.careRelationships.find(rel => rel.isPrimary);
        if (primaryCaregiver) {
            Alert.alert(
                'Contact Caregiver',
                `Contact ${primaryCaregiver.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call', onPress: () => console.log(`Calling ${primaryCaregiver.phone}`) },
                    { text: 'Message', onPress: () => console.log(`Messaging ${primaryCaregiver.phone}`) },
                ]
            );
        } else {
            Alert.alert('No Primary Caregiver', 'Please add a primary caregiver in your profile settings.');
        }
    };

    const handleMessageCaregiver = () => {
        const primaryCaregiver = userProfile.careRelationships.find(rel => rel.isPrimary);
        if (primaryCaregiver) {
            Alert.alert(
                'Message Caregiver',
                `Message ${primaryCaregiver.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Message', onPress: () => Linking.openURL(`sms:${primaryCaregiver.phone}`) },
                ]
            );
        } else {
            Alert.alert('No Primary Caregiver', 'Please add a primary caregiver in your profile settings.');
        }
    }

    const handleEmergencyContact = () => {
        const primaryEmergencyContact = userProfile.emergencyContacts.find(contact => contact.isPrimary);
        if (primaryEmergencyContact) {
            Alert.alert(
                'Emergency Contact',
                `Contact ${primaryEmergencyContact.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call Now', onPress: () => Linking.openURL(`tel:${primaryEmergencyContact.phone}`) },
                ]
            );
        } else {
            Alert.alert('No Emergency Contact', 'Please add an emergency contact in your profile settings.');
        }
    };

    const renderIcon = (iconType: 'ionicons' | 'materialcommunity' | 'fontawesome', iconName: string, size: number, color: string) => {
        switch (iconType) {
            case 'ionicons':
                return <Ionicons name={iconName as any} size={size} color={color} />;
            case 'materialcommunity':
                return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
            case 'fontawesome':
                return <FontAwesome5 name={iconName as any} size={size} color={color} />;
            default:
                return <Ionicons name="help-outline" size={size} color={color} />;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }}>
            <Stack.Screen
                options={{
                    headerTitle: 'AbiliLife',
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: currentTheme === 'light' ? Colors.primary : Colors.white,
                    },
                    headerTintColor: currentTheme === 'light' ? Colors.primary : Colors.white,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
                    },
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.push('/notifications')}
                            style={styles.headerButton}
                            accessible={true}
                            accessibilityRole='button'
                            accessibilityLabel='Notifications'
                            accessibilityHint='View your notifications'
                        >
                            <Ionicons name="notifications-outline" size={24} color={currentTheme === 'light' ? Colors.primary : Colors.white} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <BetaBadge />
            <ScrollView
                style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
                showsVerticalScrollIndicator={false}
                accessible={true}
                accessibilityHint='Scroll through the home screen to explore features and services'
            >
                {/* Welcome Header */}
                <View style={[styles.welcomeHeader, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]} accessible={true} accessibilityLabel='Welcome Card Header'>
                    <View style={styles.welcomeContent}>
                        <View style={styles.profileSection}>
                            {userProfile.profilePicture ? (
                                <Image
                                    source={{ uri: userProfile.profilePicture }}
                                    style={styles.profileImage}
                                    accessible={true}
                                    accessibilityRole='image'
                                    accessibilityLabel={`Profile picture of ${userProfile.fullName || 'User'}`}
                                />
                            ) : (
                                <View style={styles.profilePlaceholder}>
                                    <Text style={styles.profilePlaceholderText} accessibilityRole='text' accessibilityLabel={userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}>
                                        {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.welcomeText}>
                                <Text style={[styles.greeting, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel={`Good ${getGreeting()}`}>
                                    Good {getGreeting()}
                                </Text>
                                <Text style={[styles.userName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={`Welcome ${userProfile.fullName || 'User'}`}>
                                    {userProfile.fullName || 'Welcome User'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/profile')}
                            style={styles.profileButton}
                            accessible={true}
                            accessibilityRole='button'
                            accessibilityLabel='View Profile'
                        >
                            <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Completeness */}
                    <View style={styles.completenessSection}>
                        <Text style={[styles.completenessLabel, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Profile Completeness'>
                            Profile Completeness
                        </Text>
                        <View style={styles.completenessContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[styles.progressFill, { width: `${getProfileCompleteness()}%` }]}
                                />
                            </View>
                            <Text style={[styles.completenessPercentage, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='text' accessibilityLabel={`Profile completeness is ${getProfileCompleteness()} percent`}>
                                {getProfileCompleteness()}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Setup & Tips */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel='Setup & Tips'>
                        Setup & Tips
                    </Text>

                    <TouchableOpacity
                        style={[styles.taskCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                        onPress={() => router.push('/profileSetup')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.taskIconContainer}>
                            <Ionicons name="person-add" size={32} color={Colors.blue} />
                        </View>
                        <View style={styles.taskTextContainer}>
                            <Text style={[styles.taskTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Profile Setup'>
                                Profile Setup
                            </Text>
                            <Text style={[styles.taskDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Complete your profile setup to enhance your experience'>
                                Complete your profile setup to enhance your experience.
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.taskCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                        disabled={true}
                    >
                        <View style={styles.taskIconContainer}>
                            <Ionicons name="bulb-outline" size={32} color={Colors.blue} />
                        </View>
                        <View style={styles.taskTextContainer}>
                            <Text style={[styles.taskTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Accessibility Features'>
                                Accessibility Features
                            </Text>
                            <Text style={[styles.taskDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Use the floating accessibility button to quickly adjust your display and interaction preferences from any screen'>
                                Use the floating accessibility button to quickly adjust your display
                                and interaction preferences from any screen. {`\n`}
                                Hold and drag to reposition the button as needed.
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.taskCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                        onPress={() => router.push('/bookingGuide')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.taskIconContainer}>
                            <Ionicons name="help-circle" size={32} color={Colors.blue} />
                        </View>
                        <View style={styles.taskTextContainer}>
                            <Text style={[styles.taskTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='How to Request a Ride'>
                                How to Request a Ride
                            </Text>
                            <Text style={[styles.taskDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Learn how to easily request a ride using our app'>
                                Learn how to easily request a ride using our app.
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.taskCard, styles.supportCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                        onPress={() => Linking.openURL('tel:+254742560540')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.taskIconContainer}>
                            <MaterialIcons name="support-agent" size={32} color={Colors.green} />
                        </View>
                        <View style={styles.taskTextContainer}>
                            <Text style={[styles.taskTitle, styles.supportTitle]}>Need Help?</Text>
                            <Text style={[styles.taskDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Get assistance with your account or app usage'>
                                Contact our support team to get assistance with your account or app usage.
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={Colors.green} />
                    </TouchableOpacity>

                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel='Quick Actions'>
                        Quick Actions
                    </Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={[styles.quickActionCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                                onPress={() => action.route ? router.push(action.route as any) : action.action?.()}
                                accessible={true}
                                accessibilityLabel={action.title}
                                accessibilityRole="button"
                            >
                                {renderIcon(action.iconType, action.icon, 24, action.color)}
                                <Text style={[styles.quickActionText, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                    {action.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Services */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel='Services'>
                            Services
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/services')} accessible={true} accessibilityRole='button' accessibilityLabel='See All Services'>
                            <Text style={[styles.seeAllText, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.servicesGrid}>
                        {serviceCategories.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                style={[styles.serviceCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                                onPress={() => router.push(service.route as any)}
                                accessible={true}
                                accessibilityRole="button"
                                accessibilityHint={`Go to ${service.title}`}
                                disabled={service.id === 'healthcare' || service.id === 'marketplace'} // Disable unavailable services
                            >
                                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
                                    {renderIcon(service.iconType, service.icon, 24, service.color)}
                                </View>
                                <Text style={[styles.serviceTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={service.title}>
                                    {service.title}
                                </Text>
                                <Text style={[styles.serviceDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel={service.description}>
                                    {service.description}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Care Network Status */}
                {(userProfile.careRelationships.length > 0 || userProfile.emergencyContacts.length > 0) && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel='Care Network'>
                            Care Network
                        </Text>
                        <View style={[styles.careNetworkCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                            {userProfile.careRelationships.length > 0 && userProfile.careRelationships.map((rel, idx) => (
                                <View
                                    key={rel.id || rel.name || idx}
                                    style={[
                                        styles.careContact,
                                        {
                                            borderBottomWidth:
                                                idx < userProfile.careRelationships.length - 1 ||
                                                    userProfile.emergencyContacts.length > 0
                                                    ? 1
                                                    : 0,
                                        },
                                    ]}
                                    accessible={true}
                                    accessibilityLabel={`Caregiver Card: ${rel.name}`}
                                >
                                    <View style={styles.careContactInfo}>
                                        <Ionicons name="people" size={20} color={Colors.secondary} />
                                        <View style={styles.careContactText}>
                                            <Text
                                                style={[
                                                    styles.careContactName,
                                                    { color: currentTheme === 'light' ? Colors.black : Colors.white },
                                                ]}
                                                accessibilityRole="text"
                                                accessibilityLabel={`Caregiver: ${rel.name}`}
                                            >
                                                {rel.name}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.careContactRole,
                                                    { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray },
                                                ]}
                                                accessibilityRole="text"
                                                accessibilityLabel={rel.isPrimary ? 'Primary Caregiver' : 'Caregiver'}
                                            >
                                                {rel.isPrimary ? 'Primary Caregiver' : 'Caregiver'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.careContactActions}>
                                        <TouchableOpacity
                                            style={styles.careContactButton}
                                            onPress={handleContactCaregiver}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Call ${rel.name}`}
                                        >
                                            <Ionicons name="call" size={18} color={Colors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.careContactButton}
                                            onPress={handleMessageCaregiver}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Message ${rel.name}`}
                                        >
                                            <Ionicons name="chatbubble" size={18} color={Colors.secondary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            {userProfile.emergencyContacts.find(contact => contact.isPrimary) && (
                                <View style={[styles.careContact, { borderBottomWidth: userProfile.careRelationships.length > 1 ? 1 : 0 }]} accessible={true} accessibilityLabel='Emergency Contact Card'>
                                    <View style={styles.careContactInfo}>
                                        <Ionicons name="warning" size={24} color={Colors.error} />
                                        <View style={styles.careContactText}>
                                            <Text style={[styles.careContactName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={`Emergency Contact: ${userProfile.emergencyContacts.find(contact => contact.isPrimary)?.name}`}>
                                                {userProfile.emergencyContacts.find(contact => contact.isPrimary)?.name}
                                            </Text>
                                            <Text style={[styles.careContactRole, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Emergency Contact'>
                                                Emergency Contact
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyContact} accessible={true} accessibilityRole='button' accessibilityHint='Call emergency contact'>
                                        <Ionicons name="call" size={18} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                )}



                {/* Calendar & Appointments */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                            Upcoming Appointments
                        </Text>
                        <TouchableOpacity
                            onPress={() => setCalendarViewMode(calendarViewMode === 'week' ? 'month' : 'week')}
                            style={styles.viewToggle}
                        >
                            <Text style={[styles.viewToggleText, { color: Colors.primary }]}>
                                {calendarViewMode === 'week' ? 'Month' : 'Week'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.calendarContainer, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                        <View style={styles.calendarHeader}>
                            <Text style={[styles.calendarTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                {formatMonthYear(new Date())}
                            </Text>
                        </View>

                        <View style={styles.simplifiedCalendar}>
                            <Text style={[styles.calendarPlaceholder, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                                📅 Calendar View
                            </Text>
                            <Text style={[styles.calendarNote, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                                Interactive calendar coming soon
                            </Text>
                        </View>
                    </View>

                    {/* Upcoming Appointments List */}
                    {/* <View style={styles.appointmentsList}>
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((appointment) => (
                                <View
                                    key={appointment.id}
                                    style={[styles.appointmentCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}
                                >
                                    <View style={styles.appointmentInfo}>
                                        <Text style={[styles.appointmentTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                                            {appointment.title}
                                        </Text>
                                        <Text style={[styles.appointmentDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                                            {formatMonthDay(appointment.date)} • {appointment.time}
                                        </Text>
                                        <Text style={[styles.appointmentLocation, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                                            📍 {appointment.location}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name={appointment.type === 'healthcare' ? 'medical' : 'car'}
                                        size={24}
                                        color={appointment.type === 'healthcare' ? Colors.error : Colors.primary}
                                    />
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyAppointments}>
                                <Ionicons name="calendar-outline" size={48} color={Colors.lightGray} />
                                <Text style={[styles.emptyAppointmentsText, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                                    No upcoming appointments
                                </Text>
                            </View>
                        )}

                        <CustomButton
                            title="Add Appointment"
                            handlePress={() => console.log('Add appointment')}
                            containerStyle={styles.addAppointmentButton}
                            leadingIconName="add"
                            leading
                        />
                    </View> */}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Welcome Message Card Styles
    welcomeCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
    },
    // Tutorial Card Styles
    tutorialCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
    },
    tutorialHeader: {
        padding: 16,
        backgroundColor: Colors.secondary,
    },
    tutorialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.white
    },
    tutorialDescription: {
        fontSize: 14,
        opacity: 0.9,
        marginBottom: 16,
        color: Colors.white
    },
    tutorialFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    tutorialTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tutorialTimeText: {
        marginLeft: 8,
        fontSize: 16,
    },
    startButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    headerButton: {
        padding: 10,
    },
    welcomeHeader: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    welcomeContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    profilePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    profilePlaceholderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
    },
    welcomeText: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: Colors.accent,
        marginBottom: 4,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
    },
    profileButton: {
        padding: 8,
    },
    completenessSection: {
        marginTop: 8,
    },
    completenessLabel: {
        fontSize: 14,
        color: Colors.accent,
        marginBottom: 8,
    },
    completenessContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: Colors.lightGray,
        borderRadius: 4,
        marginRight: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    completenessPercentage: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    section: {
        marginBottom: 24,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 12,
    },
    quickActionCard: {
        width: '48%',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.black,
        marginTop: 8,
        textAlign: 'center',
    },
    viewToggle: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: `${Colors.primary}20`,
    },
    viewToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    calendarContainer: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    calendarHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    simplifiedCalendar: {
        alignItems: 'center',
        padding: 32,
    },
    calendarPlaceholder: {
        fontSize: 24,
        marginBottom: 8,
    },
    calendarNote: {
        fontSize: 14,
        color: Colors.accent,
    },
    appointmentsList: {
        gap: 12,
    },
    appointmentCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    appointmentInfo: {
        flex: 1,
    },
    appointmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 4,
    },
    appointmentDetails: {
        fontSize: 14,
        color: Colors.accent,
        marginBottom: 2,
    },
    appointmentLocation: {
        fontSize: 12,
        color: Colors.accent,
    },
    emptyAppointments: {
        alignItems: 'center',
        padding: 32,
    },
    emptyAppointmentsText: {
        fontSize: 16,
        color: Colors.accent,
        marginTop: 8,
    },
    addAppointmentButton: {
        marginTop: 8,
    },
    careNetworkCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    careContact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    careContactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    careContactText: {
        marginLeft: 12,
        flex: 1,
    },
    careContactName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 2,
    },
    careContactRole: {
        fontSize: 14,
        color: Colors.accent,
    },
    careContactActions: {
        flexDirection: 'row',
        gap: 8,
    },
    careContactButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: `${Colors.primary}20`,
    },
    emergencyButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: Colors.error,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    serviceCard: {
        width: '48%',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        minHeight: 120,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    serviceIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.black,
        textAlign: 'center',
        marginBottom: 4,
    },
    serviceDescription: {
        fontSize: 12,
        color: Colors.accent,
        textAlign: 'center',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },

    betaBadgeContainer: {
        alignSelf: 'center',
        backgroundColor: Colors.orange,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginVertical: 10,
    },
    betaBadgeText: {
        color: Colors.white,
        fontWeight: 'bold',
    },

    tasksHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    supportCard: {
        borderWidth: 1,
        borderColor: Colors.green,
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        marginTop: 10,
    },

    supportIconContainer: {
        backgroundColor: Colors.green,
    },
    supportTitle: {
        color: Colors.green,
        fontWeight: '700',
    },
    supportDescription: {
        fontSize: 14,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    taskTextContainer: {
        flex: 1,
        marginLeft: 16,
        backgroundColor: 'transparent',
    },
    taskIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    taskDescription: {
        fontSize: 13,
        opacity: 0.7,
    },

})
