import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useOnboardingStore } from '@/store/onboardingStore';
import Colors from '@/constants/Colors';
import ToggleSwitch from '@/components/onboard/ToggleSwitch';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();

  // Access the current theme from the ThemeContext
  const { currentTheme } = useContext(ThemeContext);

  // Access the user profile from the onboarding store
  const { user: userProfile } = useOnboardingStore();

  // State for accessibility needs - Initialized with user profile data
  const [needsRamp, setNeedsRamp] = useState(userProfile.needsRamp);
  const [needsAssistiveDevice, setNeedsAssistiveDevice] = useState(userProfile.needsAssistiveDevice);
  const [needsSignLanguage, setNeedsSignLanguage] = useState(userProfile.needsSignLanguage);

  // State for toggle switches
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(50);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Your Profile',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: currentTheme === 'light' ? Colors.primary : Colors.white,
          },
          headerTintColor: currentTheme === 'light' ? Colors.primary : Colors.white,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
          }
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Profile screen"
        accessibilityHint="Contains your profile information and accessibility settings"
      >
        <View
          style={styles.profileContainer}
          accessible={true}
          accessibilityLabel="Profile information"
          accessibilityRole="header"
        >
          {
            userProfile.profilePicture ? (
              <Image
                source={{ uri: userProfile.profilePicture }}
                style={styles.profileImage}
                accessible={true}
                accessibilityLabel="Profile picture"
              />
            ) : (
              <View
                style={styles.profilePlaceholder}
                accessible={true}
                accessibilityLabel={`Profile initial: ${userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'B'}`}
              >
                <Text style={styles.profilePlaceholderText}>
                  {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'B'}
                </Text>
              </View>
            )
          }
          <Text
            style={[styles.userName, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
          >
            {userProfile.fullName}
          </Text>
          <Text
            style={styles.userEmail}
            accessibilityRole="text"
          >
            {userProfile.email}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/profileSetup')}
            accessibilityLabel="Edit profile"
            accessibilityHint="Navigate to profile editing screen"
            accessibilityRole="button"
          >
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Accessibility Settings Section Header */}
        <View
          style={styles.sectionHeader}
          accessible={true}
          accessibilityRole="header"
        >
          <Text
            style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
          >
            Accessibility Settings
          </Text>
          <Ionicons name="accessibility-outline" size={24} color={currentTheme === 'light' ? Colors.primary : Colors.white} />
        </View>

        {/* Accessibility Settings Cards */}
        <View
          style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}
          accessible={true}
          accessibilityLabel="Accessibility settings controls"
        >
          {/* Text Size */}
          <View
            style={styles.settingRow}
            accessible={true}
            accessibilityLabel="Text size adjustment"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons name="text" size={24} color="#8954dc" />
              <Text
                style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                accessibilityRole="text"
              >
                Text Size
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}  // Use integer steps
              value={textSize}
              onValueChange={setTextSize}
              maximumTrackTintColor={currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray}
              minimumTrackTintColor='#8954dc'
              thumbTintColor={currentTheme === 'light' ? Colors.black : Colors.white}
              accessibilityLabel="Text size slider"
              accessibilityHint="Slide right to increase text size, left to decrease"
              accessibilityRole="adjustable"
              accessibilityValue={{
                min: 0,
                max: 100,
                now: textSize,
              }}
              accessibilityActions={[
                { name: 'increment', label: 'Increase text size' },
                { name: 'decrement', label: 'Decrease text size' }
              ]}
              onAccessibilityAction={(event) => {
                if (event.nativeEvent.actionName === 'increment') {
                  setTextSize(Math.min(textSize + 10, 100));
                } else if (event.nativeEvent.actionName === 'decrement') {
                  setTextSize(Math.max(textSize - 10, 0));
                }
              }}
            />
          </View>

          {/* Voice Commands */}
          <View
            style={styles.settingRow}
            accessible={true}
            accessibilityLabel="Voice commands toggle"
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="keyboard-voice" size={24} color={Colors.secondary} />
              <Text
                style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                accessibilityRole="text"
              >
                Voice Commands
              </Text>
            </View>
            <Switch
              value={voiceCommands}
              onValueChange={setVoiceCommands}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
              accessibilityRole="switch"
              accessibilityState={{ checked: voiceCommands }}
              accessibilityLabel="Voice Commands"
              accessibilityHint="Enable voice commands for navigation and actions"
            />
          </View>

          {/* High Contrast */}
          <View
            style={styles.settingRow}
            accessible={true}
            accessibilityLabel="High contrast mode toggle"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons name="sunny" size={24} color="#8954dc" />
              <Text
                style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
                accessibilityRole="text"
              >
                High Contrast
              </Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
              accessibilityRole="switch"
              accessibilityState={{ checked: highContrast }}
              accessibilityLabel="High Contrast Mode"
              accessibilityHint="Enable high contrast mode for better visibility"
            />
          </View>
        </View>

        {/* Accessibility Needs Section Header */}
        <View
          style={styles.sectionHeader}
          accessible={true}
          accessibilityRole="header"
        >
          <Text
            style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
          >
            Accessibility Needs
          </Text>
        </View>

        {/* Accessibility Needs Cards */}
        <View
          style={[styles.accessibilityNeedsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}
          accessible={true}
          accessibilityLabel="Accessibility needs preferences"
        >
          <View style={styles.needsContainer}>
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
        </View>

        {/* Account Settings Section Header */}
        <View
          style={styles.sectionHeader}
          accessible={true}
          accessibilityRole="header"
        >
          <Text
            style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
            accessibilityRole="text"
          >
            Account Settings
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}
          onPress={() => router.push('/notifications')}
          accessibilityLabel="Notifications settings"
          accessibilityHint="Navigate to notifications settings screen"
          accessibilityRole="button"
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={24} color="#8954dc" />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                Notifications
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#AAA" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}
          onPress={() => router.push('/settings')}
          accessibilityLabel="General settings"
          accessibilityHint="Navigate to general app settings"
          accessibilityRole="button"
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Feather name="settings" size={24} color="#8954dc" />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                General Settings
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}
          accessibilityLabel="Help and support"
          accessibilityHint="Access help resources and support options"
          accessibilityRole="button"
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Feather name="help-circle" size={24} color="#8954dc" />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                Help & Support
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsCard, { marginBottom: 40, backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}
          accessibilityLabel="Logout"
          accessibilityHint="Sign out of your account"
          accessibilityRole="button"
          accessibilityLiveRegion="polite"
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="logout" size={24} color="#f44336" />
              <Text style={[styles.settingLabel, { color: '#f44336' }]}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
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
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editProfile: {
    color: '#8954dc',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
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
    paddingHorizontal: 4,
  },
  settingsCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accessibilityNeedsCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  needsContainer: {
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  slider: {
    flex: 1,
    marginLeft: 16,
    height: 40,
  },
  toggleContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});