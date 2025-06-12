import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text,  TouchableOpacity, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import OnboardingDots from '@/components/onboard/OnboardingDots';
import OnboardingSlide from '@/components/onboard/OnboardingSlide';
import CustomButton from '@/components/common/CustomButton';

import { onboardingData } from '@/constants/Onboard';
import { SafeAreaView } from 'react-native-safe-area-context';

// const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = React.useState(false);
    
      const toggleAccessibilityDrawer = () => {
        setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
      };

    const primaryColor = '#7135B1'; // Example primary color
    const backgroundColor = '#F5F5F5'; // Example background color
    const cardBg = 'rgba(194, 195, 203, 0.5)'; // Example card background color


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
});