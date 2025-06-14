import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, Upload } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import Button from '@/components/onboard/Button';
import FormField from '@/components/common/FormField';
import SelectableChip from '@/components/onboard/SelectableChip';
import ToggleSwitch from '@/components/onboard/ToggleSwitch';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ContactMethod, DisabilityType } from '@/types/onboard';


export default function ProfileSetupScreen() {
    const { user, updateUser, setCurrentStep } = useOnboardingStore();

    const [profilePicture, setProfilePicture] = useState<string | undefined>(user.profilePicture);
    const [fullName, setFullName] = useState(user.fullName);
    const [selectedDisabilities, setSelectedDisabilities] = useState<DisabilityType[]>(user.disabilityTypes);
    const [needsRamp, setNeedsRamp] = useState(user.needsRamp);
    const [needsAssistiveDevice, setNeedsAssistiveDevice] = useState(user.needsAssistiveDevice);
    const [needsSignLanguage, setNeedsSignLanguage] = useState(user.needsSignLanguage);
    const [preferredContact, setPreferredContact] = useState<ContactMethod>(user.preferredContactMethod);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const disabilityTypes: DisabilityType[] = ['Physical', 'Visual', 'Hearing', 'Cognitive', 'Other'];
    const contactMethods: ContactMethod[] = ['WhatsApp', 'SMS', 'Email'];

    const pickImage = async (useCamera: boolean) => {
        try {
            if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
            }

            let result;

            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera permissions to make this work!');
                    return;
                }

                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfilePicture(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const toggleDisabilityType = (type: DisabilityType) => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }

        setSelectedDisabilities(prev => {
            if (prev.includes(type)) {
                return prev.filter(item => item !== type);
            } else {
                return [...prev, type];
            }
        });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (selectedDisabilities.length === 0) {
            newErrors.disabilities = 'Please select at least one disability type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            // Mock API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user profile
            updateUser({
                fullName,
                profilePicture,
                disabilityTypes: selectedDisabilities,
                needsRamp,
                needsAssistiveDevice,
                needsSignLanguage,
                preferredContactMethod: preferredContact,
            });

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            setCurrentStep(4);
            // router.replace('/onboarding-tips');
        } catch (error) {
            console.error('Profile setup error:', error);
            setErrors({ general: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Set Up Your Profile</Text>
                <Text style={styles.subtitle}>
                    Help us personalize your experience
                </Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.profilePictureContainer}>
                    <View style={styles.profilePicture}>
                        {profilePicture ? (
                            <Image
                                source={{ uri: profilePicture }}
                                style={styles.profileImage}
                                accessibilityRole='image'
                                accessibilityLabel="Your profile picture"
                            />
                        ) : (
                            <View style={styles.profilePlaceholder}>
                                <Text style={styles.profilePlaceholderText}>
                                    {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.profilePictureActions}>
                        <TouchableOpacity
                            style={styles.pictureActionButton}
                            onPress={() => pickImage(true)}
                            accessibilityRole='button'
                            accessibilityLabel="Take photo"
                            accessibilityHint='Opens camera to take a new profile picture'
                        >
                            <Camera size={20} color={Colors.primary} />
                            <Text style={styles.pictureActionText}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.pictureActionButton}
                            onPress={() => pickImage(false)}
                            accessibilityRole='button'
                            accessibilityLabel="Choose from gallery"
                            accessibilityHint='Opens gallery to select a profile picture'
                        >
                            <Upload size={20} color={Colors.primary} />
                            <Text style={styles.pictureActionText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole="text" accessibilityLabel="Full Name Label">
                        Full Name
                    </Text>
                    <FormField
                        icon={true}
                        iconName="person"
                        iconFamily="Ionicons"
                        title="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                        readOnly={user.fullName !== ''}
                        accessibilityLabel="Full name input"
                        accessibilityHint="Enter your full name"
                    />
                    <Text style={styles.sectionSubtitle} accessibilityRole="text" accessibilityLabel="Full Name Subtitle">
                        This will help us personalize your experience
                    </Text>
                </View>
                {errors.fullName && (
                    <Text style={styles.errorText}>
                        {errors.fullName}
                    </Text>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole='header' accessibilityLabel='Disability Type Title'>
                        Disability Type
                    </Text>
                    <Text style={styles.sectionSubtitle} accessibilityRole="text" accessibilityLabel="Disability Type Subtitle">
                        Select all that apply to you
                    </Text>

                    <View style={styles.chipsContainer}>
                        {disabilityTypes.map(type => (
                            <SelectableChip
                                key={type}
                                label={type}
                                selected={selectedDisabilities.includes(type)}
                                onPress={() => toggleDisabilityType(type)}
                            />
                        ))}
                    </View>

                    {errors.disabilities && (
                        <Text style={styles.errorText}>{errors.disabilities}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole='header' accessibilityLabel='Accessibility Needs Title'>
                        Accessibility Needs
                    </Text>
                    <Text style={styles.sectionSubtitle} accessibilityRole="text" accessibilityLabel="Accessibility Needs Subtitle">
                        Let us know if you have any specific needs
                    </Text>

                    <ToggleSwitch
                        label="Wheelchair Ramp"
                        value={needsRamp}
                        onValueChange={setNeedsRamp}
                        description="I need a vehicle with a ramp"
                    />

                    <ToggleSwitch
                        label="Assistive Device"
                        value={needsAssistiveDevice}
                        onValueChange={setNeedsAssistiveDevice}
                        description="I use a walker, cane, or other device"
                    />

                    <ToggleSwitch
                        label="Sign Language Support"
                        value={needsSignLanguage}
                        onValueChange={setNeedsSignLanguage}
                        description="I need sign language communication"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole='header' accessibilityLabel='Preferred Contact Method Title'>
                        Preferred Contact Method
                    </Text>

                    <View style={styles.contactMethodContainer}>
                        {contactMethods.map(method => (
                            <TouchableOpacity
                                key={method}
                                style={[
                                    styles.contactMethodButton,
                                    preferredContact === method && styles.contactMethodButtonActive
                                ]}
                                onPress={() => {
                                    if (Platform.OS !== 'web') {
                                        Haptics.selectionAsync();
                                    }
                                    setPreferredContact(method);
                                }}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: preferredContact === method }}
                                accessibilityLabel={`${method} contact method`}
                                accessibilityHint="Select this contact method for notifications"
                            >
                                <Text
                                    style={[
                                        styles.contactMethodText,
                                        preferredContact === method && styles.contactMethodTextActive
                                    ]}
                                >
                                    {method}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {errors.general && (
                    <Text style={styles.errorText}>{errors.general}</Text>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    loading={loading}
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginVertical: 32,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.accent,
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        overflow: 'hidden',
        backgroundColor: Colors.lightGray,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profilePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePlaceholderText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.white,
    },
    profilePictureActions: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pictureActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginHorizontal: 8,
    },
    pictureActionText: {
        marginLeft: 4,
        color: Colors.primary,
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.accent,
        marginBottom: 12,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    contactMethodContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    contactMethodButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactMethodButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    contactMethodText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.accent,
    },
    contactMethodTextActive: {
        color: Colors.white,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.darkGray,
    },
    errorText: {
        color: Colors.error,
        fontSize: 14,
        marginVertical: 8,
    },
    footer: {
        padding: 24,
        backgroundColor: Colors.background,
    },
    button: {
        width: '100%',
    },
});