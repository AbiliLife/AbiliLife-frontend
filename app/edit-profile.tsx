import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, Upload, X } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ThemeContext } from '@/contexts/ThemeContext';
import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';

export default function EditProfileScreen() {
    const router = useRouter();
    const headerHeight = useHeaderHeight();

    const { user, updateUser } = useOnboardingStore();
    const { currentTheme } = useContext(ThemeContext);

    const [profilePicture, setProfilePicture] = useState<string | undefined>(user.profilePicture);
    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Your full name is required.';
        }

        if (!email.trim()) {
            newErrors.email = 'Your email address is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!phone.trim()) {
            newErrors.phone = 'Your phone number is required.';
        } else if (!/^\+?[0-9\s]+$/.test(phone)) {
            newErrors.phone = 'Please enter a valid phone number.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveChanges = async () => {
                if (!validateForm()) return;
        
                try {
                    setLoading(true);
        
                    // Mock API call delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
        
                    // Update user profile
                    updateUser({
                        fullName,
                        email,
                        phone,
                        profilePicture,
                    });

        
                    if (Platform.OS !== 'web') {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                    router.back();
                } catch (error) {
                    console.error('Error saving profile:', error);
                    if (Platform.OS !== 'web') {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    }
                    setErrors({
                        general: 'Failed to save profile. Please try again later.',
                    })
                } finally {
                    setLoading(false);
                }
    }

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: Platform.OS === 'ios' ? headerHeight + 24 : 24, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen name="edit-profile" options={{
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.selectionAsync();
                            router.back();
                        }}
                        accessibilityRole='button'
                        accessibilityLabel="Back to previous screen"
                        accessibilityHint='Returns to the previous screen without saving changes'
                    >
                        <X size={24} color={currentTheme === 'light' ? Colors.primary : Colors.white} />
                    </TouchableOpacity>
                ),
                headerTitle: 'Edit Your Profile',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: currentTheme === 'light' ? Colors.primary : Colors.white,
                },
                headerStyle: {
                    backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
                },
                headerLargeTitle: Platform.OS === 'ios',
                headerShadowVisible: false,
            }} />

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
                        <View style={styles.profilePlaceholder} accessibilityRole='image' accessibilityLabel="Placeholder for profile picture">
                            <Text style={styles.profilePlaceholderText} accessibilityLabel="Initials of your full name" accessibilityHint='Displays the first letter of your full name as a placeholder'>
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
                        <Camera size={20} color={currentTheme === 'light' ? Colors.secondary : Colors.white} />
                        <Text style={[styles.pictureActionText, { color: currentTheme === 'light' ? Colors.secondary : Colors.white }]}>
                            Camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.pictureActionButton}
                        onPress={() => pickImage(false)}
                        accessibilityRole='button'
                        accessibilityLabel="Choose from gallery"
                        accessibilityHint='Opens gallery to select a profile picture'
                    >
                        <Upload size={20} color={currentTheme === 'light' ? Colors.secondary : Colors.white} />
                        <Text style={[styles.pictureActionText, { color: currentTheme === 'light' ? Colors.secondary : Colors.white }]}>
                            Gallery
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Full Name Label">
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

            <View>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Email Label">
                    Your Email
                </Text>
                <FormField
                    icon={true}
                    iconName="mail"
                    iconFamily="Ionicons"
                    title="Email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    accessibilityLabel="Email input"
                    accessibilityHint="Enter your email address"
                />
            </View>
            {errors.email && (
                <Text style={styles.errorText}>
                    {errors.email}
                </Text>
            )}

            <View>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="text" accessibilityLabel="Phone Label">
                    Your Phone Number
                </Text>
                <FormField
                    icon={true}
                    iconName="call"
                    iconFamily="Ionicons"
                    title="Phone Number"
                    type="phone"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChangeText={setPhone}
                    accessibilityLabel="Phone number input"
                    accessibilityHint="Enter your phone number"
                />
            </View>
            {errors.phone && (
                <Text style={styles.errorText}>
                    {errors.phone}
                </Text>
            )}

            {errors.general && (
                <Text style={styles.errorText}>
                    {errors.general}
                </Text>
            )}

            <View style={{ height: 150 }} />
            
            <View style={styles.footer}>
                <CustomButton
                    title='Save Changes'
                    handlePress={handleSaveChanges}
                    loading={loading}
                    accessibilityRole='button'
                    accessibilityLabel="Save profile changes"
                    accessibilityHint='Saves the changes made to your profile'
                />
                <CustomButton
                    title='Cancel'
                    handlePress={() => router.back()}
                    containerStyle={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                    accessibilityRole='button'
                    accessibilityLabel="Cancel changes"
                    accessibilityHint='Returns to the previous screen without saving changes'
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 24,
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
        backgroundColor: Colors.secondary,
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
        // color: Colors.secondary,
        fontWeight: '500',
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
    errorText: {
        color: Colors.error,
        fontSize: 14,
        marginVertical: 8,
    },
    footer: {
        marginTop: 24,
        marginBottom: 40,
    },
    cancelButton: {
        marginTop: 12,
        backgroundColor: 'transparent',
        borderColor: Colors.mediumGray,
        borderWidth: 1,
    },
    cancelButtonText: {
        color: Colors.mediumGray,
    },
})