import React from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/components/Themed';
import { router } from 'expo-router';

// Components
import SearchBar from '@/components/common/SearchBar';
import { DoctorCard } from '@/components/doctors/DoctorCard';

// Types
import { Doctor } from '@/types/doctor';

// Services
import { fetchDoctors } from '@/services/doctorsService';


// Interface for available healthcare services
interface ServiceCategory {
    id: string;
    title: string;
    icon: string;
    iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
    iconColor: string;
}

const servicesAvailble: ServiceCategory[] = [
    {
        id: 'specialist',
        title: 'Find Specialist',
        icon: 'search',
        iconType: 'ionicons',
        iconColor: '#9C27B0', // Purple color
    },
    {
        id: 'appointment',
        title: 'Book Appointment',
        icon: 'calendar-check',
        iconType: 'materialcommunity',
        iconColor: '#9C27B0', // Purple color
    },
    {
        id: 'telehealth',
        title: 'Telehealth Services',
        icon: 'videocam',
        iconType: 'ionicons',
        iconColor: '#9C27B0', // Purple color
    },
    {
        id: 'emergency',
        title: 'Emergency Assistance',
        icon: 'medkit',
        iconType: 'ionicons',
        iconColor: '#9C27B0', // Purple color
    },
    {
        id: 'health-records',
        title: 'Health Records',
        icon: 'folder',
        iconType: 'ionicons',
        iconColor: '#9C27B0', // Purple color
    },
    {
        id: 'clinics',
        title: 'Accessible Clinics',
        icon: 'hospital-building',
        iconType: 'materialcommunity',
        iconColor: '#9C27B0', // Purple color
    },
]


const HealthcareModule = () => {
    const colorScheme = useColorScheme();

    // State for doctors data
    const [availableDoctors, setAvailableDoctors] = React.useState<Doctor[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = React.useState(false);

    const toggleAccessibilityDrawer = () => {
        setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
    };

    // Theme colors
    const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');

    // Fetch available doctors on component mount
    React.useEffect(() => {
        const fetchDoctorsData = async () => {
            try {
                setLoading(true);
                const doctors = await fetchDoctors();
                setAvailableDoctors(doctors);
            } catch (err) {
                setError('Failed to load doctors data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorsData();
    }, []);

    // Function to render the appropriate icon for service categories
    const renderServiceIcon = (category: ServiceCategory) => {
        const { iconType, icon, iconColor } = category;

        switch (iconType) {
            case 'ionicons':
                return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={28} color={iconColor} />;
            case 'materialcommunity':
                return <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={28} color={iconColor} />;
            case 'fontawesome':
                return <FontAwesome5 name={icon as keyof typeof FontAwesome5.glyphMap} size={28} color={iconColor} />;
            default:
                return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={28} color={iconColor} />;
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                    <ChevronLeft size={32} color="white" />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="heart-outline" size={40} color="white" />
                    <View>
                        <Text style={[styles.headerTitle, { color: 'white' }]}>
                            AbiliLife Care
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: 'white' }]}>
                            Find and access healthcare services easily
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
                {/* Search Bar */}
                <SearchBar
                    placeholder="Search for services or doctors..."
                    value=""
                    onChangeText={() => { }}
                    onPress={() => { }}
                />

                {/* Services Available Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Services Available
                    </Text>
                </View>

                {/* Services Available Categories Grid */}
                <View style={styles.servicesGrid}>
                    {servicesAvailble.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.serviceCard, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}
                            onPress={() => console.log(`Selected service: ${category.title}`)}
                        >
                            <View style={styles.iconContainer}>
                                {renderServiceIcon(category)}
                            </View>
                            <Text style={[styles.serviceTitle, { color: textColor }]}>{category.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Available Doctors Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Available Doctors
                    </Text>
                </View>

                {/* Available Doctors List */}
                <View style={styles.doctorsContainer}>
                    {
                        loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={primaryColor} />
                                <Text style={{ marginTop: 8, color: textColor }}>Loading doctors...</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle-outline" size={48} color={primaryColor} />
                                <Text style={{ marginTop: 8, color: textColor }}>{error}</Text>
                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={() => fetchDoctors().then(setAvailableDoctors)}
                                >
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : availableDoctors.length === 0 ? (
                            <Text style={{ textAlign: 'center', marginTop: 20, color: textColor }}>
                                No doctors available at the moment
                            </Text>
                        ) : (
                            availableDoctors.map((doctor) => (
                                <DoctorCard
                                    key={doctor.id}
                                    doctor={doctor}
                                />
                            ))
                        )
                    }
                </View>

                {/* Upcoming Appointments Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Upcoming Appointments
                    </Text>
                </View>

            </ScrollView>

            {/* Accessibility Settings Button (fixed position) */}
            <TouchableOpacity
                style={styles.accessibilityButton}
                onPress={toggleAccessibilityDrawer}
                activeOpacity={0.9}
            >
                <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Accessibility Settings Button (fixed position) */}
            <TouchableOpacity
                style={styles.accessibilityButton}
                onPress={toggleAccessibilityDrawer}
                activeOpacity={0.9}
            >
                <Ionicons name="accessibility-outline" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Accessibility Drawer */}
            {accessibilityDrawerVisible && (
                <View style={styles.accessibilityDrawerOverlay}>
                    <Pressable
                        style={styles.accessibilityDrawerDismiss}
                        onPress={toggleAccessibilityDrawer}
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
            )}
        </SafeAreaView>
    )
}

export default HealthcareModule

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    headerContainer: {
        height: 150,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 50,
        paddingHorizontal: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        borderBottomColor: '#F44336', // Red color
        marginBottom: 16,
        backgroundColor: '#F44336', // Red color
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'white',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    serviceCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    serviceTitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    // Available Doctors Styles
    doctorsContainer: {
        backgroundColor: 'transparent',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#7135B1',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    // Accessibility Button Styles
    accessibilityButton: {
        position: 'absolute',
        bottom: 80, // Position above bottom tabs
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#7135B1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1000,
    },
    // Accessibility Drawer Styles
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
        bottom: 150, // Position above the accessibility button
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