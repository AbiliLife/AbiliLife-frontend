export type DisabilityType = 'Physical' | 'Visual' | 'Hearing' | 'Cognitive' | 'Other';
export type ContactMethod = 'WhatsApp' | 'SMS' | 'Email';
export type UserRole = 'PWD' | 'caregiver' | 'family_member' | 'guardian';
export type RelationshipType = 'parent' | 'child' | 'sibling' | 'spouse' | 'caregiver' | 'friend' | 'guardian' | 'other';

// Enhanced types for better onboarding
export type ServiceProvider = 'ACE_MOBILITY' | 'BAMM_TOURS' | 'ACCESSIBLE_TRAVEL' | 'OTHER';
export type VehicleType = 'WHEELCHAIR_ACCESSIBLE' | 'REGULAR' | 'MODIFIED' | 'ANY';
export type DriverGender = 'MALE' | 'FEMALE' | 'NO_PREFERENCE';
export type PaymentMethod = 'CASH' | 'MPESA' | 'CARD' | 'INSURANCE';

export interface CareRelationship {
  id: string;
  name: string;
  relationship: RelationshipType;
  phone: string;
  email?: string;
  canBookForMe: boolean;
  isPrimary: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: RelationshipType;
  phone: string;
  email?: string;
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
    deviceType?: string;
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

interface UserSettings {
    id: string;
    userId: string;
    role: UserRole;
    careRelationships: CareRelationship[];
    emergencyContacts: EmergencyContact[];
    accessibilityPreferences: AccessibilityPreferences;
    preferredLanguage: string;
    notificationPreferences: {
        rideUpdates: boolean;
        emergencyAlerts: boolean;
        promotionalOffers: boolean;
        locationSharing: boolean;
    };
    medicalInformation?: {
        allergies?: string[];
        medications?: string[];
        medicalConditions?: string[];
        preferredHospital?: string;
    };
}
export interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    profilePicture?: string;
    role: UserRole;
    
    // Basic accessibility info (kept for backward compatibility)
    disabilityTypes: DisabilityType[];
    needsRamp: boolean;
    needsAssistiveDevice: boolean;
    needsSignLanguage: boolean;
    preferredContactMethod: ContactMethod;
    
    // Enhanced fields
    careRelationships: CareRelationship[];
    emergencyContacts: EmergencyContact[];
    accessibilityPreferences: AccessibilityPreferences;
    preferredLanguage: string;
    
    // New enhanced features
    savedLocations: SavedLocation[];
    servicePreferences: ServicePreferences;
    communicationPreferences: CommunicationPreferences;
    billingInformation: BillingInformation;
    
    // Notification preferences
    notificationPreferences: {
        rideUpdates: boolean;
        emergencyAlerts: boolean;
        promotionalOffers: boolean;
        locationSharing: boolean;
    };
    
    // Optional medical information
    medicalInformation?: {
        allergies?: string[];
        medications?: string[];
        medicalConditions?: string[];
        preferredHospital?: string;
    };
    
    onboardingCompleted: boolean;
    profileCompleteness: number; // 0-100 percentage
}

export interface OnboardingState {
    user: UserProfile;
    isAuthenticated: boolean;
    currentStep: number;
    updateUser: (data: Partial<UserProfile>) => void;
    setAuthenticated: (value: boolean) => void;
    setCurrentStep: (step: number) => void;
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

// Enhanced location interface
export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  locationType: 'HOME' | 'WORK' | 'MEDICAL' | 'OTHER';
}

// Enhanced service preferences
export interface ServicePreferences {
  preferredProviders: ServiceProvider[];
  vehicleType: VehicleType;
  driverGender: DriverGender;
  allowCompanion: boolean;
  allowPets: boolean;
  preferredPickupTime?: string;
  specialInstructions?: string;
}

// Enhanced communication preferences
export interface CommunicationPreferences {
  preferredLanguage: string;
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
  highContrast: boolean;
  voiceInstructions: boolean;
  textToSpeech: boolean;
  communicationStyle: 'VERBAL' | 'WRITTEN' | 'GESTURE' | 'MIXED';
}

// Payment and billing information
export interface BillingInformation {
  preferredPaymentMethods: PaymentMethod[];
  hasInsurance: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  hasDisabilityVouchers: boolean;
  billingContactId?: string; // Reference to emergency contact for billing
}