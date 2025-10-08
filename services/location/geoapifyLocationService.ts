import axios from 'axios';
import { GEOAPIFY_API_URL,GEOAPIFY_API_KEY } from '@/constants/Static';
import type { 
  LocationResult, 
  GeosearchResult, 
  LocationSearchParams 
} from '@/types/location';

/**
 * Geoapify Location Service
 * 
 * This service provides comprehensive location functionality using Geoapify APIs:
 * 
 * 1. GEOCODING: Converting addresses ↔ coordinates using Geoapify REST API
 *    - Forward geocoding: address → coordinates
 *    - Reverse geocoding: coordinates → address
 * 
 * 2. AUTOCOMPLETE: Location suggestions for user input
 *    - Used for search suggestions as users type
 *    - Optimized for partial/incomplete queries
 * 
 * Documentation:
 * - Geocoding API: https://apidocs.geoapify.com/docs/geocoding/
 * - Autocomplete API: https://apidocs.geoapify.com/docs/geocoding/autocomplete/
 * - Places API: https://apidocs.geoapify.com/docs/places/
 */



// --- 1. GEOCODING FUNCTIONS ---

/**
 * Get the formatted address from coordinates using Geoapify Reverse Geocoding API
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @returns Promise resolving to formatted address string
 */
export const getAddressFromCoordinates = async (
  latitude: number, 
  longitude: number
): Promise<string> => {
  try {
    const url = `${GEOAPIFY_API_URL}/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted || "Unknown Location";
    }
    return "Unknown Location";
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return "Unknown Location";
  }
};

/**
 * Get coordinates from an address using Geoapify Geocoding API
 * @param address - The address to geocode
 * @returns Promise resolving to coordinates object
 */
export const getCoordinatesFromAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number }> => {
  try {
    const url = `${GEOAPIFY_API_URL}/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].lat,
        longitude: data.results[0].lon
      };
    }
    return { latitude: 0, longitude: 0 };
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
    const url = `${GEOAPIFY_API_URL}/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${GEOAPIFY_API_KEY}`;
    
    const response = await axios.get(url);
    const data = response.data;

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        name: result.formatted || result.address_line1 || address,
        latitude: result.lat,
        longitude: result.lon,
        confidence: result.rank?.confidence,
        components: {
          country: result.country,
          state: result.state,
          city: result.city || result.county,
          suburb: result.suburb || result.neighbourhood,
          road: result.street,
          postcode: result.postcode
        }
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting location details:", error);
    return null;
  }
};

// --- 2. AUTOCOMPLETE FUNCTIONS ---

/**
 * Get location suggestions using Geoapify Autocomplete API
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

    let url = `${GEOAPIFY_API_URL}/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&format=json&apiKey=${GEOAPIFY_API_KEY}`;

    // Add optional parameters if provided
    if (options.limit) {
      url += `&limit=${Math.min(options.limit, 20)}`;
    }
    
    if (options.countryCode) {
      url += `&filter=countrycode:${options.countryCode.toLowerCase()}`;
    }
    
    if (options.bias) {
      url += `&bias=proximity:${options.bias.longitude},${options.bias.latitude}`;
    }
    
    if (options.bounds) {
      const { southwest, northeast } = options.bounds;
      url += `&filter=rect:${southwest.longitude},${southwest.latitude},${northeast.longitude},${northeast.latitude}`;
    }
    
    const response = await axios.get(url);
    const data = response.data;

    if (data.results) {
      return data.results.map((result: any) => ({
        name: result.formatted || result.address_line1 || result.name,
        latitude: result.lat,
        longitude: result.lon,
        type: result.result_type || result.category || 'place',
        relevance: result.rank?.confidence || 0
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
 * @param address - The address to search for
 * @param limit - Maximum number of results to return
 * @returns Promise resolving to array of detailed location results
 */
export const getMultipleLocations = async (
  address: string,
  limit: number = 5
): Promise<LocationResult[]> => {
  try {
    const url = `${GEOAPIFY_API_URL}/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&limit=${Math.min(limit, 10)}&apiKey=${GEOAPIFY_API_KEY}`;
    
    const response = await axios.get(url);
    const data = response.data;

    if (data.results) {
      return data.results.map((result: any) => ({
        name: result.formatted || result.address_line1 || address,
        latitude: result.lat,
        longitude: result.lon,
        confidence: result.rank?.confidence,
        components: {
          country: result.country,
          state: result.state,
          city: result.city || result.county,
          suburb: result.suburb || result.neighbourhood,
          road: result.street,
          postcode: result.postcode
        }
      }));
    }
    return [];
  } catch (error) {
    console.error("Error getting multiple locations:", error);
    return [];
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