import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import { CareRelationship, RelationshipType } from '@/types/onboard';

import Colors from '@/constants/Colors';

import { ThemeContext } from '@/contexts/ThemeContext';

import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';
import SelectableChip from './SelectableChip';

interface Props {
    relationships: CareRelationship[];
    onAddRelationship: (relationship: CareRelationship) => void;
    onRemoveRelationship: (id: string) => void;
    onUpdateRelationship: (id: string, relationship: Partial<CareRelationship>) => void;
}

const relationshipTypes: RelationshipType[] = [
    'parent', 'child', 'sibling', 'spouse', 'caregiver', 'friend', 'guardian', 'other'
];

const CareRelationshipForm: React.FC<Props> = ({
    relationships,
    onAddRelationship,
    onRemoveRelationship,
    onUpdateRelationship,
}) => {
    const { currentTheme } = useContext(ThemeContext);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newRelationship, setNewRelationship] = useState({
        name: '',
        relationship: 'caregiver' as RelationshipType,
        phone: '',
        email: '',
        canBookForMe: true,
    });

    const handleAddRelationship = () => {
        // Validate input
        // Ensure at least name and phone are provided
        if (!newRelationship.name.trim() || !newRelationship.phone.trim()) {
            Alert.alert('You have not filled in all the required fields', 'Please fill in at least name and phone number');
            return;
        }

        // Prepare the new relationship object
        // Using uuid to generate a unique ID
        const relationship: CareRelationship = {
            id: uuid.v4().toString(),
            name: newRelationship.name.trim(),
            relationship: newRelationship.relationship,
            phone: newRelationship.phone.trim(),
            email: newRelationship.email.trim() || undefined,
            canBookForMe: newRelationship.canBookForMe,
            isPrimary: relationships.length === 0, // First relationship is primary
        };

        // Add the new relationship
        onAddRelationship(relationship);

        // Reset form fields
        setNewRelationship({ name: '', relationship: 'caregiver', phone: '', email: '', canBookForMe: true });
        setShowAddForm(false);
    };

    const togglePrimary = (id: string) => {
        const selected = relationships.find(r => r.id === id);
        if (selected?.isPrimary) {
            // If already primary, unset it
            onUpdateRelationship(id, { isPrimary: false });
        } else {
            // Otherwise, set this as primary and unset others
            relationships.forEach((relationship) => {
                onUpdateRelationship(relationship.id, { isPrimary: relationship.id === id });
            });
        }
    };

    const toggleBookingPermission = (id: string, canBook: boolean) => {
        onUpdateRelationship(id, { canBookForMe: canBook });
    };

    return (
        <View style={styles.container} accessible={true}>
            <Text style={[styles.sectionTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Caregiver Network">
                Caregiver Network
            </Text>
            <Text style={[styles.sectionSubtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Add people who can help you book rides and make decisions on your behalf">
                Add people who can help you book rides and make decisions on your behalf {`\n`}
                <Text style={{ color: Colors.info, fontWeight: 'bold' }} accessibilityRole="text" accessibilityLabel="Note: It is recommended to have at least one primary contact who can book rides for you">
                    Note: It is recommended to have at least one primary contact who can book rides for you.
                </Text>
            </Text>

            {/* Existing Relationships */}
            {relationships.map((relationship) => (
                <View key={relationship.id} style={[styles.relationshipCard, {
                    backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkGray,
                    borderColor: relationship.isPrimary ? Colors.primary : Colors.lightGray
                }]} accessible={true}>
                    <View style={styles.relationshipHeader}>
                        <View style={styles.relationshipInfo}>
                            <Text style={[styles.relationshipName, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Relationship name: ${relationship.name}`}>
                                {relationship.name}
                            </Text>

                            <Text style={[styles.relationshipDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel={`Relationship type: ${relationship.relationship}, Phone: ${relationship.phone}`}>
                                {relationship.relationship} • {relationship.phone}
                            </Text>

                            {relationship.email && (
                                <Text style={[styles.relationshipDetails, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel={`Email: ${relationship.email}`}>
                                    {relationship.email}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => onRemoveRelationship(relationship.id)}
                            style={styles.removeButton}
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${relationship.name} from care network`}
                            accessibilityHint='This will delete the contact from your care network.'
                        >
                            <Ionicons name="trash-outline" size={20} color={Colors.error} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.relationshipActions}>
                        <TouchableOpacity
                            onPress={() => togglePrimary(relationship.id)}
                            style={[styles.primaryButton, relationship.isPrimary && styles.primaryButtonActive]}
                            accessibilityRole="button"
                            accessibilityLabel={relationship.isPrimary ? `Remove ${relationship.name} as primary contact` : `Set ${relationship.name} as primary contact`}
                            accessibilityHint={relationship.isPrimary ? 'This will remove the primary contact designation.' : 'This will set this contact as your primary contact.'}
                        >
                            <Text style={[styles.primaryButtonText, relationship.isPrimary && styles.primaryButtonTextActive]} accessibilityRole="text" accessibilityLabel={relationship.isPrimary ? 'Primary Contact' : 'Set as Primary'}>
                                {relationship.isPrimary ? 'Primary Contact' : 'Set as Primary'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.permissionContainer}>
                            <Text style={[styles.permissionLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={`Can ${relationship.name} book rides for you`}>
                                Can book rides for me
                            </Text>
                            <Switch
                                value={relationship.canBookForMe}
                                onValueChange={(value) => toggleBookingPermission(relationship.id, value)}
                                trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                                thumbColor={relationship.canBookForMe ? Colors.white : Colors.mediumGray}
                                accessibilityRole="switch"
                                accessibilityLabel={`Toggle booking permission for ${relationship.name}`}
                            />
                        </View>
                    </View>
                    <Text style={{ color: Colors.info, fontWeight: '500' }} accessibilityRole="text" accessibilityLabel="You can edit this contact later on your profile page.">
                        You can edit this contact later on your profile page.
                    </Text>
                </View>
            ))}

            {/* Add Relationship Form */}
            <Modal
                visible={showAddForm}
                animationType="slide"
                presentationStyle={Platform.OS === 'ios' ? 'formSheet' : undefined}
                onRequestClose={() => setShowAddForm(false)}
                accessible={true}
                accessibilityViewIsModal={true}
                accessibilityLabel="Add Caregiver Contact"
                accessibilityHint='This is a formsheet to add a new caregiver contact.'
            >
                <View style={[styles.modalContainer, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Add Caregiver Contact">
                            Add Caregiver Contact
                        </Text>
                        <TouchableOpacity onPress={() => setShowAddForm(false)} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close add contact form">
                            <Ionicons name="close" size={24} color={currentTheme === 'light' ? Colors.black : Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>

                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Contact Name'>
                            Contact Name*
                        </Text>
                        <FormField
                            type="text"
                            title="Name"
                            placeholder="Enter contact name"
                            value={newRelationship.name}
                            onChangeText={(text) => setNewRelationship(prev => ({ ...prev, name: text }))}
                        />



                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Contact Phone'>
                            Contact Phone*
                        </Text>
                        <FormField
                            type="phone"
                            title="Phone"
                            placeholder="Enter phone number"
                            value={newRelationship.phone}
                            onChangeText={(text) => setNewRelationship(prev => ({ ...prev, phone: text }))}
                            otherStyles={{ marginBottom: 16 }}
                        />



                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole='text' accessibilityLabel='Contact Email'>
                            Contact Email (Optional)
                        </Text>
                        <FormField
                            type="email"
                            title="Email (Optional)"
                            placeholder="Enter email address"
                            value={newRelationship.email}
                            onChangeText={(text) => setNewRelationship(prev => ({ ...prev, email: text }))}
                            otherStyles={{ marginBottom: 16 }}
                        />


                        {/* Relationship Selector */}
                        <Text style={[styles.label, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel="Relationship">
                            Relationship*
                        </Text>
                        <View style={styles.relationshipGrid}>
                            {relationshipTypes.map((type) => (
                                <SelectableChip
                                    key={type}
                                    label={typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1) : ''}
                                    selected={newRelationship.relationship === type}
                                    onPress={() => setNewRelationship(prev => ({ ...prev, relationship: type }))}
                                />
                            ))}
                        </View>

                        {/* Booking Permission */}
                        <View style={styles.permissionContainer}>
                            <Text style={[styles.permissionLabel, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel="Can book rides for me">
                                Can book rides for me
                            </Text>
                            <Switch
                                value={newRelationship.canBookForMe}
                                onValueChange={(value) => setNewRelationship(prev => ({ ...prev, canBookForMe: value }))}
                                trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
                                thumbColor={newRelationship.canBookForMe ? Colors.white : Colors.mediumGray}
                                accessible={true}
                                accessibilityState={{ checked: newRelationship.canBookForMe }}
                                accessibilityRole="switch"
                                accessibilityLabel={`Toggle booking permission for ${newRelationship.name || 'new contact'}`}
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
                                handlePress={handleAddRelationship}
                                containerStyle={[styles.actionButton, styles.addButton]}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <CustomButton
                title="+ Add Care Contact"
                handlePress={() => setShowAddForm(true)}
                containerStyle={styles.addContactButton}
            />
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
        flexWrap: 'wrap',
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
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
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

export default CareRelationshipForm;
