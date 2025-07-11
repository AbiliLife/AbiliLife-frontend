import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { OnboardingState, UserProfile } from '@/types/onboard';


const initialUserState: UserProfile = {
    fullName: '',
    email: '',
    phone: '',
    profilePicture: undefined,
    role: 'PWD',
    disabilityTypes: [],
    needsRamp: false,
    needsAssistiveDevice: false,
    needsSignLanguage: false,
    preferredContactMethod: 'WhatsApp',
    careRelationships: [],
    emergencyContacts: [],
    accessibilityPreferences: {
        mobility: {
            useWheelchair: false,
            needsRamp: false,
            needsAssistiveDevice: false,
            deviceType: undefined,
            transferAssistance: false,
        },
        visual: {
            isBlind: false,
            hasLowVision: false,
            needsLargeText: false,
            needsHighContrast: false,
            hasGuideAnimal: false,
        },
        hearing: {
            isDeaf: false,
            hasHearingLoss: false,
            needsSignLanguage: false,
            hasHearingAid: false,
            needsWrittenCommunication: false,
        },
        cognitive: {
            needsSimpleInstructions: false,
            needsExtraTime: false,
            hasMemorySupport: false,
            needsCompanion: false,
        },
    },
    preferredLanguage: 'English',
    savedLocations: [],
    servicePreferences: {
        preferredProviders: [],
        vehicleType: 'WHEELCHAIR_ACCESSIBLE',
        driverGender: 'NO_PREFERENCE',
        allowCompanion: true,
        allowPets: false,
        specialInstructions: undefined,
    },
    communicationPreferences: {
        preferredLanguage: 'English',
        fontSize: 'MEDIUM',
        highContrast: false,
        voiceInstructions: false,
        textToSpeech: false,
        communicationStyle: 'MIXED',
    },
    billingInformation: {
        preferredPaymentMethods: ['CASH'],
        hasInsurance: false,
        hasDisabilityVouchers: false,
    },
    notificationPreferences: {
        rideUpdates: true,
        emergencyAlerts: true,
        promotionalOffers: false,
        locationSharing: true,
    },
    medicalInformation: undefined,
    onboardingCompleted: false,
    profileCompleteness: 0,
};

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            user: initialUserState,
            isAuthenticated: false,
            currentStep: 0,
            updateUser: (data) => set((state) => ({
                user: { ...state.user, ...data }
            })),
            setAuthenticated: (value) => set({ isAuthenticated: value }),
            setCurrentStep: (step) => set({ currentStep: step }),
            resetOnboarding: () => set({
                user: initialUserState,
                isAuthenticated: false,
                currentStep: 0
            }),
        }),
        {
            name: 'abililife-onboarding',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);