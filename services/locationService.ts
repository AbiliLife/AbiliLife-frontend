/**
 * Main Location Service
 * 
 * This service acts as a facade that abstracts location providers.
 * It allows switching between OpenCage (development) and Geoapify (production) based on environment configuration.
 * 
 * Features:
 * - Provider abstraction for easy switching
 * - Debounced search to reduce API calls
 * - Consistent interface regardless of provider
 * - Error handling and fallbacks
 */

import * as opencage from './location/opencageLocationService';
import * as geoapify from './location/geoapifyLocationService';
import type { 
  LocationResult, 
  GeosearchResult, 
  LocationSearchParams 
} from '@/types/location';

// Provider selection logic
// You can change this to switch providers easily
const useGeoapify = process.env.EXPO_PUBLIC_USE_GEOAPIFY === 'true' || __DEV__ === false;

// Select the appropriate provider
const provider = useGeoapify ? geoapify : opencage;

// Debounce timeout reference
let debounceTimeout: number | null = null;

// --- EXPORTED FUNCTIONS ---

/**
 * Get formatted address from coordinates
 * Uses the selected provider (OpenCage or Geoapify)
 */
export const getAddressFromCoordinates = provider.getAddressFromCoordinates;

/**
 * Get coordinates from address
 * Uses the selected provider (OpenCage or Geoapify)
 */
export const getCoordinatesFromAddress = provider.getCoordinatesFromAddress;

/**
 * Get detailed location information from address
 * Uses the selected provider (OpenCage or Geoapify)
 */
export const getLocationFromAddress = provider.getLocationFromAddress;

/**
 * Get location suggestions for autocomplete
 * Uses the selected provider (OpenCage or Geoapify)
 */
export const getLocationSuggestions = provider.getLocationSuggestions;

/**
 * Get multiple locations for ambiguous addresses
 * Uses the selected provider (OpenCage or Geoapify)
 */
export const getMultipleLocations = provider.getMultipleLocations || (async () => []);

/**
 * Debounced version of getLocationSuggestions
 * Reduces API calls during typing
 * @param query - Search query
 * @param options - Search options
 * @param callback - Callback function to receive results
 */
export const debouncedGetLocationSuggestions = (
  query: string,
  options: Partial<LocationSearchParams> = {},
  callback: (results: GeosearchResult[]) => void
): void => {
  // Clear existing timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  
  // Don't search for very short queries
  if (query.length < 3) {
    callback([]);
    return;
  }
  
  // Set new timeout
  debounceTimeout = setTimeout(async () => {
    try {
      const results = await getLocationSuggestions(query, options);
      callback(results);
    } catch (error) {
      console.error('Error in debounced location search:', error);
      callback([]);
    }
  }, 300); // 300ms debounce delay
};

/**
 * Cancel any pending debounced searches
 */
export const cancelDebouncedSearch = (): void => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
    debounceTimeout = null;
  }
};

/**
 * Get the name of the currently active provider
 * @returns Provider name
 */
export const getCurrentProvider = (): 'opencage' | 'geoapify' => {
  return useGeoapify ? 'geoapify' : 'opencage';
};

/**
 * Check if coordinates are valid
 * @param latitude - Latitude to validate
 * @param longitude - Longitude to validate
 * @returns boolean indicating validity
 */
export const isValidCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180 &&
    !(latitude === 0 && longitude === 0) // Exclude null island
  );
};

/**
 * Format location for display
 * @param location - Location to format
 * @param includeCoordinates - Whether to include coordinates
 * @returns Formatted string
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

/**
 * Search with both suggestions and detailed results
 * @param query - Search query
 * @param options - Search options
 * @returns Combined search results
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
      getMultipleLocations ? getMultipleLocations(query, 3) : Promise.resolve([])
    ]);

    return { suggestions, detailed };
  } catch (error) {
    console.error("Error in enhanced search:", error);
    return { suggestions: [], detailed: [] };
  }
};