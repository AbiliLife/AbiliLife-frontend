import { geocode } from 'opencage-api-client';
import type { GeocodingRequest, GeocodingResponse } from 'opencage-api-client';
import { OPEN_CAGE_API_KEY } from "@/constants/staticURLs";
import type { LocationResult, GeosearchResult, LocationSearchParams } from "@/types/location";

/* 
 * OpenCage Location Service
 * 
 * This service provides comprehensive location functionality using OpenCage APIs:
 * 
 * 1. GEOCODING: Converting addresses ↔ coordinates using the official Node.js SDK
 *    - Forward geocoding: address → coordinates
 *    - Reverse geocoding: coordinates → address
 * 
 * 2. GEOSEARCH: Location autocomplete/type-ahead for user input
 *    - Used for search suggestions as users type
 *    - Different from geocoding - designed for partial/incomplete queries
 * 
 * Documentation:
 * - Geocoding API: https://opencagedata.com/api
 * - Node.js SDK: https://github.com/tsamaya/opencage-api-client
 * - Geosearch API: https://opencagedata.com/geosearch
 */


// --- 1. GEOCODING FUNCTIONS (Using Official SDK) ---

/**
 * Get the formatted address from coordinates using OpenCage Geocoding API
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @returns Promise resolving to formatted address string
 */
export const getAddressFromCoordinates = async (
    latitude: number, 
    longitude: number
): Promise<string> => {
    try {
        const request: GeocodingRequest = {
            q: `${latitude},${longitude}`,
            key: OPEN_CAGE_API_KEY,
            language: 'en',
            no_annotations: 1, // Skip annotations for faster response
            limit: 1
        };

        const response: GeocodingResponse = await geocode(request);

        if (response.status.code === 200 && response.results.length > 0) {
            return response.results[0].formatted;
        } else {
            return "Unknown Location";
        }
    } catch (error) {
        console.error("Error in reverse geocoding:", error);
        return "Unknown Location";
    }
};

/**
 * Get coordinates from an address using OpenCage Geocoding API
 * @param address - The address to geocode
 * @returns Promise resolving to coordinates object
 */
export const getCoordinatesFromAddress = async (
    address: string
): Promise<{ latitude: number; longitude: number }> => {
    try {
        const request: GeocodingRequest = {
            q: address,
            key: OPEN_CAGE_API_KEY,
            language: 'en',
            no_annotations: 1,
            limit: 1
        };

        const response: GeocodingResponse = await geocode(request);

        if (response.status.code === 200 && response.results.length > 0) {
            const result = response.results[0];
            return {
                latitude: result.geometry.lat,
                longitude: result.geometry.lng
            };
        } else {
            return { latitude: 0, longitude: 0 };
        }
    } catch (error) {
        console.error("Error in forward geocoding:", error);
        return { latitude: 0, longitude: 0 };
    }
};

/**
 * Get detailed location information from an address
 * @param address - The address to geocode
 * @returns Promise resolving to detailed location result
 */
export const getLocationFromAddress = async (
    address: string
): Promise<LocationResult | null> => {
    try {
        const request: GeocodingRequest = {
            q: address,
            key: OPEN_CAGE_API_KEY,
            language: 'en',
            limit: 1
        };

        const response: GeocodingResponse = await geocode(request);

        if (response.status.code === 200 && response.results.length > 0) {
            const result = response.results[0];
            return {
                name: result.formatted,
                latitude: result.geometry.lat,
                longitude: result.geometry.lng,
                confidence: result.confidence,
                components: {
                    country: result.components.country,
                    state: result.components.state,
                    city: result.components.city || result.components.town || result.components.village,
                    suburb: result.components.suburb || result.components.neighbourhood,
                    road: result.components.road,
                    postcode: result.components.postcode
                }
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting location details:", error);
        return null;
    }
};


// --- 2. GEOSEARCH FUNCTIONS (For Autocomplete/Type-ahead) ---

/**
 * Search for location suggestions using OpenCage API
 * This function provides autocomplete/type-ahead functionality for location search
 * Note: OpenCage doesn't have a separate geosearch API in their free tier,
 * so we use the geocoding API with optimized parameters for autocomplete
 * @param query - The partial search query from user input
 * @param options - Search parameters and options
 * @returns Promise resolving to array of location suggestions
 */
export const getLocationSuggestions = async (
    query: string,
    options: Partial<LocationSearchParams> = {}
): Promise<GeosearchResult[]> => {
    try {
        // Return empty array for very short queries to avoid unnecessary API calls
        if (query.length < 3) {
            return [];
        }

        const request: GeocodingRequest = {
            q: query,
            key: OPEN_CAGE_API_KEY,
            language: 'en',
            no_annotations: 1, // Skip annotations for faster response
            limit: options.limit || 5, // Limit results for autocomplete
        };

        // Add optional parameters if provided
        if (options.countryCode) {
            request.countrycode = options.countryCode;
        }

        if (options.bias) {
            request.proximity = `${options.bias.latitude},${options.bias.longitude}`;
        }

        if (options.bounds) {
            const { southwest, northeast } = options.bounds;
            request.bounds = `${southwest.longitude},${southwest.latitude},${northeast.longitude},${northeast.latitude}`;
        }

        const response: GeocodingResponse = await geocode(request);

        if (response.status.code === 200) {
            return response.results.map((result: any) => ({
                name: result.formatted,
                latitude: result.geometry.lat,
                longitude: result.geometry.lng,
                type: result.components._type || 'place',
                relevance: result.confidence || 0
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching location suggestions:", error);
        return [];
    }
};

/**
 * Get multiple location results with detailed information
 * Useful for showing multiple options when geocoding ambiguous addresses
 * @param address - The address to search for
 * @param limit - Maximum number of results to return
 * @returns Promise resolving to array of detailed location results
 */
export const getMultipleLocations = async (
    address: string,
    limit: number = 5
): Promise<LocationResult[]> => {
    try {
        const request: GeocodingRequest = {
            q: address,
            key: OPEN_CAGE_API_KEY,
            language: 'en',
            limit: Math.min(limit, 10)
        };

        const response: GeocodingResponse = await geocode(request);

        if (response.status.code === 200) {
            return response.results.map(result => ({
                name: result.formatted,
                latitude: result.geometry.lat,
                longitude: result.geometry.lng,
                confidence: result.confidence,
                components: {
                    country: result.components.country,
                    state: result.components.state,
                    city: result.components.city || result.components.town || result.components.village,
                    suburb: result.components.suburb || result.components.neighbourhood,
                    road: result.components.road,
                    postcode: result.components.postcode
                }
            }));
        }
        return [];
    } catch (error) {
        console.error("Error getting multiple locations:", error);
        return [];
    }
};

/**
 * Enhanced search function that combines suggestions and detailed results
 * @param query - The search query
 * @param options - Search options
 * @returns Promise resolving to search results with both suggestions and details
 */
export const searchLocations = async (
    query: string,
    options: Partial<LocationSearchParams> = {}
): Promise<{
    suggestions: GeosearchResult[];
    detailed: LocationResult[];
}> => {
    try {
        const [suggestions, detailed] = await Promise.all([
            getLocationSuggestions(query, { ...options, limit: 5 }),
            getMultipleLocations(query, 3)
        ]);

        return { suggestions, detailed };
    } catch (error) {
        console.error("Error in enhanced search:", error);
        return { suggestions: [], detailed: [] };
    }
};


// --- 3. UTILITY FUNCTIONS ---

/**
 * Validate if coordinates are valid
 * @param latitude - Latitude to validate
 * @param longitude - Longitude to validate
 * @returns boolean indicating if coordinates are valid
 */
export const isValidCoordinates = (latitude: number, longitude: number): boolean => {
    return (
        latitude >= -90 && latitude <= 90 &&
        longitude >= -180 && longitude <= 180 &&
        !(latitude === 0 && longitude === 0) // Exclude null island
    );
};

/**
 * Format a location result for display
 * @param location - The location result to format
 * @param includeCoordinates - Whether to include coordinates in the display
 * @returns Formatted string for display
 */
export const formatLocationForDisplay = (
    location: LocationResult,
    includeCoordinates: boolean = false
): string => {
    let display = location.name;
    
    if (includeCoordinates) {
        display += ` (${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)})`;
    }
    
    return display;
};