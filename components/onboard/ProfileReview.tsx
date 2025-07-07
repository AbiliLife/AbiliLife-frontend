import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { UserProfile } from '@/types/onboard';

interface Props {
  profile: UserProfile;
  currentTheme: 'light' | 'dark';
  onEditSection: (section: string) => void;
}

const ProfileReview: React.FC<Props> = ({
  profile,
  currentTheme,
  onEditSection
}) => {
  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 8; // Total sections

    // Basic Info (required)
    if (profile.fullName && profile.phone) completed++;
    
    // Role & Relationships
    if (profile.role) completed++;
    
    // Emergency Contacts
    if (profile.emergencyContacts.length > 0) completed++;
    
    // Accessibility Preferences
    const hasAccessibilityPrefs = 
      profile.accessibilityPreferences.mobility.useWheelchair ||
      profile.accessibilityPreferences.visual.isBlind ||
      profile.accessibilityPreferences.hearing.isDeaf ||
      profile.accessibilityPreferences.cognitive.needsSimpleInstructions;
    if (hasAccessibilityPrefs) completed++;
    
    // Service Preferences
    if (profile.servicePreferences.vehicleType) completed++;
    
    // Communication Preferences
    if (profile.communicationPreferences.preferredLanguage) completed++;
    
    // Billing Information
    if (profile.billingInformation.preferredPaymentMethods.length > 0) completed++;
    
    // Notification Preferences
    completed++; // Always completed as it has defaults
    
    return Math.round((completed / total) * 100);
  };

  const ReviewSection = ({ 
    title, 
    icon, 
    onEdit, 
    children 
  }: { 
    title: string; 
    icon: string; 
    onEdit: () => void; 
    children: React.ReactNode; 
  }) => (
    <View style={[styles.reviewSection, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name={icon as any} size={20} color={Colors.primary} />
          <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
            {title}
          </Text>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
          <Text style={[styles.editButtonText, { color: Colors.primary }]}>Edit</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
        {value}
      </Text>
    </View>
  );

  const TagList = ({ tags }: { tags: string[] }) => (
    <View style={styles.tagContainer}>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );

  const completionPercentage = getCompletionPercentage();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.mainTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
        Profile Review
      </Text>
      <Text style={[styles.mainSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
        Review your information before completing setup
      </Text>

      {/* Completion Progress */}
      <View style={[styles.progressContainer, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
            Profile Completion
          </Text>
          <Text style={[styles.progressPercentage, { color: Colors.primary }]}>
            {completionPercentage}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
        </View>
      </View>

      {/* Basic Information */}
      <ReviewSection
        title="Basic Information"
        icon="person-outline"
        onEdit={() => onEditSection('basic')}
      >
        <InfoRow label="Full Name" value={profile.fullName || 'Not provided'} />
        <InfoRow label="Email" value={profile.email || 'Not provided'} />
        <InfoRow label="Phone" value={profile.phone || 'Not provided'} />
        <InfoRow label="Role" value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1).replace('_', ' ')} />
        <InfoRow label="Preferred Language" value={profile.preferredLanguage} />
        <InfoRow label="Contact Method" value={profile.preferredContactMethod} />
      </ReviewSection>

      {/* Care Network */}
      <ReviewSection
        title="Care Network"
        icon="people-outline"
        onEdit={() => onEditSection('caregivers')}
      >
        {profile.careRelationships.length > 0 ? (
          profile.careRelationships.map((caregiver, index) => (
            <View key={index} style={styles.caregiverItem}>
              <Text style={[styles.caregiverName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                {caregiver.name}
              </Text>
              <Text style={[styles.caregiverDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                {caregiver.relationship} • {caregiver.phone}
                {caregiver.canBookForMe && ' • Can book rides'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyState, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
            No caregivers added
          </Text>
        )}
      </ReviewSection>

      {/* Emergency Contacts */}
      <ReviewSection
        title="Emergency Contacts"
        icon="call-outline"
        onEdit={() => onEditSection('emergency')}
      >
        {profile.emergencyContacts.length > 0 ? (
          profile.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <Text style={[styles.contactName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                {contact.name} {contact.isPrimary && '(Primary)'}
              </Text>
              <Text style={[styles.contactDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                {contact.relationship} • {contact.phone}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyState, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
            No emergency contacts added
          </Text>
        )}
      </ReviewSection>

      {/* Accessibility Preferences */}
      <ReviewSection
        title="Accessibility Preferences"
        icon="accessibility-outline"
        onEdit={() => onEditSection('accessibility')}
      >
        <View style={styles.accessibilitySection}>
          <Text style={[styles.accessibilityTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
            Mobility
          </Text>
          <TagList tags={[
            ...(profile.accessibilityPreferences.mobility.useWheelchair ? ['Wheelchair User'] : []),
            ...(profile.accessibilityPreferences.mobility.needsRamp ? ['Needs Ramp'] : []),
            ...(profile.accessibilityPreferences.mobility.needsAssistiveDevice ? ['Uses Assistive Device'] : []),
            ...(profile.accessibilityPreferences.mobility.transferAssistance ? ['Transfer Assistance'] : []),
          ]} />
        </View>

        <View style={styles.accessibilitySection}>
          <Text style={[styles.accessibilityTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
            Visual
          </Text>
          <TagList tags={[
            ...(profile.accessibilityPreferences.visual.isBlind ? ['Blind'] : []),
            ...(profile.accessibilityPreferences.visual.hasLowVision ? ['Low Vision'] : []),
            ...(profile.accessibilityPreferences.visual.needsLargeText ? ['Large Text'] : []),
            ...(profile.accessibilityPreferences.visual.needsHighContrast ? ['High Contrast'] : []),
            ...(profile.accessibilityPreferences.visual.hasGuideAnimal ? ['Guide Animal'] : []),
          ]} />
        </View>

        <View style={styles.accessibilitySection}>
          <Text style={[styles.accessibilityTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
            Hearing
          </Text>
          <TagList tags={[
            ...(profile.accessibilityPreferences.hearing.isDeaf ? ['Deaf'] : []),
            ...(profile.accessibilityPreferences.hearing.hasHearingLoss ? ['Hearing Loss'] : []),
            ...(profile.accessibilityPreferences.hearing.needsSignLanguage ? ['Sign Language'] : []),
            ...(profile.accessibilityPreferences.hearing.hasHearingAid ? ['Hearing Aid'] : []),
            ...(profile.accessibilityPreferences.hearing.needsWrittenCommunication ? ['Written Communication'] : []),
          ]} />
        </View>

        <View style={styles.accessibilitySection}>
          <Text style={[styles.accessibilityTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
            Cognitive
          </Text>
          <TagList tags={[
            ...(profile.accessibilityPreferences.cognitive.needsSimpleInstructions ? ['Simple Instructions'] : []),
            ...(profile.accessibilityPreferences.cognitive.needsExtraTime ? ['Extra Time'] : []),
            ...(profile.accessibilityPreferences.cognitive.hasMemorySupport ? ['Memory Support'] : []),
            ...(profile.accessibilityPreferences.cognitive.needsCompanion ? ['Needs Companion'] : []),
          ]} />
        </View>
      </ReviewSection>

      {/* Service Preferences */}
      <ReviewSection
        title="Service Preferences"
        icon="car-outline"
        onEdit={() => onEditSection('services')}
      >
        <InfoRow label="Vehicle Type" value={profile.servicePreferences.vehicleType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} />
        <InfoRow label="Driver Gender" value={profile.servicePreferences.driverGender.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} />
        <InfoRow label="Allow Companion" value={profile.servicePreferences.allowCompanion ? 'Yes' : 'No'} />
        <InfoRow label="Allow Pets" value={profile.servicePreferences.allowPets ? 'Yes' : 'No'} />
        {profile.servicePreferences.specialInstructions && (
          <InfoRow label="Special Instructions" value={profile.servicePreferences.specialInstructions} />
        )}
      </ReviewSection>

      {/* Payment Methods */}
      <ReviewSection
        title="Payment & Billing"
        icon="card-outline"
        onEdit={() => onEditSection('billing')}
      >
        <InfoRow label="Payment Methods" value={profile.billingInformation.preferredPaymentMethods.join(', ')} />
        <InfoRow label="Has Insurance" value={profile.billingInformation.hasInsurance ? 'Yes' : 'No'} />
        <InfoRow label="Has Disability Vouchers" value={profile.billingInformation.hasDisabilityVouchers ? 'Yes' : 'No'} />
      </ReviewSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  progressContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  reviewSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 14,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  caregiverItem: {
    marginBottom: 8,
  },
  caregiverName: {
    fontSize: 15,
    fontWeight: '600',
  },
  caregiverDetails: {
    fontSize: 13,
    marginTop: 2,
  },
  contactItem: {
    marginBottom: 8,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactDetails: {
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  accessibilitySection: {
    marginBottom: 16,
  },
  accessibilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 2,
  },
  tagText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProfileReview;
