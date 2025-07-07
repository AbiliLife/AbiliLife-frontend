import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';
import { EmergencyContact, RelationshipType } from '@/types/onboard';

// Simple UUID generator for React Native
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface Props {
  contacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onRemoveContact: (id: string) => void;
  onUpdateContact: (id: string, contact: Partial<EmergencyContact>) => void;
  currentTheme: 'light' | 'dark';
}

const relationshipTypes: RelationshipType[] = [
  'parent', 'child', 'sibling', 'spouse', 'caregiver', 'friend', 'guardian', 'other'
];

const EmergencyContactForm: React.FC<Props> = ({
  contacts,
  onAddContact,
  onRemoveContact,
  onUpdateContact,
  currentTheme
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'caregiver' as RelationshipType,
    phone: '',
    email: '',
  });

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'Please fill in at least name and phone number');
      return;
    }

    const contact: EmergencyContact = {
      id: generateId(),
      name: newContact.name.trim(),
      relationship: newContact.relationship,
      phone: newContact.phone.trim(),
      email: newContact.email.trim() || undefined,
      isPrimary: contacts.length === 0, // First contact is primary
      notificationPreferences: {
        emergencies: true,
        bookingUpdates: contacts.length === 0, // Only primary gets booking updates by default
        locationSharing: true,
      },
    };

    onAddContact(contact);
    setNewContact({ name: '', relationship: 'caregiver', phone: '', email: '' });
    setShowAddForm(false);
  };

  const togglePrimary = (id: string) => {
    // Set all to non-primary first
    contacts.forEach(contact => {
      if (contact.isPrimary) {
        onUpdateContact(contact.id, { isPrimary: false });
      }
    });
    // Set selected as primary
    onUpdateContact(id, { isPrimary: true });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}>
        Emergency Contacts
      </Text>
      <Text style={[styles.sectionSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
        Add people who should be contacted in case of emergencies
      </Text>

      {/* Existing Contacts */}
      {contacts.map((contact) => (
        <View key={contact.id} style={[styles.contactCard, { 
          backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray,
          borderColor: contact.isPrimary ? Colors.primary : Colors.lightGray
        }]}>
          <View style={styles.contactHeader}>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]}>
                {contact.name}
              </Text>
              <Text style={[styles.contactDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                {contact.relationship} • {contact.phone}
              </Text>
              {contact.email && (
                <Text style={[styles.contactDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]}>
                  {contact.email}
                </Text>
              )}
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity
                onPress={() => togglePrimary(contact.id)}
                style={[styles.primaryButton, contact.isPrimary && styles.primaryButtonActive]}
              >
                <Text style={[styles.primaryButtonText, contact.isPrimary && styles.primaryButtonTextActive]}>
                  {contact.isPrimary ? 'Primary' : 'Set Primary'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onRemoveContact(contact.id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Add Contact Form */}
      {showAddForm ? (
        <View style={[styles.addForm, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
          <FormField
            type='text'
            title="Name"
            placeholder="Enter contact name"
            value={newContact.name}
            onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
          />
          
          <FormField
            type='phone'
            title="Phone"
            placeholder="Enter phone number"
            value={newContact.phone}
            onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
          />
          
          <FormField
            type='email'
            title="Email (Optional)"
            placeholder="Enter email address"
            value={newContact.email}
            onChangeText={(text) => setNewContact(prev => ({ ...prev, email: text }))}
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
                  newContact.relationship === type && styles.relationshipChipActive,
                  { backgroundColor: currentTheme === 'light' ? Colors.lightGray : Colors.mediumGray }
                ]}
                onPress={() => setNewContact(prev => ({ ...prev, relationship: type }))}
              >
                <Text style={[
                  styles.relationshipChipText,
                  newContact.relationship === type && styles.relationshipChipTextActive,
                  { color: currentTheme === 'light' ? Colors.black : Colors.white }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
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
              handlePress={handleAddContact}
              containerStyle={[styles.actionButton, styles.addButton]}
            />
          </View>
        </View>
      ) : (
        <CustomButton
          title="+ Add Emergency Contact"
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
  },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactActions: {
    alignItems: 'flex-end',
  },
  primaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.lightGray,
    marginBottom: 8,
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

export default EmergencyContactForm;
