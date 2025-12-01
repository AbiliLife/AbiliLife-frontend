
/**
 * Formats a duration in seconds into a "MM:SS" string.
 * 
 * @param {number} seconds - The duration in seconds
 * @returns {string} A formatted string in the format "MM:SS"
 */
export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Formats a Date object into a human-readable month and year string.
 * 
 * @param {Date} date - The date object to format
 * @returns {string} A formatted string in the format "Month Year" (e.g., "January 2025")
 */
export const formatMonthYear = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Formats a Date object into a human-readable month and day string.
 * 
 * @param {Date} date - The date object to format
 * @returns {string} A formatted string in the format "Mon DD" (e.g., "Jan 15")
 */
export const formatMonthDay = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
};