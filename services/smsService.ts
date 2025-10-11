/**
 * SMS SERVICE - Production ready
 * 
 * Functional approach for handling SMS messaging using expo-sms.
 * Includes fallbacks and error handling for production use.
 */

import * as SMS from 'expo-sms';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';



export interface SMSResult {
    success: boolean;
    message: string;
    method?: 'sms' | 'fallback';
    error?: string;
}



// ============================================================================
// SMS CAPABILITY CHECKS
// ============================================================================
/**
 * Check if SMS is available on the current device
 * @returns Promise<boolean> indicating SMS availability
 */
export async function checkSMSAvailability(): Promise<boolean> {
    try {
        // 1. Check if device supports SMS
        if (!Device.isDevice) {
            console.log('(checkSMSAvailability) ⚠️ SMS not available: Running on simulator/emulator');
            Alert.alert('⚠️ SMS not available: Running on simulator/emulator');
            return false;
        }

        // 2. Check SMS availability
        const isAvailable = await SMS.isAvailableAsync();
        if (!isAvailable) {
            console.log('(checkSMSAvailability) ⚠️ SMS not available: No messaging app found on device');
            Alert.alert('⚠️ SMS not available: No messaging app found on device');
            return false;
        }

        console.log('(checkSMSAvailability) ✅ SMS is available on this device');
        return true;
    } catch (error) {
        console.error('(checkSMSAvailability) ❌ Error checking SMS availability:', error);
        return false;
    }
}



// ============================================================================
// SMS SENDING FUNCTION
// ============================================================================
/**
 * Send general SMS message (for future use)
 * @param recipients - Array of phone numbers
 * @param message - SMS message body
 * @returns Promise<SMSResult> with success status and details
 */
export async function sendSMS(recipients: string[], message: string): Promise<SMSResult> {
    try {
        // 1. Check SMS availability
        const isAvailable = await checkSMSAvailability();
        if (!isAvailable) {
            return {
                success: false,
                message: 'SMS not available on this device',
                error: 'SMS_NOT_AVAILABLE'
            };
        }

        // 2. Validate inputs
        if (!recipients || recipients.length === 0) {
            return {
                success: false,
                message: 'No recipients provided',
                error: 'INVALID_RECIPIENTS'
            };
        }

        if (!message || message.trim().length === 0) {
            return {
                success: false,
                message: 'Empty message body',
                error: 'EMPTY_MESSAGE'
            };
        }

        // 3. Send SMS
        console.log(`(sendSMS) 📱 Attempting to send SMS to ${recipients.length} recipient(s)`);
        const result = await SMS.sendSMSAsync(recipients, message);

        // 4. Handle result
        if (result.result === 'sent') {
            console.log('(sendSMS) ✅ SMS sent successfully');
            return {
                success: true,
                message: 'SMS sent successfully',
                method: 'sms'
            };
        } else if (result.result === 'cancelled') {
            console.log('(sendSMS) ⚠️ User cancelled SMS sending');
            return {
                success: false,
                message: 'SMS sending was cancelled',
                error: 'USER_CANCELLED'
            };
        } else if (result.result === 'unknown') {
            console.log('(sendSMS) ❌ SMS sending failed with unknown result:', result.result);
            return {
                success: false,
                message: 'Failed to send SMS',
                error: 'SMS_SEND_FAILED'
            };
        } else {
            console.log('(sendSMS) ❌ SMS sending failed with unexpected result:', result.result);
            return {
                success: false,
                message: 'Failed to send SMS',
                error: 'SMS_SEND_FAILED'
            };
        }

    } catch (error: any) {
        console.error('(sendSMS) ❌ Error sending SMS:', error);
        return {
            success: false,
            message: `SMS error: ${error.message || 'Unknown error'}`,
            error: 'SMS_EXCEPTION'
        };
    }
}



// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Format phone number for SMS (basic validation)
 * @param phone - Phone number to format
 * @returns Formatted phone number or null if invalid
 */
export function formatPhoneForSMS(phone: string): string | null {
    if (!phone) return null;

    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Basic validation: should start with + and have at least 10 digits
    if (cleaned.startsWith('+') && cleaned.length >= 11) {
        return cleaned;
    }

    // If no country code, assume it's a local number (this might need adjustment based on your market)
    if (cleaned.length >= 10 && !cleaned.startsWith('+')) {
        console.log('(formatPhoneForSMS) ⚠️ Phone number missing country code, consider validation');
        return cleaned;
    }

    console.log('(formatPhoneForSMS) ⚠️ Invalid phone number format:', phone);
    return null;
}

/**
 * Get SMS usage info for debugging/monitoring
 * @returns Object with SMS capability and device info
 */
export async function getSMSInfo(): Promise<{
    isDevice: boolean;
    platform: string;
    smsAvailable: boolean;
    deviceInfo: any;
}> {
    const isDevice = Device.isDevice;
    const platform = Platform.OS;
    const smsAvailable = await checkSMSAvailability();

    return {
        isDevice,
        platform,
        smsAvailable,
        deviceInfo: {
            modelName: Device.modelName,
            deviceName: Device.deviceName,
            osName: Device.osName,
            osVersion: Device.osVersion,
        }
    };
}