import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Doctor } from '@/types/doctor';

interface DoctorCardProps {
    doctor: Doctor;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
    // Theme colors
    const textColor = '#46216E'; // Example text color
    const cardBackgroundColor = '#FFFFFF'; // Example card background color
    
    // Handle different availability formats
    const availabilityText = typeof doctor.availability === 'string' 
        ? doctor.availability 
        : doctor.availability.text;
    
    return (
        <TouchableOpacity
            style={[styles.doctorCard, { backgroundColor: cardBackgroundColor }]}
            onPress={() => router.push({
                pathname: '/(care)/doctors/[doc]',
                params: { doc: doctor.id }
            })}
            accessible={true}
            accessibilityLabel={`Doctor ${doctor.name}, ${doctor.specialty}`}
            accessibilityHint="Tap to view doctor details"
        >
            <View style={styles.doctorInfo}>
                {/* Doctor Avatar */}
                <View style={styles.doctorAvatar}>
                    <Ionicons name="person" size={24} color='#F44336' />
                </View>

                {/* Doctor Details */}
                <View style={styles.doctorDetails}>
                    <Text style={[styles.doctorName, { color: textColor }]}>
                        {doctor.name}
                    </Text>
                    <Text style={styles.doctorSpecialty}>
                        {doctor.specialty} {doctor.distance ? `• ${doctor.distance}` : ''}
                    </Text>

                    {/* Rating and Availability */}
                    <View style={styles.ratingContainer}>
                        <View style={styles.rating}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{doctor.rating}</Text>
                        </View>
                        <View style={styles.availability}>
                            <Ionicons name="time-outline" size={16} color="#7135B1" />
                            <Text style={styles.availabilityText}>{availabilityText}</Text>
                        </View>
                    </View>

                    {/* Doctor Features */}
                    <View style={styles.featureContainer}>
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
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    doctorCard: {
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    doctorInfo: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    doctorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    doctorDetails: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    doctorSpecialty: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    availability: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    availabilityText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    featureContainer: {
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
});