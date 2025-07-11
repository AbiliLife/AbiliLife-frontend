// Format the phone number to include the country code
export const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('0')) {
        return `+254${phone.slice(1)}`; // Remove the leading '0' and add '254'
    }
    return phone; // Return as is if already formatted
}

// Format phone number to show +254 and hide middle characters
export const formatHiddenPhoneNumber = (phone: string) => {
    if (!phone) return ''; // Return empty string if phone is not provided

    const countryCode = '+254';

    // Remove leading '0' if it exists and ensure the number starts with +254
    const localNumber = phone.startsWith('0')
        ? phone.slice(1) // Remove the leading '0'
        : phone.replace(/^\+?254/, ''); // Remove +254 if it exists

    const hiddenPart = localNumber.slice(1, -2).replace(/\d/g, '*'); // Hide middle digits
    return `${countryCode}${localNumber[0]}${hiddenPart}${localNumber.slice(-2)}`;
};