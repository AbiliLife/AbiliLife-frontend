/*
 ** AbiliLife Onboarding Store
 ** This file contains the Zustand store for managing the onboarding state.
*/

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Onboarding types
import { OnboardingState, UserProfile } from '@/types/onboard';


const initialUserState: UserProfile = {
    fullName: '',
    email: '',
    phone: '',
    profilePicture: undefined,
    isEmailVerified: false,
    isPhoneVerified: false,
    role: null,
    disabilityTypes: [],
    preferredContactMethod: null,
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
    hasSeenOnboardingSlide: false,
    onboardingCompleted: false,
    profileCompleteness: 0,
};

export const useOnboardingStore = create<OnboardingState>()(
    // Zustand middleware for persistence
    // persist - saves the state to storage using AsyncStorage
    persist(
        (set) => ({
            user: initialUserState,
            currentOnboardingStep: 1, // Start at step 1, end at step 5
            completedSteps: [], // Track completed steps
            updateUser: (data) => set((state) => ({
                user: { ...state.user, ...data }
            })),
            setCurrentOnboardingStep: (step) => set({ currentOnboardingStep: step }),
            setCompletedSteps: (steps) => set({ completedSteps: steps }),
            resetOnboarding: () => set({
                user: initialUserState,
                currentOnboardingStep: 0,
                completedSteps: []
            }),
        }),
        {
            name: 'abililife-onboarding', // Name of the storage (must be unique)
            storage: createJSONStorage(() => AsyncStorage), // Combining createJSONStorage helps creating a persist storage with JSON.parse and JSON.stringify.
        }
    )
);