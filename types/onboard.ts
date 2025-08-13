/*
 ** AbiliLife Onboarding Types & Interfaces
 ** These types are used throughout the onboarding process to ensure consistency and clarity.
*/

export type DisabilityType = 'Physical' | 'Visual' | 'Hearing' | 'Cognitive' | 'Other';
export type ContactMethod = 'WhatsApp' | 'SMS' | 'Email' | 'In-App' | null;
export type UserRole = 'PWD' | 'caregiver' | 'family_member' | 'guardian' | null;
export type RelationshipType = 'parent' | 'child' | 'sibling' | 'spouse' | 'caregiver' | 'friend' | 'guardian' | 'other' | null;

// Other types for better onboarding experience
export type ServiceProvider = 'ACE_MOBILITY' | 'OTHER'; // Other service providers
export type VehicleType = 'WHEELCHAIR_ACCESSIBLE' | 'REGULAR' | 'MODIFIED' | 'ANY'; // Depends on user needs
export type DriverGender = 'MALE' | 'FEMALE' | 'NO_PREFERENCE';
export type PaymentMethod = 'CASH' | 'MPESA' | 'CARD' | 'INSURANCE'; // Insurance payments will be supported in the future

export interface CareRelationship {
  id: string;
  name: string;
  relationship: RelationshipType;
  phone: string;
  email?: string; // Optional email for communication
  canBookForMe: boolean;
  isPrimary: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: RelationshipType;
  phone: string;
  email?: string; // Optional email for communication
  isPrimary: boolean;
  notificationPreferences: {
    emergencies: boolean;
    bookingUpdates: boolean;
    locationSharing: boolean;
  };
}

export interface AccessibilityPreferences {
  mobility: {
    useWheelchair: boolean;
    needsRamp: boolean;
    needsAssistiveDevice: boolean;
    deviceType?: string; // e.g., 'walker', 'cane', 'crutches'
    transferAssistance: boolean;
  };
  visual: {
    isBlind: boolean;
    hasLowVision: boolean;
    needsLargeText: boolean;
    needsHighContrast: boolean;
    hasGuideAnimal: boolean;
  };
  hearing: {
    isDeaf: boolean;
    hasHearingLoss: boolean;
    needsSignLanguage: boolean;
    hasHearingAid: boolean;
    needsWrittenCommunication: boolean;
  };
  cognitive: {
    needsSimpleInstructions: boolean;
    needsExtraTime: boolean;
    hasMemorySupport: boolean;
    needsCompanion: boolean;
  };
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  profilePicture?: string; // Optional profile picture URL
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: UserRole;
  disabilityTypes: DisabilityType[];
  preferredContactMethod: ContactMethod;

  // Relationships (Caregivers & Emergency Contacts)
  careRelationships: CareRelationship[];
  emergencyContacts: EmergencyContact[];

  savedLocations: SavedLocation[];

  // Accessibility preferences - IMPORTANT
  accessibilityPreferences: AccessibilityPreferences;

  // Service preferences (this is to enhance user experience)
  servicePreferences: ServicePreferences;

  // Communication preferences
  communicationPreferences: CommunicationPreferences;

  // Billing information (optional - for future use)
  billingInformation: BillingInformation;

  // Notification preferences
  notificationPreferences: {
    rideUpdates: boolean;
    emergencyAlerts: boolean;
    promotionalOffers: boolean;
    locationSharing: boolean;
  };

  // Medical information (optional - for future use)
  medicalInformation?: {
    allergies?: string[];
    medications?: string[];
    medicalConditions?: string[];
    preferredHospital?: string;
  };

  hasSeenOnboardingSlide: boolean;
  onboardingCompleted: boolean;
  profileCompleteness: number; // 0-100 percentage
}

export interface OnboardingState {
  user: UserProfile;
  currentOnboardingStep: number; // 1 - 5 (1: Start, 5: Complete)
  completedSteps: number[];
  updateUser: (data: Partial<UserProfile>) => void;
  setCurrentOnboardingStep: (step: number) => void;
  setCompletedSteps: (steps: number[]) => void;
  resetOnboarding: () => void;
}

export interface GuideStep {
  id: number;
  title: string;
  image: any;
  steps: {
    main: string;
    subSteps?: string[];
  }[];
}

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  locationType: 'HOME' | 'WORK' | 'MEDICAL' | 'OTHER';
}

export interface ServicePreferences {
  preferredProviders: ServiceProvider[];
  vehicleType: VehicleType;
  driverGender: DriverGender;
  allowCompanion: boolean; // Ride with someone
  allowPets: boolean;
  preferredPickupTime?: string; // Optional
  specialInstructions?: string; // Optional
}

export interface CommunicationPreferences {
  preferredLanguage: string;
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE'; // SMALL - 12px, MEDIUM - 14px, LARGE - 16px, EXTRA_LARGE - 18px
  highContrast: boolean; // For visually impaired users
  voiceInstructions: boolean; // For users who prefer auditory guidance (could use screen readers)
  textToSpeech: boolean; // For users who prefer text-to-speech functionality
  communicationStyle: 'VERBAL' | 'WRITTEN' | 'GESTURE' | 'MIXED';
}

export interface BillingInformation {
  preferredPaymentMethods: PaymentMethod[];
  hasInsurance: boolean;
  insuranceProvider?: string; // (Optional)
  insurancePolicyNumber?: string; // (Optional)
  hasDisabilityVouchers: boolean;
  billingContactId?: string; // Reference to emergency contact for billing (Optional)
}