import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { AccessibilityPreferences } from '@/types/onboard';

import Colors from '@/constants/Colors';

import { ThemeContext } from '@/contexts/ThemeContext';

import FormField from '@/components/common/FormField';

interface Props {
  preferences: AccessibilityPreferences;
  onUpdatePreferences: (preferences: AccessibilityPreferences) => void;
}

const AccessibilityPreferencesForm: React.FC<Props> = ({
  preferences,
  onUpdatePreferences,
}) => {
  const { currentTheme } = useContext(ThemeContext);

  // Update functions for each preference category
  // These functions will merge the existing preferences with the updates provided
  const updateMobilityPrefs = (updates: Partial<AccessibilityPreferences['mobility']>) => {
    onUpdatePreferences({
      ...preferences,
      mobility: { ...preferences.mobility, ...updates }
    });
  };

  const updateVisualPrefs = (updates: Partial<AccessibilityPreferences['visual']>) => {
    onUpdatePreferences({
      ...preferences,
      visual: { ...preferences.visual, ...updates }
    });
  };

  const updateHearingPrefs = (updates: Partial<AccessibilityPreferences['hearing']>) => {
    onUpdatePreferences({
      ...preferences,
      hearing: { ...preferences.hearing, ...updates }
    });
  };

  const updateCognitivePrefs = (updates: Partial<AccessibilityPreferences['cognitive']>) => {
    onUpdatePreferences({
      ...preferences,
      cognitive: { ...preferences.cognitive, ...updates }
    });
  };


  // Components for rendering each section and switch
  // These components will be used to structure the form and make it more readable
  const PreferenceSection = ({
    title,
    icon,
    children // The children will be the switches and fields for each section
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <View style={[styles.section, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel={title}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

  const PreferenceSwitch = ({
    label,
    value,
    onValueChange,
    description
  }: {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    description?: string;
  }) => (
    <View style={styles.switchContainer} accessible={true}>
      <View style={styles.switchTextContainer}>
        <Text style={[styles.switchLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={label}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.switchDescription, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel={description}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.lightGray, true: Colors.primary }}
        thumbColor={value ? Colors.white : Colors.mediumGray}
        accessible={true}
        accessibilityRole="switch"
        accessibilityLabel={`${label} switch`}
        accessibilityHint='Toggle this switch to enable or disable the preference'
        accessibilityState={{ checked: value }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.mainTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Accessibility Preferences">
        Accessibility Preferences
      </Text>
      <Text style={[styles.mainSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Help us understand your specific needs to provide better services">
        Help us understand your specific needs to provide better services
      </Text>

      {/* Mobility Section */}
      <PreferenceSection
        title="Mobility Needs"
        icon={<MaterialCommunityIcons name="wheelchair-accessibility" size={24} color={Colors.primary} />}
      >
        <PreferenceSwitch
          label="I use a wheelchair"
          value={preferences.mobility.useWheelchair}
          onValueChange={(value) => updateMobilityPrefs({ useWheelchair: value })}
          description="Vehicle needs wheelchair accessibility"
        />

        <PreferenceSwitch
          label="I need ramp access"
          value={preferences.mobility.needsRamp}
          onValueChange={(value) => updateMobilityPrefs({ needsRamp: value })}
          description="Accessible entry/exit required"
        />

        <PreferenceSwitch
          label="I use assistive devices"
          value={preferences.mobility.needsAssistiveDevice}
          onValueChange={(value) => updateMobilityPrefs({ needsAssistiveDevice: value })}
          description="Walker, crutches, or other mobility aids"
        />

        {preferences.mobility.needsAssistiveDevice && (
          <FormField
            type="text"
            title="Device Type (Optional)"
            placeholder="e.g., Walker, Crutches, Cane"
            value={preferences.mobility.deviceType || ''}
            onChangeText={(text: string) => updateMobilityPrefs({ deviceType: text })}
            otherStyles={styles.deviceTypeField}
          />
        )}

        <PreferenceSwitch
          label="I need transfer assistance"
          value={preferences.mobility.transferAssistance}
          onValueChange={(value) => updateMobilityPrefs({ transferAssistance: value })}
          description="Help moving from wheelchair to vehicle seat"
        />
      </PreferenceSection>

      {/* Visual Section */}
      <PreferenceSection
        title="Visual Needs"
        icon={<Ionicons name="eye-outline" size={24} color={Colors.primary} />}
      >
        <PreferenceSwitch
          label="I am blind"
          value={preferences.visual.isBlind}
          onValueChange={(value) => updateVisualPrefs({ isBlind: value })}
          description="Requires audio guidance and assistance"
        />

        <PreferenceSwitch
          label="I have low vision"
          value={preferences.visual.hasLowVision}
          onValueChange={(value) => updateVisualPrefs({ hasLowVision: value })}
          description="May need extra lighting or assistance"
        />

        <PreferenceSwitch
          label="I need large text"
          value={preferences.visual.needsLargeText}
          onValueChange={(value) => updateVisualPrefs({ needsLargeText: value })}
          description="Increases text size in the app"
        />

        <PreferenceSwitch
          label="I need high contrast"
          value={preferences.visual.needsHighContrast}
          onValueChange={(value) => updateVisualPrefs({ needsHighContrast: value })}
          description="Enhanced color contrast for better visibility"
        />

        <PreferenceSwitch
          label="I have a guide animal"
          value={preferences.visual.hasGuideAnimal}
          onValueChange={(value) => updateVisualPrefs({ hasGuideAnimal: value })}
          description="Service animal accommodation needed"
        />
      </PreferenceSection>

      {/* Hearing Section */}
      <PreferenceSection
        title="Hearing Needs"
        icon={<MaterialCommunityIcons name="ear-hearing" size={24} color={Colors.primary} />}
      >
        <PreferenceSwitch
          label="I am deaf"
          value={preferences.hearing.isDeaf}
          onValueChange={(value) => updateHearingPrefs({ isDeaf: value })}
          description="Requires visual communication methods"
        />

        <PreferenceSwitch
          label="I have hearing loss"
          value={preferences.hearing.hasHearingLoss}
          onValueChange={(value) => updateHearingPrefs({ hasHearingLoss: value })}
          description="May need louder audio or repetition"
        />

        <PreferenceSwitch
          label="I use sign language"
          value={preferences.hearing.needsSignLanguage}
          onValueChange={(value) => updateHearingPrefs({ needsSignLanguage: value })}
          description="Preferred communication method"
        />

        <PreferenceSwitch
          label="I use hearing aids"
          value={preferences.hearing.hasHearingAid}
          onValueChange={(value) => updateHearingPrefs({ hasHearingAid: value })}
          description="May be sensitive to certain sounds"
        />

        <PreferenceSwitch
          label="I prefer written communication"
          value={preferences.hearing.needsWrittenCommunication}
          onValueChange={(value) => updateHearingPrefs({ needsWrittenCommunication: value })}
          description="Text messages instead of calls"
        />
      </PreferenceSection>

      {/* Cognitive Section */}
      <PreferenceSection
        title="Cognitive Needs"
        icon={<MaterialCommunityIcons name="brain" size={24} color={Colors.primary} />}
      >
        <PreferenceSwitch
          label="I need simple instructions"
          value={preferences.cognitive.needsSimpleInstructions}
          onValueChange={(value) => updateCognitivePrefs({ needsSimpleInstructions: value })}
          description="Clear, step-by-step guidance"
        />

        <PreferenceSwitch
          label="I need extra time"
          value={preferences.cognitive.needsExtraTime}
          onValueChange={(value) => updateCognitivePrefs({ needsExtraTime: value })}
          description="Allow additional time for processes"
        />

        <PreferenceSwitch
          label="I have memory support needs"
          value={preferences.cognitive.hasMemorySupport}
          onValueChange={(value) => updateCognitivePrefs({ hasMemorySupport: value })}
          description="Reminders and confirmation needed"
        />

        <PreferenceSwitch
          label="I need a companion"
          value={preferences.cognitive.needsCompanion}
          onValueChange={(value) => updateCognitivePrefs({ needsCompanion: value })}
          description="Travel with a care companion"
        />
      </PreferenceSection>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  deviceTypeField: {
    marginVertical: 8,
    marginLeft: 16,
  },
});

export default AccessibilityPreferencesForm;
