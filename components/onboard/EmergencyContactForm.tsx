import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import { EmergencyContact, RelationshipType } from '@/types/onboard';

import Colors from '@/constants/Colors';

import { ThemeContext } from '@/contexts/ThemeContext';

import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';
import SelectableChip from './SelectableChip';

interface Props {
    contacts: EmergencyContact[];
    onAddContact: (contact: EmergencyContact) => void;
    onRemoveContact: (id: string) => void;
    onUpdateContact: (id: string, contact: Partial<EmergencyContact>) => void;
}

const relationshipTypes: RelationshipType[] = [
    'parent', 'child', 'sibling', 'spouse', 'caregiver', 'friend', 'guardian', 'other'
];

const EmergencyContactForm: React.FC<Props> = ({
    contacts,
    onAddContact,
    onRemoveContact,
    onUpdateContact,
}) => {
    const { currentTheme } = useContext(ThemeContext);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newContact, setNewContact] = useState({
        name: '',
        relationship: 'parent' as RelationshipType,
        phone: '',
        email: '',
        isPrimary: true,
    });

    const handleAddContact = () => {
        // Validate input
        // Ensure at least name and phone are provided
        if (!newContact.name.trim() || !newContact.phone.trim()) {
            Alert.alert('Error', 'Please fill in at least name and phone number');
            return;
        }

        // Prepare new contact object
        const contact: EmergencyContact = {
            id: uuid.v4().toString(),
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

        // Add the new contact
        onAddContact(contact);

        // Reset form
        setNewContact({ name: '', relationship: 'caregiver', phone: '', email: '', isPrimary: true });
        setShowAddForm(false);
    };

    const togglePrimary = (id: string) => {
        const selectedContact = contacts.find(contact => contact.id === id);
        if (!selectedContact) return;

        if (selectedContact.isPrimary) {
            // If already primary, unset it (allow no primary)
            onUpdateContact(id, { isPrimary: false });
        } else {
            // Set all to non-primary first
            contacts.forEach(contact => {
                if (contact.isPrimary) {
                    onUpdateContact(contact.id, { isPrimary: false });
                }
            });
            // Set selected as primary
            onUpdateContact(id, { isPrimary: true });
        }
    };

    return (
        <View style={styles.container} accessible={true}>
            <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel='Emergency Contacts'>
                Emergency Contacts
            </Text>
            <Text style={[styles.sectionSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel='Add people who should be contacted in case of emergencies'>
                Add people who should be contacted in case of emergencies {`\n`}
                <Text style={{ color: Colors.info, fontWeight: 'bold' }} accessibilityRole="text" accessibilityLabel="Note: At least one primary contact is required">
                    Note: It is important to have at least one primary contact who can be reached in case of emergencies.
                </Text>
            </Text>

            {/* Existing Contacts */}
            {contacts.map((contact) => (
                <View key={contact.id} style={[styles.contactCard, {
                    backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray,
                    borderColor: contact.isPrimary ? Colors.primary : Colors.lightGray
                }]}>
                    <View style={styles.contactHeader}>
                        <View style={styles.contactInfo}>
                            <Text style={[styles.contactName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel={`Contact Name: ${contact.name}`}>
                                {contact.name}
                            </Text>

                            <Text style={[styles.contactDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel={`Relationship: ${contact.relationship}, Phone: ${contact.phone}`}>
                                {contact.relationship} • {contact.phone}
                            </Text>

                            {contact.email && (
                                <Text style={[styles.contactDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole='text' accessibilityLabel={`Email: ${contact.email}`}>
                                    {contact.email}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => onRemoveContact(contact.id)}
                            style={styles.removeButton}
                            accessibilityRole="button"
                            accessibilityLabel={`Remove contact ${contact.name} from emergency contacts`}
                            accessibilityHint='This will remove the contact from your emergency contacts list'
                        >
                            <Ionicons name="trash-outline" size={20} color={Colors.error} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contactActions}>
                        <TouchableOpacity
                            onPress={() => togglePrimary(contact.id)}
                            style={[styles.primaryButton, contact.isPrimary && styles.primaryButtonActive]}
                            accessibilityRole="button"
                            accessibilityLabel={contact.isPrimary ? `Unset ${contact.name} as primary contact` : `Set ${contact.name} as primary contact`}
                            accessibilityHint={contact.isPrimary ? 'This will remove the primary status from this contact' : 'This will set this contact as your primary emergency contact'}
                        >
                            <Text style={[styles.primaryButtonText, contact.isPrimary && styles.primaryButtonTextActive]} accessibilityRole='text' accessibilityLabel={contact.isPrimary ? 'Primary contact' : 'Set as primary contact'}>
                                {contact.isPrimary ? 'Primary' : 'Set Primary'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <Text style={{ color: Colors.info, fontWeight: '500' }} accessibilityRole="text" accessibilityLabel="You can edit this contact later on your profile page.">
                        You can edit this contact later on your profile page.
                    </Text>
                </View>
            ))}

            {/* Add Contact Form */}
            <CustomButton
                title="+ Add Emergency Contact"
                handlePress={() => setShowAddForm(true)}
                containerStyle={styles.addContactButton}
            />

            {/* Add Contact Modal */}
            <Modal
                visible={showAddForm}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowAddForm(false)}
                accessible={true}
                accessibilityViewIsModal={true}
                accessibilityLabel="Add Emergency Contact"
                accessibilityHint='This is a formsheet for adding emergency contacts'
            >
                <View style={[styles.modalContainer, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Add Emergency Contact">
                            Add Emergency Contact
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowAddForm(false)}
                            style={styles.closeButton}
                            accessibilityRole="button"
                            accessibilityLabel="Close add contact form"
                        >
                            <Ionicons name="close" size={24} color={currentTheme === 'light' ? Colors.black : Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>

                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Contact Name'>
                            Contact Name*
                        </Text>
                        <FormField
                            type='text'
                            title="Name"
                            placeholder="Enter contact name"
                            value={newContact.name}
                            onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
                            otherStyles={{ marginBottom: 16 }}
                        />



                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Contact Phone'>
                            Contact Phone*
                        </Text>
                        <FormField
                            type='phone'
                            title="Phone"
                            placeholder="Enter phone number"
                            value={newContact.phone}
                            onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
                            otherStyles={{ marginBottom: 16 }}
                        />



                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Contact Email'>
                            Contact Email (Optional)
                        </Text>
                        <FormField
                            type='email'
                            title="Email (Optional)"
                            placeholder="Enter email address"
                            value={newContact.email}
                            onChangeText={(text) => setNewContact(prev => ({ ...prev, email: text }))}
                            otherStyles={{ marginBottom: 16 }}
                        />

                        {/* Relationship Selector */}
                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel="Relationship">
                            Relationship
                        </Text>
                        <View style={styles.relationshipGrid}>
                            {relationshipTypes.map((type) => (
                                <SelectableChip
                                    key={type}
                                    label={typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1) : ''}
                                    selected={newContact.relationship === type}
                                    onPress={() => setNewContact(prev => ({ ...prev, relationship: type }))}
                                />
                            ))}
                        </View>

                        <View style={styles.permissionContainer}>
                            <Text style={[styles.permissionLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel="Is Primary Contact">
                                Is Primary Contact
                            </Text>
                            <Switch
                                value={newContact.isPrimary}
                                onValueChange={(value) => setNewContact(prev => ({ ...prev, isPrimary: value }))}
                                trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
                                thumbColor={newContact.isPrimary ? Colors.white : Colors.mediumGray}
                                accessible={true}
                                accessibilityState={{ checked: newContact.isPrimary }}
                                accessibilityRole="switch"
                                accessibilityLabel={`Toggle primary contact status for ${newContact.name || 'new contact'}`}
                            />
                        </View>

                        <View style={{ flex: 1 }} />

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
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
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
        marginBottom: 12,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
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
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    permissionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    permissionLabel: {
        fontSize: 14,
        marginRight: 8,
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
        backgroundColor: Colors.secondary,
    },
    addContactButton: {
        backgroundColor: Colors.secondary,
    },
    modalContainer: {
        flex: 1,
        paddingTop: 30,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
});

export default EmergencyContactForm;
