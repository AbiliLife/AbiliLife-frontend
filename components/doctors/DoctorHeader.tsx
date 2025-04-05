import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Doctor } from '@/types/doctor';

interface DoctorHeaderProps {
    doctor: Doctor;
    primaryColor: string;
}

export const DoctorHeader = ({ doctor, primaryColor }: DoctorHeaderProps) => {
    return (
        <View style={[styles.headerContainer, { backgroundColor: primaryColor }]}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="person-circle-outline" size={48} color="white" />
                <View>
                    <Text style={[styles.headerTitle, { color: 'white' }]}>{doctor.name}</Text>
                    <Text style={[styles.headerSubtitle, { color: 'white' }]}>
                        {doctor.specialty}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 16,
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
});