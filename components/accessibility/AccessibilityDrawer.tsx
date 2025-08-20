import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Switch } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';

// Assets & Constants
import { X, Type, Contrast, Eye, Palette } from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Context
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { ThemeContext } from '@/contexts/ThemeContext';

// Components
import SelectableChip from '../onboard/SelectableChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Get screen width
const DRAWER_WIDTH = Math.min(320, SCREEN_WIDTH - 40);

interface AccessibilityDrawerProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function AccessibilityDrawer({ isVisible, onClose }: AccessibilityDrawerProps) {

    // Obtain context values
    const { state, setTextSize, toggleHighContrast, toggleScreenReader, setColorFilter } = useAccessibility();
    const { currentTheme } = React.useContext(ThemeContext);

    // Animation values
    const translateX = useSharedValue(DRAWER_WIDTH);
    const opacity = useSharedValue(0);

    // Animate drawer visibility
    React.useEffect(() => {
        if (isVisible) {
            opacity.value = withSpring(1, { damping: 20, stiffness: 300 });
            translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
        } else {
            opacity.value = withSpring(0, { damping: 20, stiffness: 300 });
            translateX.value = withSpring(DRAWER_WIDTH, { damping: 20, stiffness: 300 });
        }
    }, [isVisible]);

    const animatedBackdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedDrawerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const colorFilterOptions = [
        { label: 'None', value: 'none' as const },
        { label: 'Protanopia', value: 'protanopia' as const },
        { label: 'Deuteranopia', value: 'deuteranopia' as const },
        { label: 'Tritanopia', value: 'tritanopia' as const },
        { label: 'Monochrome', value: 'monochrome' as const },
    ];

    if (!isVisible) return null;

    return (
        <View style={styles.container} accessible={true}>
            <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            <Animated.View style={[styles.panel, animatedDrawerStyle]}>
                <BlurView intensity={95} style={[styles.blurContainer, { backgroundColor: currentTheme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }]}>
                    <View style={[styles.header, { borderBottomColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
                        <Text style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel='Accessibility'>
                            Accessibility
                        </Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]} accessibilityRole='button' accessibilityHint='Close'>
                            <X size={24} color={currentTheme === 'light' ? Colors.mediumGray : Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false} accessible={true} accessibilityHint='Scroll through accessibility options'>
                        {/* Text Size Control */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Type size={20} color={currentTheme === 'light' ? Colors.darkGray : Colors.lightGray} />
                                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.darkGray : Colors.lightGray }]} accessibilityRole='header' accessibilityLabel='Text Size'>
                                    Text Size
                                </Text>
                            </View>
                            <Text style={[styles.valueText, { color: currentTheme === 'light' ? Colors.primary : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel={`${Math.round(state.textSizeMultiplier * 100)}%`}>
                                {Math.round(state.textSizeMultiplier * 100)}%
                            </Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0.8}
                                maximumValue={2.0}
                                step={0.1}
                                value={state.textSizeMultiplier}
                                onValueChange={setTextSize}
                                minimumTrackTintColor={Colors.secondary}
                                maximumTrackTintColor={Colors.lightGray}
                                thumbTintColor={Colors.white}
                                accessible={true}
                                accessibilityRole='adjustable'
                                accessibilityHint='Adjust text size'
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={[styles.sliderLabel, { color: currentTheme === 'light' ? Colors.mediumGray : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Small'>
                                    Small
                                </Text>
                                <Text style={[styles.sliderLabel, { color: currentTheme === 'light' ? Colors.mediumGray : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Large'>
                                    Large
                                </Text>
                            </View>
                        </View>

                        {/* High Contrast Toggle */}
                        <View style={styles.section}>
                            <View style={styles.toggleRow}>
                                <View style={styles.toggleLeft}>
                                    <Contrast size={20} color={currentTheme === 'light' ? Colors.darkGray : Colors.lightGray} />
                                    <View style={styles.toggleTextContainer}>
                                        <Text style={[styles.toggleTitle, { color: currentTheme === 'light' ? Colors.darkGray : Colors.lightGray }]} accessibilityRole='header' accessibilityLabel='High Contrast'>
                                            High Contrast
                                        </Text>
                                        <Text style={[styles.toggleDescription, { color: currentTheme === 'light' ? Colors.mediumGray : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Increases contrast for better visibility'>
                                            Increases contrast for better visibility
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={state.highContrast}
                                    onValueChange={toggleHighContrast}
                                    trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                                    thumbColor={state.highContrast ? Colors.white : Colors.darkGray}
                                    ios_backgroundColor={Colors.lightGray}
                                    accessible={true}
                                    accessibilityRole='switch'
                                    accessibilityState={{ checked: state.highContrast }}
                                    accessibilityHint='Toggle high contrast mode'
                                />
                            </View>
                        </View>

                        {/* Screen Reader Enhancement */}
                        <View style={styles.section}>
                            <View style={styles.toggleRow}>
                                <Eye size={20} color={currentTheme === 'light' ? Colors.darkGray : Colors.lightGray} />
                                <View style={styles.toggleTextContainer}>
                                    <Text style={[styles.toggleTitle, { color: currentTheme === 'light' ? Colors.darkGray : Colors.lightGray }]} accessibilityRole='header' accessibilityLabel='Screen Reader Plus'>
                                        Screen Reader+
                                    </Text>
                                    <Text style={[styles.toggleDescription, { color: currentTheme === 'light' ? Colors.mediumGray : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Enhanced descriptions and navigation'>
                                        Enhanced descriptions and navigation
                                    </Text>
                                </View>
                                <Switch
                                    value={state.screenReaderEnhanced}
                                    onValueChange={toggleScreenReader}
                                    trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                                    thumbColor={state.screenReaderEnhanced ? Colors.white : Colors.darkGray}
                                    ios_backgroundColor={Colors.lightGray}
                                    accessible={true}
                                    accessibilityRole='switch'
                                    accessibilityState={{ checked: state.screenReaderEnhanced }}
                                    accessibilityHint='Toggle screen reader enhancements'
                                />
                            </View>
                        </View>

                        {/* Color Filter Options */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Palette size={20} color={currentTheme === 'light' ? Colors.darkGray : Colors.lightGray} />
                                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.darkGray : Colors.lightGray }]}>
                                    Color Filter
                                </Text>
                            </View>
                            <View style={styles.colorFilterGrid}>
                                {colorFilterOptions.map((option) => (
                                    <SelectableChip
                                        key={option.value}
                                        label={option.label}
                                        selected={state.colorFilter === option.value}
                                        onPress={() => setColorFilter(option.value)}
                                    />
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </BlurView>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'flex-end',
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    panel: {
        width: DRAWER_WIDTH,
        height: '80%',
        marginRight: 20,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 12,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    blurContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    valueText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    sliderLabel: {
        fontSize: 12,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    toggleTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    toggleDescription: {
        fontSize: 14,
        lineHeight: 18,
    },
    colorFilterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});