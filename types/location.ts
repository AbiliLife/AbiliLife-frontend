/**
 * Location-related interfaces
 * These interfaces provide type safety for location data throughout the app
 */

// Base location interface used throughout the app
export interface Location {
    address: string;        // Required address, minLength: 1
    latitude: string;       // Decimal as string (for API compatibility)
    longitude: string;      // Decimal as string (for API compatibility)
}

// Extended location result from geocoding services
export interface LocationResult {
    name: string;           // Formatted address name
    latitude: number;       // Latitude as number (for calculations)
    longitude: number;      // Longitude as number (for calculations)
    confidence?: number;    // Confidence score from geocoding service
    components?: {          // Address components
        country?: string;
        state?: string;
        city?: string;
        suburb?: string;
        road?: string;
        postcode?: string;
    };
}

// Geosearch result for autocomplete functionality
export interface GeosearchResult {
    name: string;           // Display name for the location
    latitude: number;       // Latitude coordinate
    longitude: number;      // Longitude coordinate
    type: string;          // Type of location (city, road, building, etc.)
    relevance: number;     // Relevance score for sorting
}

// Location suggestion for autocomplete dropdowns
export interface LocationSuggestion {
    id: string;            // Unique identifier
    label: string;         // Display label
    description?: string;  // Additional description
    location: LocationResult; // Full location data
}

// Search query parameters
export interface LocationSearchParams {
    query: string;         // Search query string
    limit?: number;        // Maximum number of results
    bias?: {              // Bias results towards a location
        latitude: number;
        longitude: number;
    };
    bounds?: {            // Restrict results to a bounding box
        southwest: { latitude: number; longitude: number };
        northeast: { latitude: number; longitude: number };
    };
    countryCode?: string; // Restrict to specific country (ISO 3166-1 alpha-2)
}

// Conversion utilities
export const locationToResult = (location: Location): LocationResult => ({
    name: location.address,
    latitude: parseFloat(location.latitude),
    longitude: parseFloat(location.longitude)
});

export const resultToLocation = (result: LocationResult): Location => ({
    address: result.name,
    latitude: result.latitude.toString(),
    longitude: result.longitude.toString()
});