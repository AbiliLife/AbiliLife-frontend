import React from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { router } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';

// Components
import SearchBar from '@/components/common/SearchBar';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import ModuleHeader from '@/components/common/ModuleHeader';

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
        iconColor: '#F44336', // Red color
    },
    {
        id: 'appointment',
        title: 'Book Appointment',
        icon: 'calendar-check',
        iconType: 'materialcommunity',
        iconColor: '#F44336', // Red color
    },
    {
        id: 'telehealth',
        title: 'Telehealth Services',
        icon: 'videocam',
        iconType: 'ionicons',
        iconColor: '#F44336', // Red color
    },
    {
        id: 'emergency',
        title: 'Emergency Assistance',
        icon: 'medkit',
        iconType: 'ionicons',
        iconColor: '#F44336', // Red color
    },
    {
        id: 'health-records',
        title: 'Health Records',
        icon: 'folder',
        iconType: 'ionicons',
        iconColor: '#F44336', // Red color
    },
    {
        id: 'clinics',
        title: 'Accessible Clinics',
        icon: 'hospital-building',
        iconType: 'materialcommunity',
        iconColor: '#F44336', // Red color
    },
]


const HealthcareModule = () => {

    // State for doctors data
    const [availableDoctors, setAvailableDoctors] = React.useState<Doctor[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

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
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <ModuleHeader
                title="AbiliLife Care"
                subtitle="Find and access healthcare services easily"
                onBackPress={() => router.back()}
                color={Colors.red}
                iconName='heart-outline'
            />

            <ScrollView contentContainerStyle={styles.container}>
                {/* Search Bar */}
                <SearchBar
                    placeholder="Search for services or doctors..."
                    value=""
                    onChangeText={() => { }}
                    onPress={() => { }}
                />

                {/* Services Available Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: '' }]}>
                        Services Available
                    </Text>
                </View>

                {/* Services Available Categories Grid */}
                <View style={styles.servicesGrid}>
                    {servicesAvailble.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.serviceCard, { backgroundColor: '#fff' }]}
                            onPress={() => console.log(`Selected service: ${category.title}`)}
                        >
                            <View style={styles.iconContainer}>
                                {renderServiceIcon(category)}
                            </View>
                            <Text style={[styles.serviceTitle, { color: '' }]}>{category.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Available Doctors Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: '' }]}>
                        Available Doctors
                    </Text>
                </View>

                {/* Available Doctors List */}
                <View style={styles.doctorsContainer}>
                    {
                        loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color='#F44336' />
                                <Text style={{ marginTop: 8, color: '' }}>Loading doctors...</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle-outline" size={48} color='#F44336' />
                                <Text style={{ marginTop: 8, color: '' }}>{error}</Text>
                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={() => fetchDoctors().then(setAvailableDoctors)}
                                >
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : availableDoctors.length === 0 ? (
                            <Text style={{ textAlign: 'center', marginTop: 20, color: '' }}>
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
                    <Text style={[styles.sectionTitle, { color: '' }]}>
                        Upcoming Appointments
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default HealthcareModule

const styles = StyleSheet.create({
    container: {
        padding: 16,
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
})