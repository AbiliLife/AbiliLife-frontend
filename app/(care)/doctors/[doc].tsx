import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useThemeColor } from '@/components/Themed'

// Types
import { Doctor } from '@/types/doctor'

// Services
import { fetchDoctorById } from '@/services/doctorsService'

// Components
import { DoctorHeader } from '@/components/doctors/DoctorHeader'



const DocDetails = () => {
    // Get doctor ID from route params
    const { doc } = useLocalSearchParams();
    const doctorId = typeof doc === 'string' ? doc : Array.isArray(doc) ? doc[0] : null;


    // State to manage doctor data
    const [doctor, setDoctor] = React.useState<Doctor | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // State to manage accessibility drawer visibility
    const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = React.useState(false);

    // Theme colors
    const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');
    const cardBackgroundColor = useThemeColor({ light: '#fff', dark: '#333' }, 'background');

    // Fetch doctor data
    React.useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const doctorData = await fetchDoctorById(doctorId as string);
                if (doctorData) {
                    setDoctor(doctorData);
                }
            } catch (err) {
                setError('Failed to fetch doctor data');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId]);


    const toggleAccessibilityDrawer = () => {
        setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
    };

    // Get availability text
    const getAvailabilityText = () => {
        if (!doctor) return '';
        return typeof doctor.availability === 'string'
            ? doctor.availability
            : doctor.availability.text;
    };

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text style={{ fontSize: 16 }}>Loading doctor details...</Text>
            </SafeAreaView>
        );
    }

    // Error state
    if (error || !doctor) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="alert-circle-outline" size={64} color={primaryColor} />
                <Text style={{ fontSize: 16, color: 'red' }}>{error || 'Doctor not found'}</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ marginTop: 20, padding: 10, backgroundColor: primaryColor, borderRadius: 8 }}
                >
                    <Text style={{ color: 'white' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
            {/* Header Component */}
            <DoctorHeader doctor={doctor} primaryColor={primaryColor} />

            <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
                {/* Rating and Availability Section */}
                <View style={styles.ratingContainer}>
                    <View style={styles.ratingItem}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{doctor.rating}</Text>
                        <Text style={styles.reviewCount}>({doctor.reviewCount} reviews)</Text>
                    </View>
                    <View style={styles.availabilityItem}>
                        <Ionicons name="time-outline" size={16} color="#7135B1" />
                        <Text style={styles.availabilityText}>{getAvailabilityText()}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: primaryColor }]}>
                        <Ionicons name="calendar-outline" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Book</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                        <Ionicons name="call-outline" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' }]}>
                        <Ionicons name="videocam-outline" size={24} color="#374151" />
                        <Text style={[styles.actionButtonText, { color: '#374151' }]}>Video</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={[styles.sectionCard, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
                    <Text style={[styles.sectionText, { color: textColor }]}>{doctor.about}</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoColumn}>
                            <Text style={[styles.infoLabel, { color: textColor }]}>Experience</Text>
                            <Text style={[styles.infoValue, { color: textColor }]}>{doctor.experience}</Text>
                        </View>
                        <View style={styles.infoColumn}>
                            <Text style={[styles.infoLabel, { color: textColor }]}>Languages</Text>
                            <View>
                                {doctor.languages.map((language, index) => (
                                    <Text key={index} style={[styles.infoValue, { color: textColor }]}>
                                        {language}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.featuresContainer}>
                        {doctor.features.map((feature) => (
                            <View
                                key={feature.id}
                                style={[
                                    styles.featureBadge,
                                    { backgroundColor: feature.backgroundColor }
                                ]}
                            >
                                <Text style={[styles.featureText, { color: feature.color }]}>
                                    {feature.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Location Section */}
                <View style={[styles.sectionCard, { backgroundColor: cardBackgroundColor }]}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>Location</Text>
                        <TouchableOpacity>
                            <Ionicons name="navigate" size={20} color={primaryColor} />
                            <Text style={[styles.directionsText, { color: primaryColor }]}>Directions</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.locationText, { color: textColor }]}>
                        {doctor.location.name}, {doctor.location.address}
                    </Text>

                    {/* Map Placeholder */}
                    <View style={styles.mapContainer}>
                        <Text style={styles.mapText}>Map view not available</Text>
                    </View>
                </View>

                {/* Reviews Section */}
                <View style={[styles.sectionCard, { backgroundColor: cardBackgroundColor }]}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>Reviews</Text>
                        <TouchableOpacity>
                            <Text style={[styles.seeAllText, { color: primaryColor }]}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {doctor.reviews.map((review) => (
                        <View key={review.id} style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <Text style={[styles.reviewerName, { color: textColor }]}>{review.name}</Text>
                                <View style={styles.ratingStars}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.reviewRating}>{review.rating}</Text>
                                </View>
                            </View>
                            <Text style={[styles.reviewText, { color: textColor }]}>{review.text}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Appointment Button */}
            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity style={[styles.bottomButton, { backgroundColor: primaryColor }]}>
                    <Text style={styles.bottomButtonText}>Book Appointment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={toggleAccessibilityDrawer}
                >
                    <Ionicons name="accessibility-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

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

export default DocDetails

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
    // Rating and availability
    ratingContainer: {
        flexDirection: 'row',
        marginVertical: 16,
        alignItems: 'center',
    },
    ratingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    availabilityItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    availabilityText: {
        fontSize: 14,
        color: '#7135B1',
        marginLeft: 4,
    },
    // Action buttons
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    // Section cards
    sectionCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    // Info rows for about section
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    infoColumn: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#555',
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    featureBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 14,
    },
    // Location section
    directionsText: {
        fontSize: 14,
        fontWeight: '600',
    },
    locationText: {
        fontSize: 14,
        marginBottom: 12,
    },
    mapContainer: {
        height: 120,
        backgroundColor: '#FFFDE7',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapText: {
        fontSize: 14,
        color: '#666',
    },
    // Reviews section
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
    },
    reviewItem: {
        marginTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
    },
    ratingStars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewRating: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    reviewText: {
        fontSize: 14,
        lineHeight: 20,
    },
    // Bottom button
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 30,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 999,
    },
    bottomButton: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsButton: {
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
        bottom: 100, // Position just above the bottom button
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
