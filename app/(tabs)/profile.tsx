import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { CareRelationship, EmergencyContact, AccessibilityPreferences, DisabilityType, ContactMethod, UserRole } from '@/types/onboard';

import Colors from '@/constants/Colors';

import { useOnboardingStore } from '@/store/onboardingStore';
import { ThemeContext } from '@/contexts/ThemeContext';

import { formatHiddenPhoneNumber } from '@/utils/formatPhone';

// Import onboarding components for editing
import CareRelationshipForm from '@/components/onboard/CareRelationshipForm';
import EmergencyContactForm from '@/components/onboard/EmergencyContactForm';
import AccessibilityPreferencesForm from '@/components/onboard/AccessibilityPreferencesForm';
import SelectableChip from '@/components/onboard/SelectableChip';

export default function ProfileScreen() {
  const router = useRouter();
  
  const { currentTheme } = useContext(ThemeContext);
  const { user: userProfile, updateUser } = useOnboardingStore();

  // Editing states
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Basic info editing state
  const [basicInfo, setBasicInfo] = useState({
    fullName: userProfile.fullName,
    email: userProfile.email,
    phone: userProfile.phone,
    role: userProfile.role,
    disabilityTypes: userProfile.disabilityTypes,
    preferredContactMethod: userProfile.preferredContactMethod,
    preferredLanguage: userProfile.preferredLanguage,
  });

  // Care relationships state
  const [careRelationships, setCareRelationships] = useState<CareRelationship[]>(userProfile.careRelationships);

  // Emergency contacts state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(userProfile.emergencyContacts);

  // Accessibility preferences state
  const [accessibilityPreferences, setAccessibilityPreferences] = useState<AccessibilityPreferences>(userProfile.accessibilityPreferences);

  // Quick settings state
  const [quickSettings, setQuickSettings] = useState({
    voiceCommands: userProfile.communicationPreferences?.voiceInstructions || false,
    highContrast: userProfile.communicationPreferences?.highContrast || false,
    textToSpeech: userProfile.communicationPreferences?.textToSpeech || false,
    textSize: userProfile.communicationPreferences?.fontSize === 'SMALL' ? 25 :
      userProfile.communicationPreferences?.fontSize === 'MEDIUM' ? 50 :
        userProfile.communicationPreferences?.fontSize === 'LARGE' ? 75 :
          userProfile.communicationPreferences?.fontSize === 'EXTRA_LARGE' ? 100 : 50,
  });

  const handleSaveBasicInfo = () => {
    updateUser({
      fullName: basicInfo.fullName,
      email: basicInfo.email,
      phone: basicInfo.phone,
      role: basicInfo.role,
      disabilityTypes: basicInfo.disabilityTypes,
      preferredContactMethod: basicInfo.preferredContactMethod,
      preferredLanguage: basicInfo.preferredLanguage,
    });
    setEditingSection(null);
    Alert.alert('Success', 'Basic information updated successfully');
  };

  const handleSaveCareRelationships = () => {
    updateUser({ careRelationships });
    setEditingSection(null);
    Alert.alert('Success', 'Care network updated successfully');
  };

  const handleSaveEmergencyContacts = () => {
    updateUser({ emergencyContacts });
    setEditingSection(null);
    Alert.alert('Success', 'Emergency contacts updated successfully');
  };

  const handleSaveAccessibilityPreferences = () => {
    updateUser({ accessibilityPreferences });
    setEditingSection(null);
    Alert.alert('Success', 'Accessibility preferences updated successfully');
  };

  const handleQuickSettingChange = (setting: string, value: any) => {
    const newSettings = { ...quickSettings, [setting]: value };
    setQuickSettings(newSettings);

    // Update user immediately for quick settings
    const fontSize = newSettings.textSize <= 25 ? 'SMALL' :
      newSettings.textSize <= 50 ? 'MEDIUM' :
        newSettings.textSize <= 75 ? 'LARGE' : 'EXTRA_LARGE';

    // Ensure communicationPreferences exists with default values
    const currentCommPrefs = userProfile.communicationPreferences || {
      preferredLanguage: userProfile.preferredLanguage || 'English',
      fontSize: 'MEDIUM',
      highContrast: false,
      voiceInstructions: false,
      textToSpeech: false,
      communicationStyle: 'MIXED',
    };

    updateUser({
      communicationPreferences: {
        ...currentCommPrefs,
        voiceInstructions: newSettings.voiceCommands,
        highContrast: newSettings.highContrast,
        textToSpeech: newSettings.textToSpeech,
        fontSize,
      }
    });
  };

  const renderSectionHeader = (title: string, icon: string, sectionKey: string, canEdit: boolean = true) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderContent}>
        <Ionicons name={icon as any} size={24} color={currentTheme === 'light' ? Colors.primary : Colors.white} />
        <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
          {title}
        </Text>
      </View>
      {canEdit && (
        <TouchableOpacity
          onPress={() => setEditingSection(editingSection === sectionKey ? null : sectionKey)}
          style={styles.editButton}
          accessibilityLabel={`${editingSection === sectionKey ? 'Cancel editing' : 'Edit'} ${title}`}
        >
          <Ionicons
            name={editingSection === sectionKey ? "close" : "pencil"}
            size={24}
            color={Colors.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const disabilityTypes: DisabilityType[] = ['Physical', 'Visual', 'Hearing', 'Cognitive', 'Other'];
  const contactMethods: ContactMethod[] = ['WhatsApp', 'SMS', 'Email'];
  const userRoles: UserRole[] = ['PWD', 'caregiver', 'family_member', 'guardian'];

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
        accessibilityHint="Contains your profile information and settings"
      >
        {/* Profile Header */}
        <View style={styles.profileContainer}>
          {userProfile.profilePicture ? (
            <Image
              source={{ uri: userProfile.profilePicture }}
              style={styles.profileImage}
              accessible={true}
              accessibilityLabel="Profile picture"
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>
                {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <Text style={[styles.userName, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
            {userProfile.fullName || 'Welcome User'}
          </Text>
          <Text style={styles.userEmail}>
            {userProfile.email}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/edit-profile')}
            style={styles.editProfileButton}
            accessibilityLabel="Edit profile picture and basic details"
          >
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Settings Section */}
        {renderSectionHeader('Quick Settings', 'settings-outline', 'quickSettings', false)}
        <View style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
          {/* Text Size */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="text" size={24} color={Colors.secondary} />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                Text Size {'\n'}
                <Text style={{ fontSize: 12, color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }}>
                  {quickSettings.textSize <= 25 ? 'Small' :
                    quickSettings.textSize <= 50 ? 'Medium' :
                      quickSettings.textSize <= 75 ? 'Large' : 'Extra Large'}
                </Text>
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={25}
              value={quickSettings.textSize}
              onValueChange={(value) => handleQuickSettingChange('textSize', value)}
              maximumTrackTintColor={currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={currentTheme === 'light' ? Colors.black : Colors.white}
            />
          </View>

          {/* Voice Commands */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="keyboard-voice" size={24} color={Colors.secondary} />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                Voice Commands
              </Text>
            </View>
            <Switch
              value={quickSettings.voiceCommands}
              onValueChange={(value) => handleQuickSettingChange('voiceCommands', value)}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>

          {/* High Contrast */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="sunny" size={24} color={Colors.secondary} />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                High Contrast
              </Text>
            </View>
            <Switch
              value={quickSettings.highContrast}
              onValueChange={(value) => handleQuickSettingChange('highContrast', value)}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Text to Speech */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <MaterialCommunityIcons name="text-to-speech" size={24} color={Colors.secondary} />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                Text to Speech
              </Text>
            </View>
            <Switch
              value={quickSettings.textToSpeech}
              onValueChange={(value) => handleQuickSettingChange('textToSpeech', value)}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* App Settings Section */}
        {renderSectionHeader('App Settings', 'options-outline', 'appSettings', false)}
        <View style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons name="color-palette-outline" size={24} color={Colors.secondary} />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                Theme Settings {'\n'}
                <Text style={{ fontSize: 12, color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }}>
                  {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
                </Text>
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/notifications')}
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={24} color={Colors.secondary} />
              <Text style={[styles.settingLabel, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
                Notifications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Basic Information Section */}
        {renderSectionHeader('Basic Information', 'person-outline', 'basicInfo')}
        <View style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
          {editingSection === 'basicInfo' ? (
            <View>
              <Text style={{ color: Colors.info, fontSize: 16, marginBottom: 8 }}>
                You can edit your name, email, and phone number on the Edit Profile screen.
              </Text>
              <Text style={[styles.fieldLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Your Role
              </Text>
              <View style={styles.chipsContainer}>
                {userRoles.map((role) => (
                  <SelectableChip
                    key={role}
                    label={role === 'PWD' ? 'Person with Disability' : role.replace('_', ' ').toUpperCase()}
                    selected={basicInfo.role === role}
                    onPress={() => setBasicInfo(prev => ({ ...prev, role }))}
                  />
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Disability Types
              </Text>
              <View style={styles.chipsContainer}>
                {disabilityTypes.map((type) => (
                  <SelectableChip
                    key={type}
                    label={type}
                    selected={basicInfo.disabilityTypes.includes(type)}
                    onPress={() => {
                      const newTypes = basicInfo.disabilityTypes.includes(type)
                        ? basicInfo.disabilityTypes.filter(t => t !== type)
                        : [...basicInfo.disabilityTypes, type];
                      setBasicInfo(prev => ({ ...prev, disabilityTypes: newTypes }));
                    }}
                  />
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Preferred Contact Method
              </Text>
              <View style={styles.chipsContainer}>
                {contactMethods.map((method) => (
                  <SelectableChip
                    key={method}
                    label={method}
                    selected={basicInfo.preferredContactMethod === method}
                    onPress={() => setBasicInfo(prev => ({ ...prev, preferredContactMethod: method }))}
                  />
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Preferred Language
              </Text>
              <View style={styles.chipsContainer}>
                <SelectableChip
                  label="English"
                  selected={basicInfo.preferredLanguage === 'English'}
                  onPress={() => setBasicInfo(prev => ({ ...prev, preferredLanguage: 'English' }))}
                />
                <SelectableChip
                  label="Swahili"
                  selected={basicInfo.preferredLanguage === 'Swahili'}
                  onPress={() => setBasicInfo(prev => ({ ...prev, preferredLanguage: 'Swahili' }))}
                />
              </View>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setBasicInfo({
                      fullName: userProfile.fullName,
                      email: userProfile.email,
                      phone: userProfile.phone,
                      role: userProfile.role,
                      disabilityTypes: userProfile.disabilityTypes,
                      preferredContactMethod: userProfile.preferredContactMethod,
                      preferredLanguage: userProfile.preferredLanguage,
                    });
                    setEditingSection(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveBasicInfo}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <InfoRow label="Full Name" value={userProfile.fullName} />
              <InfoRow label="Email" value={userProfile.email.slice(0, 3) + '****@' + userProfile.email.split('@')[1]} />
              <InfoRow label="Phone" value={formatHiddenPhoneNumber(userProfile.phone)} />
              <InfoRow label="Role" value={userProfile.role === 'PWD' ? 'Person with Disability' : userProfile.role.replace('_', ' ')} />
              <InfoRow label="Disability Types" value={userProfile.disabilityTypes.join(', ') || 'None specified'} />
              <InfoRow label="Preferred Contact" value={userProfile.preferredContactMethod} />
              <InfoRow label="Language" value={userProfile.preferredLanguage} />
            </View>
          )}
        </View>

        {/* Care Network Section */}
        {renderSectionHeader('Care Network', 'people-outline', 'careNetwork')}
        <View style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
          {editingSection === 'careNetwork' ? (
            <View>
              <CareRelationshipForm
                relationships={careRelationships}
                onAddRelationship={(relationship) => setCareRelationships(prev => [...prev, relationship])}
                onRemoveRelationship={(id) => setCareRelationships(prev => prev.filter(r => r.id !== id))}
                onUpdateRelationship={(id, updates) => {
                  setCareRelationships(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
                }}
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setCareRelationships(userProfile.careRelationships);
                    setEditingSection(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveCareRelationships}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {userProfile.careRelationships.length > 0 ? (
                userProfile.careRelationships.map((relationship) => (
                  <View key={relationship.id} style={styles.contactSummary}>
                    <Text style={[styles.contactName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                      {relationship.name} {relationship.isPrimary && '(Primary)'}
                    </Text>
                    <Text style={styles.contactDetails}>
                      {relationship.relationship} • {formatHiddenPhoneNumber(relationship.phone)}
                    </Text>
                    {relationship.canBookForMe && (
                      <Text style={styles.permissionText}>Can book rides for you</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyState, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                  No care relationships added yet
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Emergency Contacts Section */}
        {renderSectionHeader('Emergency Contacts', 'warning-outline', 'emergencyContacts')}
        <View style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
          {editingSection === 'emergencyContacts' ? (
            <View>
              <EmergencyContactForm
                contacts={emergencyContacts}
                onAddContact={(contact) => setEmergencyContacts(prev => [...prev, contact])}
                onRemoveContact={(id) => setEmergencyContacts(prev => prev.filter(c => c.id !== id))}
                onUpdateContact={(id, updates) => {
                  setEmergencyContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
                }}
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setEmergencyContacts(userProfile.emergencyContacts);
                    setEditingSection(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveEmergencyContacts}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {userProfile.emergencyContacts.length > 0 ? (
                userProfile.emergencyContacts.map((contact) => (
                  <View key={contact.id} style={styles.contactSummary}>
                    <Text style={[styles.contactName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                      {contact.name} {contact.isPrimary && '(Primary)'}
                    </Text>
                    <Text style={styles.contactDetails}>
                      {contact.relationship} • {formatHiddenPhoneNumber(contact.phone)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyState, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                  No emergency contacts added yet
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Accessibility Preferences Section */}
        {renderSectionHeader('Accessibility Preferences', 'accessibility-outline', 'accessibility')}
        <View style={[styles.settingsCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray, borderColor: currentTheme === 'light' ? Colors.borderLight : Colors.borderDark }]}>
          {editingSection === 'accessibility' ? (
            <View>
              <AccessibilityPreferencesForm
                preferences={accessibilityPreferences}
                onUpdatePreferences={setAccessibilityPreferences}
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setAccessibilityPreferences(userProfile.accessibilityPreferences);
                    setEditingSection(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveAccessibilityPreferences}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={[styles.preferencesTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Mobility Needs
              </Text>
              <AccessibilityRow
                label="Wheelchair User"
                enabled={userProfile.accessibilityPreferences.mobility.useWheelchair}
              />
              <AccessibilityRow
                label="Needs Ramp Access"
                enabled={userProfile.accessibilityPreferences.mobility.needsRamp}
              />
              <AccessibilityRow
                label="Uses Assistive Devices"
                enabled={userProfile.accessibilityPreferences.mobility.needsAssistiveDevice}
              />

              <Text style={[styles.preferencesTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Visual Needs
              </Text>
              <AccessibilityRow
                label="Blind or Low Vision"
                enabled={userProfile.accessibilityPreferences.visual.isBlind || userProfile.accessibilityPreferences.visual.hasLowVision}
              />
              <AccessibilityRow
                label="Needs Large Text"
                enabled={userProfile.accessibilityPreferences.visual.needsLargeText}
              />
              <AccessibilityRow
                label="High Contrast Mode"
                enabled={userProfile.accessibilityPreferences.visual.needsHighContrast}
              />

              <Text style={[styles.preferencesTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Hearing Needs
              </Text>
              <AccessibilityRow
                label="Deaf or Hard of Hearing"
                enabled={userProfile.accessibilityPreferences.hearing.isDeaf || userProfile.accessibilityPreferences.hearing.hasHearingLoss}
              />
              <AccessibilityRow
                label="Needs Sign Language"
                enabled={userProfile.accessibilityPreferences.hearing.needsSignLanguage}
              />

              <Text style={[styles.preferencesTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Cognitive Needs
              </Text>
              <AccessibilityRow
                label="Needs Simple Instructions"
                enabled={userProfile.accessibilityPreferences.cognitive.needsSimpleInstructions}
              />
              <AccessibilityRow
                label="Needs Extra Time"
                enabled={userProfile.accessibilityPreferences.cognitive.needsExtraTime}
              />
            </View>
          )}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </>
  );
}

// Helper components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const AccessibilityRow = ({ label, enabled }: { label: string; enabled: boolean }) => (
  <View style={styles.accessibilityRow}>
    <Text style={styles.accessibilityLabel}>{label}</Text>
    <View style={[styles.accessibilityIndicator, enabled && styles.accessibilityIndicatorActive]}>
      <Text style={[styles.accessibilityStatus, enabled && styles.accessibilityStatusActive]}>
        {enabled ? 'Yes' : 'No'}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profilePlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.accent,
    marginBottom: 16,
  },
  editProfileButton: {
    padding: 8,
  },
  editProfile: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  editButton: {
    padding: 8,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
  },
  cancelButtonText: {
    color: Colors.accent,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.accent,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  contactSummary: {
    paddingVertical: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDetails: {
    fontSize: 14,
    color: Colors.accent,
    marginBottom: 2,
  },
  permissionText: {
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  emptyState: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 24,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  accessibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accessibilityLabel: {
    fontSize: 14,
    color: Colors.accent,
    flex: 1,
  },
  accessibilityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
  },
  accessibilityIndicatorActive: {
    backgroundColor: Colors.primary,
  },
  accessibilityStatus: {
    fontSize: 12,
    color: Colors.accent,
  },
  accessibilityStatusActive: {
    color: Colors.white,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  slider: {
    width: 120,
    height: 40,
  },
});
