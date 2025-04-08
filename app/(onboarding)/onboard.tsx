import React, { useRef, useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Text, View, useThemeColor } from '@/components/Themed';
import OnboardingDots from '@/components/onboard/OnboardingDots';
import OnboardingSlide from '@/components/onboard/OnboardingSlide';
import CustomButton from '@/components/common/CustomButton';

import { onboardingData } from '@/constants/Onboard';
import { SafeAreaView } from 'react-native-safe-area-context';

// const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const cardBg = useThemeColor({ light: 'rgba(194, 195, 203, 0.5)', dark: '#1E1E1E' }, 'background');


    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/');
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
        }
    };

    const handleSkip = () => {
        flatListRef.current?.scrollToIndex({ index: onboardingData.length - 1 });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
            {
                currentIndex !== onboardingData.length - 1 && (
                    <View style={styles.skipContainer}>
                        <TouchableOpacity onPress={handleSkip}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            <FlatList
                data={onboardingData}
                renderItem={({ item }) => <OnboardingSlide item={item} />}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                ref={flatListRef}
            />

            <View style={styles.bottomContainer}>
                <OnboardingDots
                    currentIndex={currentIndex}
                    totalSlides={onboardingData.length}
                />

                {
                    currentIndex === onboardingData.length - 1 ? (
                        <CustomButton
                            title="Get Started"
                            handlePress={() => router.replace('/(auth)/register')}
                            containerStyle={{
                                backgroundColor: primaryColor,
                                paddingVertical: 15,
                                marginTop: 30,
                                width: 200,
                            }}
                            textStyle={{ color: '#fff', fontSize: 16 }}
                        />
                    ) : (
                        <View style={[styles.navigationContainer, { backgroundColor: cardBg }]}>
                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={handlePrev}
                                disabled={currentIndex === 0}
                            >
                                <Ionicons
                                    name="arrow-back-outline"
                                    size={24}
                                    color={currentIndex === 0 ? "#C2C3CB" : "#1E1E1E"}
                                />
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={handleNext}
                            >
                                <Ionicons name="arrow-forward-outline" size={24} color="#1E1E1E" />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipContainer: {
        marginTop: 20,
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    skipText: {
        fontSize: 16,
        // color: '#FFFFFF',
        fontWeight: '500',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    navigationContainer: {
        flexDirection: 'row',
        borderRadius: 30,
        marginTop: 30,
        height: 50,
        width: 110,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    navButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#333333',
    },
});