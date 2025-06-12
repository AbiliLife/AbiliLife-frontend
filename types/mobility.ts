// Types for mobility features

// Public Transport Route
export interface TransportRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  frequency: string;
  estimatedArrival: string;
  wheelchairAccessible: boolean;
  hasRamp: boolean;
  visualAids: boolean;
  trainedDriver: boolean;
  caregiverSpace: boolean;
  verified: boolean;
  saccoId: string;
  rating: number;
  reviews: TransportReview[];
}

// Transport Review
export interface TransportReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Transport SACCO/Provider
export interface TransportSacco {
  id: string;
  name: string;
  contact: string;
  whatsapp: string;
  routes: string[];
  hasWheelchairSpace: boolean;
  hasCaregiverTraining: boolean;
  partnered: boolean;
  logo: string;
}

// Safety Tip
export interface SafetyTip {
  id: string;
  title: string;
  content: string;
}

// Legal Right
export interface LegalRight {
  id: string;
  title: string;
  content: string;
}

// Emergency Contact
export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
}

// Accessibility Filter Options
export interface AccessibilityFilters {
  wheelchairAccessible: boolean;
  hasRamp: boolean;
  visualAids: boolean;
  trainedDriver: boolean;
  caregiverSpace: boolean;
  verified: boolean;
}
