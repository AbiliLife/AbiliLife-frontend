/**
 * Location Utilities
 * 
 * Helper functions for common location operations
 */

import type { LocationResult, GeosearchResult } from '@/types/location';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - First latitude
 * @param lon1 - First longitude  
 * @param lat2 - Second latitude
 * @param lon2 - Second longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Validate if coordinates are within Kenya's bounds
 * @param latitude - Latitude to check
 * @param longitude - Longitude to check
 * @returns Boolean indicating if coordinates are in Kenya
 */
export const isInKenya = (latitude: number, longitude: number): boolean => {
  // Kenya's approximate bounds
  const bounds = {
    north: 5.0,
    south: -4.8,
    east: 41.9,
    west: 33.9
  };
  
  return (
    latitude >= bounds.south && 
    latitude <= bounds.north &&
    longitude >= bounds.west && 
    longitude <= bounds.east
  );
};

/**
 * Sort locations by distance from a reference point
 * @param locations - Array of locations to sort
 * @param refLat - Reference latitude
 * @param refLon - Reference longitude
 * @returns Sorted array with distance property added
 */
export const sortByDistance = (
  locations: GeosearchResult[], 
  refLat: number, 
  refLon: number
): (GeosearchResult & { distance: number })[] => {
  return locations
    .map(location => ({
      ...location,
      distance: calculateDistance(refLat, refLon, location.latitude, location.longitude)
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Format distance for display
 * @param distanceKm - Distance in kilometers
 * @returns Formatted string
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
};

/**
 * Create a location bounds object from center point and radius
 * @param centerLat - Center latitude
 * @param centerLon - Center longitude  
 * @param radiusKm - Radius in kilometers
 * @returns Bounds object for API requests
 */
export const createBounds = (
  centerLat: number, 
  centerLon: number, 
  radiusKm: number
) => {
  // Rough conversion: 1 degree ≈ 111 km
  const latOffset = radiusKm / 111;
  const lonOffset = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180));
  
  return {
    southwest: {
      latitude: centerLat - latOffset,
      longitude: centerLon - lonOffset
    },
    northeast: {
      latitude: centerLat + latOffset,
      longitude: centerLon + lonOffset
    }
  };
};

/**
 * Extract city from location components
 * @param location - Location result with components
 * @returns City name or fallback
 */
export const extractCity = (location: LocationResult): string => {
  const components = location.components;
  if (!components) return 'Unknown City';
  
  return components.city || 
         components.suburb || 
         components.state || 
         'Unknown City';
};

/**
 * Create a short display name from a location
 * @param location - Location result
 * @returns Short display string
 */
export const createShortName = (location: LocationResult): string => {
  const components = location.components;
  if (!components) return location.name;
  
  const city = extractCity(location);
  const road = components.road;
  
  if (road && city) {
    return `${road}, ${city}`;
  } else if (road) {
    return road;
  } else {
    return city;
  }
};

/**
 * Check if a location appears to be a business/POI
 * @param location - Location to check
 * @returns Boolean indicating if it's likely a business
 */
export const isLikelyBusiness = (location: GeosearchResult): boolean => {
  const name = location.name.toLowerCase();
  const businessKeywords = [
    'mall', 'center', 'centre', 'hospital', 'hotel', 'restaurant',
    'shop', 'store', 'market', 'office', 'bank', 'school', 'university',
    'airport', 'station', 'stadium', 'gym', 'clinic', 'pharmacy'
  ];
  
  return businessKeywords.some(keyword => name.includes(keyword));
};

/**
 * Validate and clean a search query
 * @param query - Raw search input
 * @returns Cleaned query string
 */
export const cleanSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s,-]/g, '') // Remove special characters except commas and hyphens
    .substring(0, 100); // Limit length
};
