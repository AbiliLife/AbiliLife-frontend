import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { ServicePreferences, ServiceProvider, VehicleType, DriverGender } from '@/types/onboard';

interface Props {
  preferences: ServicePreferences;
  onUpdatePreferences: (preferences: ServicePreferences) => void;
  currentTheme: 'light' | 'dark';
}

const serviceProviders: { value: ServiceProvider; label: string }[] = [
  { value: 'ACE_MOBILITY', label: 'Ace Mobility' },
  { value: 'BAMM_TOURS', label: 'Bamm Tours' },
  { value: 'ACCESSIBLE_TRAVEL', label: 'Accessible Travel' },
  { value: 'OTHER', label: 'Other' },
];

const vehicleTypes: { value: VehicleType; label: string; description: string }[] = [
  { value: 'WHEELCHAIR_ACCESSIBLE', label: 'Wheelchair Accessible', description: 'Vehicles with ramps or lifts' },
  { value: 'MODIFIED', label: 'Modified Vehicle', description: 'Vehicles with special modifications' },
  { value: 'REGULAR', label: 'Regular Vehicle', description: 'Standard vehicles' },
  { value: 'ANY', label: 'Any Vehicle', description: 'No specific requirements' },
];

const driverGenderOptions: { value: DriverGender; label: string }[] = [
  { value: 'NO_PREFERENCE', label: 'No Preference' },
  { value: 'MALE', label: 'Male Driver' },
  { value: 'FEMALE', label: 'Female Driver' },
];

const ServicePreferencesForm: React.FC<Props> = ({
  preferences,
  onUpdatePreferences,
  currentTheme
}) => {
  const updatePreference = (key: keyof ServicePreferences, value: any) => {
    const newPreferences = {
      ...preferences,
      [key]: value
    };
    onUpdatePreferences(newPreferences);
  };

  const toggleProvider = (provider: ServiceProvider) => {
    const currentProviders = preferences.preferredProviders;
    const newProviders = currentProviders.includes(provider)
      ? currentProviders.filter(p => p !== provider)
      : [...currentProviders, provider];
    updatePreference('preferredProviders', newProviders);
  };

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
      <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.mainTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
        Service Preferences
      </Text>
      <Text style={[styles.mainSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
        Customize your transportation experience
      </Text>

      {/* Preferred Providers */}
      <View style={[styles.section, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
        <SectionHeader title="Preferred Service Providers" icon="business-outline" />
        <Text style={[styles.sectionDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
          Select your preferred transportation providers (you can choose multiple)
        </Text>
        
        {serviceProviders.map((provider) => (
          <TouchableOpacity
            key={provider.value}
            style={[
              styles.providerChip,
              preferences.preferredProviders.includes(provider.value) && styles.providerChipActive,
              { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray }
            ]}
            onPress={() => toggleProvider(provider.value)}
          >
            <Text style={[
              styles.providerChipText,
              preferences.preferredProviders.includes(provider.value) && styles.providerChipTextActive,
              { color: currentTheme === 'light' ? Colors.black : Colors.white }
            ]}>
              {provider.label}
            </Text>
            {preferences.preferredProviders.includes(provider.value) && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Vehicle Type */}
      <View style={[styles.section, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
        <SectionHeader title="Vehicle Type" icon="car-outline" />
        <Text style={[styles.sectionDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
          What type of vehicle do you need?
        </Text>
        
        {vehicleTypes.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.value}
            style={[
              styles.optionCard,
              preferences.vehicleType === vehicle.value && styles.optionCardActive,
              { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray }
            ]}
            onPress={() => updatePreference('vehicleType', vehicle.value)}
          >
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionTitle,
                preferences.vehicleType === vehicle.value && styles.optionTitleActive,
                { color: currentTheme === 'light' ? Colors.black : Colors.white }
              ]}>
                {vehicle.label}
              </Text>
              <Text style={[
                styles.optionDescription,
                { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }
              ]}>
                {vehicle.description}
              </Text>
            </View>
            {preferences.vehicleType === vehicle.value && (
              <Ionicons name="radio-button-on" size={24} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Driver Preferences */}
      <View style={[styles.section, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
        <SectionHeader title="Driver Preferences" icon="person-outline" />
        
        <Text style={[styles.preferenceLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
          Driver Gender Preference
        </Text>
        <View style={styles.genderOptions}>
          {driverGenderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderChip,
                preferences.driverGender === option.value && styles.genderChipActive,
                { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray }
              ]}
              onPress={() => updatePreference('driverGender', option.value)}
            >
              <Text style={[
                styles.genderChipText,
                preferences.driverGender === option.value && styles.genderChipTextActive,
                { color: currentTheme === 'light' ? Colors.black : Colors.white }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Additional Preferences */}
      <View style={[styles.section, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
        <SectionHeader title="Additional Preferences" icon="settings-outline" />
        
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={[styles.switchTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
              Allow Companion
            </Text>
            <Text style={[styles.switchSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
              Can travel with a companion or caregiver
            </Text>
          </View>
          <Switch
            value={preferences.allowCompanion}
            onValueChange={(value) => updatePreference('allowCompanion', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={preferences.allowCompanion ? Colors.white : Colors.accent}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={[styles.switchTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
              Allow Pets
            </Text>
            <Text style={[styles.switchSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
              Can travel with service animals or pets
            </Text>
          </View>
          <Switch
            value={preferences.allowPets}
            onValueChange={(value) => updatePreference('allowPets', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={preferences.allowPets ? Colors.white : Colors.accent}
          />
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={[styles.instructionsLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
            Special Instructions (Optional)
          </Text>
          <TextInput
            style={[styles.instructionsInput, { 
              color: currentTheme === 'light' ? Colors.black : Colors.white,
              backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray
            }]}
            placeholder="Any special instructions for drivers..."
            placeholderTextColor={Colors.accent}
            value={preferences.specialInstructions || ''}
            onChangeText={(text) => updatePreference('specialInstructions', text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  providerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  providerChipActive: {
    backgroundColor: Colors.primary,
  },
  providerChipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  providerChipTextActive: {
    color: Colors.white,
  },
  checkIcon: {
    marginLeft: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionCardActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionTitleActive: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: 13,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genderChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 4,
  },
  genderChipActive: {
    backgroundColor: Colors.primary,
  },
  genderChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  genderChipTextActive: {
    color: Colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  switchText: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  switchSubtitle: {
    fontSize: 13,
  },
  instructionsContainer: {
    marginTop: 16,
  },
  instructionsLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  instructionsInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
});

export default ServicePreferencesForm;
