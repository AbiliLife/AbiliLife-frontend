import React from 'react';
import { StyleSheet, Text, View } from 'react-native'

// Types
import { Doctor } from '@/types/doctor'

// Services
import { fetchDoctorById } from '@/services/doctorsService'

// Components
import { DoctorHeader } from '@/components/doctors/DoctorHeader'
import { useLocalSearchParams } from 'expo-router';



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

    return (
        <View>
            <Text>Doctor Details</Text>
        </View>
    )
}

export default DocDetails

const styles = StyleSheet.create({
    
})
