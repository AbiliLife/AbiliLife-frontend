import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';

import CustomButton from '@/components/common/CustomButton';
import FormField from '@/components/common/FormField';
import StepIndicator from '@/components/onboard/StepIndicator';
import AccessibilityPreferencesForm from '@/components/onboard/AccessibilityPreferencesForm';
import SelectableChip from '@/components/onboard/SelectableChip';
import CareRelationshipForm from '@/components/onboard/CareRelationshipForm';
import EmergencyContactForm from '@/components/onboard/EmergencyContactForm';

import {
    ContactMethod,
    DisabilityType,
    UserRole,
    EmergencyContact,
    CareRelationship,
    AccessibilityPreferences,
    RelationshipType
} from '@/types/onboard';


const ONBOARDING_STEPS = [
    { id: 1, title: 'Basic Info', description: 'Tell us about yourself' },
    { id: 2, title: 'Care Network', description: 'Set up your care network' },
    { id: 3, title: 'Emergency Contacts', description: 'Add emergency contacts' },
    { id: 4, title: 'Accessibility', description: 'Configure your accessibility preferences' },
    { id: 5, title: 'Review', description: 'Review and complete your profile' },
];

export default function ProfileSetupScreen() {
    const router = useRouter();
    const { currentTheme } = useContext(ThemeContext);
    const { user, updateUser, setCurrentStep } = useOnboardingStore();

    // Multi-step state
    const [currentOnboardingStep, setCurrentOnboardingStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Basic Info (Step 1) - Add safety checks for undefined values
    const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [role, setRole] = useState<UserRole>(user?.role || 'self');
    const [selectedDisabilities, setSelectedDisabilities] = useState<DisabilityType[]>(user?.disabilityTypes || []);
    const [preferredContact, setPreferredContact] = useState<ContactMethod>(user?.preferredContactMethod || 'WhatsApp');
    const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');

    // Care Network (Step 2) - Add safety checks
    const [careRelationships, setCareRelationships] = useState<CareRelationship[]>(user?.careRelationships || []);

    // Emergency Contacts (Step 3) - Add safety checks
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(user?.emergencyContacts || []);

    // Accessibility Preferences (Step 4) - Add safety checks
    const [accessibilityPreferences, setAccessibilityPreferences] = useState<AccessibilityPreferences>(
        user?.accessibilityPreferences || {
            mobility: {
                useWheelchair: false,
                needsRamp: false,
                needsAssistiveDevice: false,
                deviceType: '',
                transferAssistance: false,
            },
            visual: {
                isBlind: false,
                hasLowVision: false,
                needsLargeText: false,
                needsHighContrast: false,
                hasGuideAnimal: false,
            },
            hearing: {
                isDeaf: false,
                hasHearingLoss: false,
                needsSignLanguage: false,
                hasHearingAid: false,
                needsWrittenCommunication: false,
            },
            cognitive: {
                needsSimpleInstructions: false,
                needsExtraTime: false,
                hasMemorySupport: false,
                needsCompanion: false,
            },
        }
    );

    // Form state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const disabilityTypes: DisabilityType[] = ['Physical', 'Visual', 'Hearing', 'Cognitive', 'Other'];
    const contactMethods: ContactMethod[] = ['WhatsApp', 'SMS', 'Email'];
    const userRoles: UserRole[] = ['self', 'caregiver', 'family_member', 'guardian'];
    const languages = ['English', 'Swahili'];
    const relationshipTypes: RelationshipType[] = ['parent', 'child', 'sibling', 'spouse', 'caregiver', 'friend', 'guardian', 'other'];

    useEffect(() => {
        // Auto-save data as user progresses
        const userData = {
            fullName,
            profilePicture,
            role,
            disabilityTypes: selectedDisabilities,
            preferredContactMethod: preferredContact,
            preferredLanguage,
            careRelationships,
            emergencyContacts,
            accessibilityPreferences,
            profileCompleteness: calculateProfileCompleteness(),
        };
        updateUser(userData);
    }, [
        fullName, profilePicture, role, selectedDisabilities, preferredContact, preferredLanguage,
        careRelationships, emergencyContacts, accessibilityPreferences
    ]);

    const calculateProfileCompleteness = () => {
        let score = 0;
        const maxScore = 100;

        // Basic info (30 points)
        if (fullName?.trim()) score += 10;
        if (profilePicture) score += 5;
        if (selectedDisabilities?.length > 0) score += 10;
        if (role !== 'self') score += 5;

        // Care network (20 points)
        if (careRelationships?.length > 0) score += 20;

        // Emergency contacts (20 points)
        if (emergencyContacts?.length > 0) score += 15;
        if (emergencyContacts?.some(c => c?.isPrimary)) score += 5;

        // Accessibility preferences (30 points)
        const hasAccessibilityPrefs = accessibilityPreferences && Object.values(accessibilityPreferences).some(category =>
            category && Object.values(category).some(value => value === true || (typeof value === 'string' && value?.trim()))
        );
        if (hasAccessibilityPrefs) score += 30;

        return Math.min(score, maxScore);
    };

    const pickImage = async (useCamera: boolean) => {
        try {
            if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
            }

            let result;

            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'We need camera permissions to take a photo');
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
            if (prev?.includes(type)) {
                return prev.filter(item => item !== type);
            } else {
                return [...(prev || []), type];
            }
        });
    };

    const validateCurrentStep = () => {
        const newErrors: Record<string, string> = {};

        switch (currentOnboardingStep) {
            case 1:
                if (!fullName?.trim()) {
                    newErrors.fullName = 'Full name is required';
                }
                if (!selectedDisabilities?.length) {
                    newErrors.disabilities = 'Please select at least one disability type';
                }
                break;
            case 2:
                // Care relationships are optional but recommended
                break;
            case 3:
                if (!emergencyContacts?.length) {
                    newErrors.emergencyContacts = 'At least one emergency contact is recommended';
                }
                break;
            case 4:
                // Accessibility preferences are optional
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateCurrentStep()) return;

        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }

        // Mark current step as completed
        setCompletedSteps(prev => [...prev, currentOnboardingStep]);

        if (currentOnboardingStep < ONBOARDING_STEPS.length) {
            setCurrentOnboardingStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentOnboardingStep > 1) {
            setCurrentOnboardingStep(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        try {
            setLoading(true);

            // Mock API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Final update with completion status
            updateUser({
                onboardingCompleted: true,
                profileCompleteness: calculateProfileCompleteness(),
            });

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            setCurrentStep(5);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Profile setup error:', error);
            setErrors({ general: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const renderCurrentStep = () => {
        switch (currentOnboardingStep) {
            case 1:
                return renderBasicInfoStep();
            case 2:
                return renderCareNetworkStep();
            case 3:
                return renderEmergencyContactsStep();
            case 4:
                return renderAccessibilityStep();
            case 5:
                return renderReviewStep();
            default:
                return null;
        }
    };

    const renderBasicInfoStep = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Basic Information">
                Basic Information
            </Text>
            <Text style={[styles.stepSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Let's start with some basic information about you.">
                Let's start with some basic information about you
            </Text>

            {/* Profile Picture */}
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
                        <View style={styles.profilePlaceholder} accessibilityRole='image' accessibilityLabel="Profile picture placeholder">
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
                        <Ionicons name="camera" size={20} color={Colors.primary} />
                        <Text style={styles.pictureActionText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pictureActionButton}
                        onPress={() => pickImage(false)}
                        accessibilityRole='button'
                        accessibilityLabel="Choose from gallery"
                        accessibilityHint='Opens gallery to select a profile picture'
                    >
                        <Ionicons name="images" size={20} color={Colors.primary} />
                        <Text style={styles.pictureActionText}>Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Full Name */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel="Full Name Label">
                    Your Full Name
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
                    accessibilityLabel="Full name input"
                    accessibilityHint="Enter your full name"
                />
            </View>
            {errors.fullName && (
                <Text style={styles.errorText}>
                    {errors.fullName}
                </Text>
            )}

            {/* Role Selection */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="header" accessibilityLabel="I am a...">
                    I am a...
                </Text>
                <View style={styles.chipsContainer}>
                    {userRoles.map((userRole) => (
                        <SelectableChip
                            key={userRole}
                            label={userRole === 'self' ? 'Person with disability' :
                                userRole === 'caregiver' ? 'Caregiver' :
                                    userRole === 'family_member' ? 'Family member' : 'Guardian'}
                            selected={role === userRole}
                            onPress={() => setRole(userRole)}
                        />
                    ))}
                </View>
            </View>

            {/* Disability Types */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='header' accessibilityLabel='Disability Type'>
                    Disability Type
                </Text>
                <Text style={[styles.sectionSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Select all that apply to you">
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

            {/* Preferred Contact Method */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='header' accessibilityLabel='Preferred Contact Method'>
                    Preferred Contact Method
                </Text>

                <View style={styles.contactMethodContainer}>
                    {contactMethods.map(method => (
                        <TouchableOpacity
                            key={method}
                            style={[
                                styles.contactMethodButton,
                                preferredContact === method && styles.contactMethodButtonActive,
                                { borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }
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
                            accessibilityHint="Select this contact method for notifications and updates"
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

            {/* Preferred Language */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='header' accessibilityLabel='Preferred Language'>
                    Preferred Language
                </Text>
                <View style={styles.chipsContainer}>
                    {languages.map((lang) => (
                        <SelectableChip
                            key={lang}
                            label={lang}
                            selected={preferredLanguage === lang}
                            onPress={() => setPreferredLanguage(lang)}
                        />
                    ))}
                </View>
            </View>

        </View>
    );

    const renderCareNetworkStep = () => (
        <View>
            <CareRelationshipForm
                relationships={careRelationships || []}
                onAddRelationship={(relationship) => {
                    Haptics.selectionAsync();
                    setCareRelationships(prev => [...(prev || []), { ...relationship, id: uuid.v4(), isPrimary: false }]);
                }}
                onRemoveRelationship={(id) => setCareRelationships(prev => (prev || []).filter(r => r.id !== id))}
                onUpdateRelationship={(id, updates) => {
                    Haptics.selectionAsync();
                    setCareRelationships(prev =>
                        (prev || []).map(r => r.id === id ? { ...r, ...updates } : r)
                    );
                }}
            />
            {errors.careRelationships && <Text style={styles.errorText}>{errors.careRelationships}</Text>}
        </View>
    );

    const renderEmergencyContactsStep = () => (
        <View>
            <EmergencyContactForm
                contacts={emergencyContacts || []}
                onAddContact={(contact) => setEmergencyContacts(prev => [...(prev || []), contact])}
                onRemoveContact={(id) => setEmergencyContacts(prev => (prev || []).filter(c => c.id !== id))}
                onUpdateContact={(id, updates) => setEmergencyContacts(prev =>
                    (prev || []).map(c => c.id === id ? { ...c, ...updates } : c)
                )}
            />
            {errors.emergencyContacts && <Text style={styles.errorText}>{errors.emergencyContacts}</Text>}
        </View>
    );

    const renderAccessibilityStep = () => (
        <AccessibilityPreferencesForm
            preferences={accessibilityPreferences}
            onUpdatePreferences={setAccessibilityPreferences}
        />
    );

    const renderReviewStep = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Profile Review">
                Profile Review
            </Text>
            <Text style={[styles.stepSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Review your profile information before completing setup">
                Review your profile information before completing setup
            </Text>

            {/* Profile Completeness */}
            <View style={[styles.reviewSection, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                <Text style={[styles.reviewTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="header" accessibilityLabel="Profile Completeness">
                    Profile Completeness
                </Text>
                <View style={styles.completenessContainer}>
                    <View style={styles.completenessBar}>
                        <View style={[styles.completenessProgress, { width: `${calculateProfileCompleteness()}%` }]} />
                    </View>
                    <Text style={[styles.completenessText, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                        {calculateProfileCompleteness()}%
                    </Text>
                </View>
            </View>

            {/* Basic Info Summary */}
            <View style={[styles.reviewSection, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                <Text style={[styles.reviewTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                    Basic Information
                </Text>
                <Text style={[styles.reviewItem, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                    Name: {fullName || 'Not provided'}
                </Text>
                <Text style={[styles.reviewItem, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                    Role: {role}
                </Text>
                <Text style={[styles.reviewItem, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                    Disabilities: {selectedDisabilities?.join(', ') || 'None selected'}
                </Text>
                <Text style={[styles.reviewItem, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                    Preferred contact: {preferredContact}
                </Text>
            </View>

            {/* Care Network Summary */}
            {(careRelationships?.length || 0) > 0 && (
                <View style={[styles.reviewSection, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                    <Text style={[styles.reviewTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                        Care Network ({careRelationships?.length || 0} contacts)
                    </Text>
                    {careRelationships?.map((relationship) => (
                        <Text key={relationship.id} style={[styles.reviewItem, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                            {relationship.name} ({relationship.relationship})
                        </Text>
                    ))}
                </View>
            )}

            {/* Emergency Contacts Summary */}
            {(emergencyContacts?.length || 0) > 0 && (
                <View style={[styles.reviewSection, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                    <Text style={[styles.reviewTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                        Emergency Contacts ({emergencyContacts?.length || 0} contacts)
                    </Text>
                    {emergencyContacts?.map((contact) => (
                        <Text key={contact.id} style={[styles.reviewItem, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                            {contact.name} ({contact.relationship}) {contact.isPrimary && '- Primary'}
                        </Text>
                    ))}
                </View>
            )}

            {/* Accessibility Summary */}
            <View style={[styles.reviewSection, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                <Text style={[styles.reviewTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                    Accessibility Preferences
                </Text>
                <Text style={[styles.reviewItem, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                    {accessibilityPreferences && Object.values(accessibilityPreferences).some(category =>
                        category && Object.values(category).some(value => value === true)
                    ) ? 'Configured' : 'Not configured'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBackButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                    Profile Setup
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicatorContainer}>
                <StepIndicator
                    steps={ONBOARDING_STEPS}
                    currentStep={currentOnboardingStep}
                    completedSteps={completedSteps}
                    currentTheme={currentTheme}
                />
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderCurrentStep()}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: currentTheme === 'light' ? Colors.lightGray : Colors.darkGray }]}>
                {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

                <View style={styles.footerButtons}>
                    {currentOnboardingStep > 1 && (
                        <CustomButton
                            title="Back"
                            handlePress={handleBack}
                            containerStyle={[styles.footerButton, styles.backButton]}
                            textStyle={styles.backButtonText}
                        />
                    )}

                    <CustomButton
                        title={currentOnboardingStep === ONBOARDING_STEPS.length ? "Complete Setup" : "Next"}
                        handlePress={handleNext}
                        containerStyle={[styles.footerButton, styles.nextButton]}
                        loading={loading}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    headerBackButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    stepIndicatorContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    stepContainer: {
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 22,
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
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
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
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    contactMethodText: {
        fontSize: 14,
        fontWeight: '500',
    },
    contactMethodTextActive: {
        color: Colors.white,
    },
    reviewSection: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    reviewItem: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    completenessContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completenessBar: {
        flex: 1,
        height: 8,
        backgroundColor: Colors.lightGray,
        borderRadius: 4,
        marginRight: 12,
        overflow: 'hidden',
    },
    completenessProgress: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    completenessText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerButton: {
        flex: 1,
        marginHorizontal: 8,
    },
    backButton: {
        backgroundColor: Colors.lightGray,
    },
    backButtonText: {
        color: Colors.accent,
    },
    nextButton: {
        backgroundColor: Colors.primary,
    },
    errorText: {
        color: Colors.error,
        fontSize: 14,
        marginVertical: 8,
    },
});
