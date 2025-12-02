import React, { useContext } from 'react';
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

// Assets & Constants
import Colors from '@/constants/Colors';

// Context & Store
import { ThemeContext } from '@/contexts/ThemeContext';

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
        description: 'Accessible healthcare services (upcoming beta)',
        icon: 'heart-outline',
        iconType: 'ionicons',
        iconColor: Colors.red, // Red color
        path: '/healthcare',
    },
    {
        id: 'assistiveTech',
        title: "AbiliLife Access",
        description: 'Assistive Tech Marketplace (upcoming beta)',
        icon: 'shopping-cart',
        iconType: 'fontawesome',
        iconColor: Colors.orange, // Orange color
    },
    {
        id: 'jobs',
        title: 'AbiliLife Work',
        description: 'Employment & Financial Inclusion (Our Promise)',
        icon: 'briefcase-outline',
        iconType: 'materialcommunity',
        iconColor: Colors.gray300, // Light Gray color
        // Note: This path is currently not implemented
        path: '/employment',
    },
    {
        id: 'education',
        title: 'AbiliLife Learn',
        description: 'Inclusive Education & Skills Training (Our Promise)',
        icon: 'book',
        iconType: 'ionicons',
        iconColor: Colors.gray300, // Light Gray color
        // Note: This path is currently not implemented
        path: '/education',
    },
    {
        id: 'insurance',
        title: 'AbiliLife Insurance',
        description: 'Insurance & Financial Support (Our Promise)',
        icon: 'shield',
        iconType: 'materialcommunity',
        iconColor: Colors.gray300, // Light Gray color
        // Note: This path is currently not implemented
        path: '/insurance',
    },
]

// Beta Badge - for pilot mode
const BetaBadge = () => {
    return (
        <View style={styles.betaBadgeContainer}>
            <Text style={styles.betaBadgeText}>Pilot Mode - Early Access</Text>
        </View>
    );
};

export default function ServicesScreen() {
    const router = useRouter();

    // Obtain Context values
    const { currentTheme } = useContext(ThemeContext);


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
        <View style={{ flex: 1, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }}>
            <Stack.Screen
                options={{
                    headerTitle: 'AbiliLife Services',
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: currentTheme === 'light' ? Colors.primary : Colors.white,
                    },
                    headerSearchBarOptions: {
                        placeholder: 'Search services...',
                    },
                    headerTintColor: currentTheme === 'light' ? Colors.primary : Colors.white,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
                    }
                }}
            />
            <BetaBadge />
            <ScrollView
                style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
                showsVerticalScrollIndicator={false}
                accessible={true}
                accessibilityHint="Scroll through to explore all services"
            >
                <Text style={{ fontSize: 14, marginVertical: 16, color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300 }}>
                    We are dedicated to providing accessible services for all. Abililife has 5 main service categories, each designed to enhance the quality of life for individuals with disabilities.
                    {`\n`}{`\n`}
                    Explore our offerings below:
                </Text>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel='Our Main Service (Ongoing Beta)'>
                        Our Main Service (Ongoing Beta)
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.newServiceCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800 }]}
                    onPress={() => router.push('/mobility')}
                    activeOpacity={0.5}
                    accessibilityRole='button'
                    accessibilityLabel='AbiliLife Mobility Service'
                    accessibilityHint='Touch to open the AbiliLife Mobility service module'
                >
                    <View style={styles.newIconContainer}>
                        <FontAwesome5 name="wheelchair" size={30} color={Colors.blue} />
                    </View>
                    <View style={styles.newCardContent}>
                        <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                            AbiliLife Mobility
                        </Text>
                        <Text style={{ fontSize: 14, color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300, marginTop: 4 }}>
                            Book a private ride, schedule a trip, or request a ride for someone else. See Public Transport options in your area.
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
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
                            style={[styles.serviceCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800 }]}
                            onPress={() => item.path && router.push(item.path)}
                            activeOpacity={0.5}
                            disabled
                        >
                            <View style={{ marginBottom: 8 }}>
                                {renderServiceIcon(item)}
                            </View>
                            <Text style={[styles.serviceTitle, { textAlign: 'center', color: (item.title !== 'AbiliLife Care' && item.title !== 'AbiliLife Access') ? Colors.gray500 : (currentTheme === 'light' ? Colors.primary : Colors.white) }]}>
                                {item.title}
                            </Text>
                            {item.description && (
                                <Text style={[styles.serviceTitle, { fontSize: 12, color: (item.title !== 'AbiliLife Care' && item.title !== 'AbiliLife Access') ? Colors.gray500 : (currentTheme === 'light' ? Colors.secondary : Colors.gray300), marginTop: 4, textAlign: 'center' }]}>
                                    {item.description}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300, marginTop: 20 }}>
                            No services available at the moment.
                        </Text>
                    }
                    scrollEnabled={false} // Disable scrolling to keep the layout fixed
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
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
        shadowColor: Colors.gray800,
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
        shadowColor: Colors.gray800,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    newIconContainer: {
        marginRight: 16,
        backgroundColor: Colors.transparent,
    },
    newCardContent: {
        flex: 1,
        backgroundColor: Colors.transparent,
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
});