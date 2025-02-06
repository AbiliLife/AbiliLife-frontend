import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Intro Screens
import Intro1 from './intro/Intro1';
import Intro2 from './intro/Intro2';
import Intro3 from './intro/Intro3';
import Intro4 from './intro/Intro4';

// Icons
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

const introScreens = [
    { key: '1', component: Intro1 },
    { key: '2', component: Intro2 },
    { key: '3', component: Intro3 },
    { key: '4', component: Intro4 },
];

const Intro = () => {
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handleSkip = () => {
        navigation.navigate('Main'); // Navigate to Main Screen (Home)
    };

    const handleNext = (index: number) => {
        if (index === 4) {
            handleSkip(); // Skip to Main Screen
        } else { // Scroll to Next Screen
            setCurrentIndex(index);
            flatListRef.current?.scrollToIndex({ index });
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleGetStarted = () => {
        navigation.navigate('Welcome'); // Navigate to the Welcome Screen
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Accessibility and Skip */}
            <View style={styles.header}>
                <View style={styles.accessibilityContainer}>
                    <Ionicons name="accessibility" size={28} />
                    <Text style={styles.accessibilityText}>Accessibility Menu</Text>
                </View>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={introScreens}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={({ item, index }) => (
                    <View style={styles.screenContainer}>
                        <item.component onNext={() => handleNext(index)} />
                    </View>
                )}
            />

            {/* Navigation Buttons */}
            {currentIndex < 3 && (
                <View style={styles.navigationContainer}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => handleNext(currentIndex + 1)}
                    >
                        <IconButton icon="arrow-right" size={28} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Pagination Dots */}
            {
                currentIndex === 3 ? (
                    // Get Started Button
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGetStarted}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.paginationContainer}>
                        {Array(4).fill(0).map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === currentIndex && styles.paginationDotActive
                                ]}
                            />
                        ))}
                    </View>

                )
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screenContainer: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    accessibilityContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    accessibilityText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666666',
    },
    skipText: {
        marginRight: 16,
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginBottom: 20,
        borderRadius: 25,
        padding: 8,
        width: 120,
        alignSelf: 'center',
    },
    navButton: {
        padding: 8,
        width: 40,
        alignItems: 'center',
    },
    navDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#DDDDDD',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DDDDDD',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#000000',
    },
    button: {
        backgroundColor: '#000000',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginHorizontal: 24,
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Intro;