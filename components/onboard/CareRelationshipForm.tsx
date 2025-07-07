import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { v4 as uuidv4 } from 'uuid';

import Colors from '@/constants/Colors';
import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';
import { CareRelationship, RelationshipType } from '@/types/onboard';

interface Props {
  relationships: CareRelationship[];
  onAddRelationship: (relationship: CareRelationship) => void;
  onRemoveRelationship: (id: string) => void;
  onUpdateRelationship: (id: string, relationship: Partial<CareRelationship>) => void;
  currentTheme: 'light' | 'dark';
}

const relationshipTypes: RelationshipType[] = [
  'parent', 'child', 'sibling', 'spouse', 'caregiver', 'friend', 'guardian', 'other'
];

const CareRelationshipForm: React.FC<Props> = ({
  relationships,
  onAddRelationship,
  onRemoveRelationship,
  onUpdateRelationship,
  currentTheme
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    name: '',
    relationship: 'caregiver' as RelationshipType,
    phone: '',
    email: '',
    canBookForMe: true,
  });

  const handleAddRelationship = () => {
    if (!newRelationship.name.trim() || !newRelationship.phone.trim()) {
      Alert.alert('Error', 'Please fill in at least name and phone number');
      return;
    }

    const relationship: CareRelationship = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2), // Simple ID generator
      name: newRelationship.name.trim(),
      relationship: newRelationship.relationship,
      phone: newRelationship.phone.trim(),
      email: newRelationship.email.trim() || undefined,
      canBookForMe: newRelationship.canBookForMe,
      isPrimary: relationships.length === 0, // First relationship is primary
    };

    onAddRelationship(relationship);
    setNewRelationship({ name: '', relationship: 'caregiver', phone: '', email: '', canBookForMe: true });
    setShowAddForm(false);
  };

  const togglePrimary = (id: string) => {
    // Set all to non-primary first
    relationships.forEach(relationship => {
      if (relationship.isPrimary) {
        onUpdateRelationship(relationship.id, { isPrimary: false });
      }
    });
    // Set selected as primary
    onUpdateRelationship(id, { isPrimary: true });
  };

  const toggleBookingPermission = (id: string, canBook: boolean) => {
    onUpdateRelationship(id, { canBookForMe: canBook });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
        Care Network
      </Text>
      <Text style={[styles.sectionSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
        Add people who can help you book rides and make decisions on your behalf
      </Text>

      {/* Existing Relationships */}
      {relationships.map((relationship) => (
        <View key={relationship.id} style={[styles.relationshipCard, { 
          backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray,
          borderColor: relationship.isPrimary ? Colors.primary : Colors.lightGray
        }]}>
          <View style={styles.relationshipHeader}>
            <View style={styles.relationshipInfo}>
              <Text style={[styles.relationshipName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                {relationship.name}
              </Text>
              <Text style={[styles.relationshipDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                {relationship.relationship} • {relationship.phone}
              </Text>
              {relationship.email && (
                <Text style={[styles.relationshipDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                  {relationship.email}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => onRemoveRelationship(relationship.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.relationshipActions}>
            <TouchableOpacity
              onPress={() => togglePrimary(relationship.id)}
              style={[styles.primaryButton, relationship.isPrimary && styles.primaryButtonActive]}
            >
              <Text style={[styles.primaryButtonText, relationship.isPrimary && styles.primaryButtonTextActive]}>
                {relationship.isPrimary ? 'Primary Contact' : 'Set as Primary'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.permissionContainer}>
              <Text style={[styles.permissionLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                Can book rides for me
              </Text>
              <Switch
                value={relationship.canBookForMe}
                onValueChange={(value) => toggleBookingPermission(relationship.id, value)}
                trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                thumbColor={relationship.canBookForMe ? Colors.white : Colors.mediumGray}
              />
            </View>
          </View>
        </View>
      ))}

      {/* Add Relationship Form */}
      {showAddForm ? (
        <View style={[styles.addForm, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
          <FormField
            type="text"
            title="Name"
            placeholder="Enter contact name"
            value={newRelationship.name}
            onChangeText={(text) => setNewRelationship(prev => ({ ...prev, name: text }))}
          />
          
          <FormField
            type="phone"
            title="Phone"
            placeholder="Enter phone number"
            value={newRelationship.phone}
            onChangeText={(text) => setNewRelationship(prev => ({ ...prev, phone: text }))}
          />
          
          <FormField
            type="email"
            title="Email (Optional)"
            placeholder="Enter email address"
            value={newRelationship.email}
            onChangeText={(text) => setNewRelationship(prev => ({ ...prev, email: text }))}
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
                  newRelationship.relationship === type && styles.relationshipChipActive,
                  { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray }
                ]}
                onPress={() => setNewRelationship(prev => ({ ...prev, relationship: type }))}
              >
                <Text style={[
                  styles.relationshipChipText,
                  newRelationship.relationship === type && styles.relationshipChipTextActive,
                  { color: currentTheme === 'light' ? Colors.black : Colors.white }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Booking Permission */}
          <View style={styles.permissionContainer}>
            <Text style={[styles.permissionLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
              Can book rides for me
            </Text>
            <Switch
              value={newRelationship.canBookForMe}
              onValueChange={(value) => setNewRelationship(prev => ({ ...prev, canBookForMe: value }))}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={newRelationship.canBookForMe ? Colors.white : Colors.mediumGray}
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
              title="Add Contact"
              handlePress={handleAddRelationship}
              containerStyle={[styles.actionButton, styles.addButton]}
            />
          </View>
        </View>
      ) : (
        <CustomButton
          title="+ Add Care Contact"
          handlePress={() => setShowAddForm(true)}
          containerStyle={styles.addContactButton}
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
    lineHeight: 20,
  },
  relationshipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  relationshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  relationshipInfo: {
    flex: 1,
  },
  relationshipName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  relationshipDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  relationshipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.lightGray,
  },
  primaryButtonActive: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    fontSize: 12,
    color: Colors.accent,
  },
  primaryButtonTextActive: {
    color: Colors.white,
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
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
  addContactButton: {
    backgroundColor: Colors.secondary,
  },
});

export default CareRelationshipForm;
