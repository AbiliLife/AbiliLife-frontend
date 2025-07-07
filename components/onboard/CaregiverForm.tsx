import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';
import { CareRelationship, RelationshipType } from '@/types/onboard';

// Simple UUID generator for React Native
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface Props {
  careRelationships: CareRelationship[];
  onAddCaregiver: (caregiver: CareRelationship) => void;
  onRemoveCaregiver: (id: string) => void;
  onUpdateCaregiver: (id: string, caregiver: Partial<CareRelationship>) => void;
  currentTheme: 'light' | 'dark';
}

const relationshipTypes: RelationshipType[] = [
  'parent', 'child', 'sibling', 'spouse', 'caregiver', 'friend', 'guardian', 'other'
];

const CaregiverForm: React.FC<Props> = ({
  careRelationships,
  onAddCaregiver,
  onRemoveCaregiver,
  onUpdateCaregiver,
  currentTheme
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCaregiver, setNewCaregiver] = useState({
    name: '',
    relationship: 'caregiver' as RelationshipType,
    phone: '',
    email: '',
    canBookForMe: false,
  });

  const handleAddCaregiver = () => {
    if (!newCaregiver.name.trim() || !newCaregiver.phone.trim()) {
      Alert.alert('Error', 'Please fill in at least name and phone number');
      return;
    }

    const caregiver: CareRelationship = {
      id: generateId(),
      name: newCaregiver.name.trim(),
      relationship: newCaregiver.relationship,
      phone: newCaregiver.phone.trim(),
      email: newCaregiver.email.trim() || undefined,
      canBookForMe: newCaregiver.canBookForMe,
      isPrimary: careRelationships.length === 0, // First caregiver is primary
    };

    onAddCaregiver(caregiver);
    setNewCaregiver({ name: '', relationship: 'caregiver', phone: '', email: '', canBookForMe: false });
    setShowAddForm(false);
  };

  const toggleBookingPermission = (id: string, canBook: boolean) => {
    onUpdateCaregiver(id, { canBookForMe: canBook });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
        Care Network
      </Text>
      <Text style={[styles.sectionSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
        Add people who can help you book rides and provide care support
      </Text>

      {/* Existing Caregivers */}
      {careRelationships.map((caregiver) => (
        <View key={caregiver.id} style={[styles.caregiverCard, { 
          backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray,
          borderColor: caregiver.isPrimary ? Colors.primary : Colors.lightGray
        }]}>
          <View style={styles.caregiverHeader}>
            <View style={styles.caregiverInfo}>
              <Text style={[styles.caregiverName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                {caregiver.name}
              </Text>
              <Text style={[styles.caregiverDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                {caregiver.relationship} • {caregiver.phone}
              </Text>
              {caregiver.email && (
                <Text style={[styles.caregiverDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                  {caregiver.email}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => onRemoveCaregiver(caregiver.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
              Can book rides for me
            </Text>
            <Switch
              value={caregiver.canBookForMe}
              onValueChange={(value) => toggleBookingPermission(caregiver.id, value)}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={caregiver.canBookForMe ? Colors.white : Colors.accent}
            />
          </View>
        </View>
      ))}

      {/* Add Caregiver Form */}
      {showAddForm ? (
        <View style={[styles.addForm, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
          <FormField
            type='text'
            title="Name"
            placeholder="Enter caregiver name"
            value={newCaregiver.name}
            onChangeText={(text) => setNewCaregiver(prev => ({ ...prev, name: text }))}
          />
          
          <FormField
            type='phone'
            title="Phone"
            placeholder="Enter phone number"
            value={newCaregiver.phone}
            onChangeText={(text) => setNewCaregiver(prev => ({ ...prev, phone: text }))}
          />
          
          <FormField
            type='email'
            title="Email (Optional)"
            placeholder="Enter email address"
            value={newCaregiver.email}
            onChangeText={(text) => setNewCaregiver(prev => ({ ...prev, email: text }))}
          />

          {/* Relationship Selector */}
          <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
            Relationship
          </Text>
          <View style={styles.relationshipGrid}>
            {relationshipTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.relationshipChip,
                  newCaregiver.relationship === type && styles.relationshipChipActive,
                  { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray }
                ]}
                onPress={() => setNewCaregiver(prev => ({ ...prev, relationship: type }))}
              >
                <Text style={[
                  styles.relationshipChipText,
                  newCaregiver.relationship === type && styles.relationshipChipTextActive,
                  { color: currentTheme === 'light' ? Colors.black : Colors.white }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Booking Permission */}
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
              Can book rides for me
            </Text>
            <Switch
              value={newCaregiver.canBookForMe}
              onValueChange={(value) => setNewCaregiver(prev => ({ ...prev, canBookForMe: value }))}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={newCaregiver.canBookForMe ? Colors.white : Colors.accent}
            />
          </View>

          <View style={styles.formActions}>
            <CustomButton
              title="Cancel"
              handlePress={() => setShowAddForm(false)}
              containerStyle={[styles.actionButton, styles.cancelButton]}
              textStyle={styles.cancelButtonText}
            />
            <CustomButton
              title="Add Caregiver"
              handlePress={handleAddCaregiver}
              containerStyle={[styles.actionButton, styles.addButton]}
            />
          </View>
        </View>
      ) : (
        <CustomButton
          title="+ Add Caregiver"
          handlePress={() => setShowAddForm(true)}
          containerStyle={styles.addCaregiverButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  caregiverCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  caregiverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  caregiverDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  removeButton: {
    padding: 4,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  permissionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  addForm: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  relationshipChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  relationshipChipActive: {
    backgroundColor: Colors.primary,
  },
  relationshipChipText: {
    fontSize: 14,
  },
  relationshipChipTextActive: {
    color: Colors.white,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
  },
  cancelButtonText: {
    color: Colors.accent,
  },
  addButton: {
    backgroundColor: Colors.primary,
  },
  addCaregiverButton: {
    backgroundColor: Colors.secondary,
  },
});

export default CaregiverForm;
