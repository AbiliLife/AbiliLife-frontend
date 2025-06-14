export type DisabilityType = 'Physical' | 'Visual' | 'Hearing' | 'Cognitive' | 'Other';
export type ContactMethod = 'WhatsApp' | 'SMS' | 'Email';

export interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    profilePicture?: string;
    disabilityTypes: DisabilityType[];
    needsRamp: boolean;
    needsAssistiveDevice: boolean;
    needsSignLanguage: boolean;
    preferredContactMethod: ContactMethod;
    onboardingCompleted: boolean;
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