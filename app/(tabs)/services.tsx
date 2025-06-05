import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    FlatList,
    ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { useAccessibility } from '@/contexts/AccessibilityContext';

import AccessibilityOption from '@/components/accessibility/AccessibilityOption';
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';

// Interface for service categories
interface ServiceCategory {
    id: string;
    title: string;
    description?: string;
    icon: string;
    iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
    iconColor: string;
    path?: '/healthcare' | '/insurance' | '/education' | '/employment';
}

const allServices: ServiceCategory[] = [
    {
        id: 'healthcare',
        title: 'AbiliLife Care',
        description: 'Accessible healthcare services (currently in beta)',
        icon: 'heart-outline',
        iconType: 'ionicons',
        iconColor: '#F44336', // Red color
        path: '/healthcare',
    },
    {
        id: 'assistiveTech',
        title: "AbiliLife Access",
        description: 'Assistive Tech Marketplace (currently in beta)',
        icon: 'shopping-cart',
        iconType: 'fontawesome',
        iconColor: '#FF9800', // Orange color
    },
    {
        id: 'jobs',
        title: 'AbiliLife Work',
        description: 'Employment & Financial Inclusion (Our Promise)',
        icon: 'briefcase-outline',
        iconType: 'materialcommunity',
        iconColor: '#9E9E9E', // Grey color
        // Note: This path is currently not implemented
        path: '/employment',
    },
    {
        id: 'education',
        title: 'AbiliLife Learn',
        description: 'Inclusive Education & Skills Training (Our Promise)',
        icon: 'book',
        iconType: 'ionicons',
        iconColor: '#9E9E9E', // Grey color
        // Note: This path is currently not implemented
        path: '/education',
    },
    {
        id: 'insurance',
        title: 'AbiliLife Insurance',
        description: 'Insurance & Financial Support (Our Promise)',
        icon: 'shield',
        iconType: 'materialcommunity',
        iconColor: '#9E9E9E', // Grey color
        // Note: This path is currently not implemented
        path: '/insurance',
    },
]

export default function ServicesScreen() {
    const router = useRouter();

    const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();


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
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'AbiliLife Services',
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#7135B1',
                    },
                    headerSearchBarOptions: {
                        placeholder: 'Search services...',
                    },
                    headerTintColor: '#7135B1',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#F5F5F5',
                    }
                }}
            />

            <ScrollView style={styles.container}>
                <Text style={{ fontSize: 14, color: '', marginVertical: 16, }}>
                    AbiliLife is dedicated to enhancing the lives of individuals with disabilities through innovative and inclusive services.{'\n'}{'\n'}
                    Our services are designed to be accessible, affordable, and tailored to meet the unique needs of our community.
                </Text>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Our Main Service (Ongoing Beta)
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.newServiceCard}
                    onPress={() => router.push('/mobility')}
                    activeOpacity={0.5}
                >
                    <View style={styles.newIconContainer}>
                        <FontAwesome5 name="wheelchair" size={30} color="#2196F3" />
                    </View>
                    <View style={styles.newCardContent}>
                        <Text style={styles.serviceTitle}>AbiliLife Mobility</Text>
                        <Text style={{ fontSize: 14, color: '#999', marginTop: 4 }}>
                            Book a private ride, schedule a trip, or request a ride for someone else. See Public Transport options in your area.
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Other Services
                    </Text>
                </View>

                {/* Services Grid */}
                <FlatList
                    data={allServices}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.servicesGrid}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.serviceCard}
                            onPress={() => item.path && router.push(item.path)}
                            activeOpacity={0.5}
                            disabled={item.path !== '/healthcare'}
                        >
                            <View style={{ marginBottom: 8 }}>
                                {renderServiceIcon(item)}
                            </View>
                            <Text style={[styles.serviceTitle, { textAlign: 'center', color: (item.title !== 'AbiliLife Care' && item.title !== 'AbiliLife Access') ? '#999' : undefined }]}>
                                {item.title}
                            </Text>
                            {item.description && (
                                <Text style={[styles.serviceTitle, { fontSize: 12, color: (item.title !== 'AbiliLife Care' && item.title !== 'AbiliLife Access') ? '#999' : '#46216E', marginTop: 4, textAlign: 'center' }]}>
                                    {item.description}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: '#999' }}>
                            No services available at the moment.
                        </Text>
                    }
                    scrollEnabled={false} // Disable scrolling to keep the layout fixed
                />
            </ScrollView>
            
            {/* Accessibility Settings Button (fixed position) */}
            <AccessibilityOption
                handlePress={toggleAccessibilityDrawer}
            />

            {/* Accessibility Drawer */}
            {accessibilityDrawerVisible && (
                <AccessibilityDrawer
                    handlePress={toggleAccessibilityDrawer}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
    serviceTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    newServiceCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    newIconContainer: {
        marginRight: 16,
        backgroundColor: 'transparent',
    },
    newCardContent: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});