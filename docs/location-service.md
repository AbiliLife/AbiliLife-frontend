# Location Services

This directory contains location services that provide geocoding and search functionality for the AbiliLife app.

## Architecture

The location service uses a **provider pattern** that allows easy switching between different location APIs:

- **OpenCage** - For development and testing (free tier: 2,500 requests/day)
- **Geoapify** - For production use (free tier: 3,000 credits/day)

## Files

### Core Services
- `locationService.ts` - Main facade/entry point with provider abstraction
- `opencageLocationService.ts` - OpenCage API implementation
- `geoapifyLocationService.ts` - Geoapify API implementation

### Components
- `../components/location/LocationSearchModal.tsx` - Full-screen search modal
- `../components/location/LocationInputField.tsx` - Reusable location input component

## Configuration

Set the provider in your `.env` file:

```env
# Use OpenCage (development)
EXPO_PUBLIC_USE_GEOAPIFY=false

# Use Geoapify (production)
EXPO_PUBLIC_USE_GEOAPIFY=true
```

## Usage

### Basic Functions

```typescript
import { 
  getAddressFromCoordinates, 
  getCoordinatesFromAddress,
  getLocationSuggestions,
  debouncedGetLocationSuggestions 
} from '@/services/locationService';

// Reverse geocoding
const address = await getAddressFromCoordinates(latitude, longitude);

// Forward geocoding
const coords = await getCoordinatesFromAddress('123 Main St, Nairobi');

// Search suggestions
const suggestions = await getLocationSuggestions('Westlands', { limit: 5 });

// Debounced search (for autocomplete)
debouncedGetLocationSuggestions(
  query, 
  { limit: 10 }, 
  (results) => setSearchResults(results)
);
```

### Using the Search Modal

```typescript
import LocationSearchModal from '@/components/location/LocationSearchModal';

<LocationSearchModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onSelect={(location) => {
    setSelectedLocation(location.name);
    setModalVisible(false);
  }}
  placeholder="Search for a location"
  title="Select Location"
/>
```

## API Limits

### OpenCage (Free Tier)
- 2,500 requests/day
- Rate limit: 1 request/second
- Good for development/testing

### Geoapify (Free Tier)  
- 3,000 credits/day
- Rate limit: 5 requests/second
- Good for production use

## Error Handling

All functions include error handling and will return sensible defaults:
- `getAddressFromCoordinates()` returns "Unknown Location"
- `getCoordinatesFromAddress()` returns `{ latitude: 0, longitude: 0 }`
- `getLocationSuggestions()` returns empty array `[]`

## Performance Features

- **Debounced search** to reduce API calls
- **Minimum query length** (3 characters) before searching
- **Request cancellation** for unused searches
- **Caching** (can be added in future)

## Switching Providers

To switch from OpenCage to Geoapify (or vice versa):

1. Update your `.env` file:
   ```env
   EXPO_PUBLIC_USE_GEOAPIFY=true
   ```

2. That's it! The app will automatically use the new provider.

## Future Enhancements

- Add Google Places API as a third provider
- Implement response caching
- Add offline location storage
- Support for multiple languages
- Location history/favorites
