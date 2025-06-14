import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { OnboardingState, UserProfile } from '@/types/onboard';


const initialUserState: UserProfile = {
    fullName: '',
    email: '',
    phone: '',
    profilePicture: undefined,
    disabilityTypes: [],
    needsRamp: false,
    needsAssistiveDevice: false,
    needsSignLanguage: false,
    preferredContactMethod: 'WhatsApp',
    onboardingCompleted: false,
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