import { Linking, Platform } from 'react-native';
import * as SMS from 'expo-sms';

export interface BookingDetails {
    // Common fields
    userName: string;
    userPhone: string;
    pickupAddress: string;
    dropoffAddress: string;
    accessibilityNotes: string;
    isCaregiverMode: boolean;
    mobilityAids?: string[];
    rideTimeType?: 'immediate' | 'scheduled';
    scheduledDate?: string;
    scheduledTime?: string;
    
    // Caregiver-specific fields
    riderName?: string;
    riderPhone?: string;
    disabilityType?: string;
    mobilityEquipment?: string;
    joining?: boolean;
    caregiverPhone?: string;
    notSure?: boolean;
}

const ACE_MOBILITY_PHONE = process.env.EXPO_PUBLIC_ACE_MOBILITY_PHONE_NUMBER!;

/**
 * Formats the booking details into a message string.
 * @param details - Booking details
 * @returns Formatted message string
 */
export const formatBookingMessage = (details: BookingDetails): string => {
    // Determine ride time
    const rideTime = details.rideTimeType === 'scheduled' && details.scheduledDate && details.scheduledTime 
        ? `${details.scheduledDate} at ${details.scheduledTime}` 
        : 'As soon as possible';

    if (details.isCaregiverMode) {
        // Caregiver booking format
        const needs = [];
        if (details.notSure) {
            needs.push("I'm not sure");
        } else {
            if (details.mobilityAids && details.mobilityAids.includes('Ramp')) needs.push('Ramp');
            if (details.mobilityAids && details.mobilityAids.includes('Transfer Assistance')) needs.push('Transfer Assistance');
            if (details.mobilityAids && details.mobilityAids.includes('Assistive Device')) needs.push('Assistive Device');
            if (details.mobilityAids && details.mobilityAids.includes('Sign Language')) needs.push('Sign Language');
            if (details.mobilityAids && details.mobilityAids.includes('Written Communication')) needs.push('Written Communication');
        }
        const needsStr = needs.length ? needs.join(', ') : 'None';

        let message = `Hello Ace Mobility, I'd like to book a ride for someone in my care:\n\n` +
            `Rider: ${details.riderName || 'Not specified'}\n` +
            `Rider Phone: ${details.riderPhone || 'Not specified'}\n` +
            `Disability Type: ${details.disabilityType || 'Not specified'}\n` +
            `Mobility Equipment: ${details.mobilityEquipment || 'None'}\n` +
            `Pickup: ${details.pickupAddress}\n` +
            `Dropoff: ${details.dropoffAddress}\n` +
            `Time: ${rideTime}\n` +
            `Needs: ${needsStr}\n\n`;
        
        if (details.accessibilityNotes) {
            message += `Notes: ${details.accessibilityNotes}\n`;
        }

        message += details.joining ? 'I will be riding with them.\n' : 'I will NOT be riding with them.\n';

        if (details.caregiverPhone) {
            message += `My Phone: ${details.caregiverPhone}`;
        }
        
        return message;
    } else {
        // Regular booking format
        const needs = [];
        if (details.mobilityAids && details.mobilityAids.includes('Ramp')) needs.push('Ramp');
        if (details.mobilityAids && details.mobilityAids.includes('Assistive Device')) needs.push('Assistive Device');
        if (details.mobilityAids && details.mobilityAids.includes('Sign Language')) needs.push('Sign Language');
        const needsStr = needs.length ? needs.join(', ') : 'None';

        let message = `Hello Ace Mobility, I'd like to request a ride:\n\nPickup: ${details.pickupAddress}\nDrop-off: ${details.dropoffAddress}\nTime: ${rideTime}\nAccessibility needs: ${needsStr}\n\n`;
        
        if (details.accessibilityNotes) {
            message += `Instructions: ${details.accessibilityNotes}`;
        }

        return message;
    }
};

/**
 * Sends booking details via WhatsApp.
 * @param details - Booking details to send
 * @returns boolean indicating if the message was sent successfully
 */
export const sendViaWhatsApp = async (details: BookingDetails): Promise<boolean> => {
    try {
        const message = encodeURIComponent(formatBookingMessage(details));
        const whatsappUrl = `whatsapp://send?phone=${ACE_MOBILITY_PHONE}&text=${message}`;

        const canOpen = await checkWhatsAppAvailability();
        if (!canOpen) {
            throw new Error('WhatsApp is not installed');
        }

        await Linking.openURL(whatsappUrl);
        return true;
    } catch (error) {
        console.error('Error sending via WhatsApp:', error);
        throw error;
    }
};

/**
 * Sends booking details via SMS.
 * @param details - Booking details to send
 * @returns boolean indicating if the SMS was sent successfully
 */
export const sendViaSMS = async (details: BookingDetails): Promise<boolean> => {
    try {
        if (Platform.OS === 'web') {
            const message = encodeURIComponent(formatBookingMessage(details));
            const smsUrl = `sms:${ACE_MOBILITY_PHONE}?body=${message}`;
            await Linking.openURL(smsUrl);
            return true;
        }

        const isAvailable = await checkSMSAvailability();
        if (!isAvailable) {
            throw new Error('SMS is not available on this device');
        }

        const { result } = await SMS.sendSMSAsync(
            [ACE_MOBILITY_PHONE],
            formatBookingMessage(details)
        );

        return result === 'sent';
    } catch (error) {
        console.error('(sendViaSMS service) Error sending via SMS:', error);
        throw error;
    }
};




/**
 * Checks if WhatsApp is installed on the device.
 * @returns boolean indicating if WhatsApp is available
 */
export const checkWhatsAppAvailability = async (): Promise<boolean> => {
    try {
        const whatsappUrl = 'whatsapp://send';
        return await Linking.canOpenURL(whatsappUrl);
    } catch {
        return false;
    }
};

/**
 * Checks if SMS is available on the device.
 * @returns boolean indicating if SMS is available
 */
export const checkSMSAvailability = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'web') {
            return true;
        }
        return await SMS.isAvailableAsync();
    } catch {
        return false;
    }
};



// EXPORTS
export default {
    formatBookingMessage,
    sendViaWhatsApp,
    sendViaSMS,
    checkWhatsAppAvailability,
    checkSMSAvailability
}