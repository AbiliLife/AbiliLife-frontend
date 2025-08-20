import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
import { AccessibilitySettings, AccessibilityAction } from '@/types/accessibility';
interface AccessibilityState extends AccessibilitySettings {
    isLoading: boolean;
}

// Default Accessibility Settings
const defaultSettings: AccessibilitySettings = {
    textSizeMultiplier: 1.0,
    highContrast: false,
    screenReaderEnhanced: false,
    colorFilter: 'none',
    fabPosition: { x: 20, y: 100 },
    isMinimized: false,
};

const initialState: AccessibilityState = {
    ...defaultSettings,
    isLoading: true,
};

// Reducer function to handle accessibility actions
function accessibilityReducer(state: AccessibilityState, action: AccessibilityAction): AccessibilityState {
    switch (action.type) {
        case 'SET_TEXT_SIZE':
            return { ...state, textSizeMultiplier: action.payload };
        case 'TOGGLE_HIGH_CONTRAST':
            return { ...state, highContrast: !state.highContrast };
        case 'TOGGLE_SCREEN_READER':
            return { ...state, screenReaderEnhanced: !state.screenReaderEnhanced };
        case 'SET_COLOR_FILTER':
            return { ...state, colorFilter: action.payload };
        case 'SET_FAB_POSITION':
            return { ...state, fabPosition: action.payload };
        case 'TOGGLE_MINIMIZED':
            return { ...state, isMinimized: !state.isMinimized };
        case 'LOAD_SETTINGS':
            return { ...state, ...action.payload, isLoading: false };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
}

interface AccessibilityContextType {
    state: AccessibilityState;
    setTextSize: (size: number) => void;
    toggleHighContrast: () => void;
    toggleScreenReader: () => void;
    setColorFilter: (filter: AccessibilitySettings['colorFilter']) => void;
    setFabPosition: (position: { x: number; y: number }) => void;
    toggleMinimized: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = '@accessibility_settings'; // Key for AsyncStorage

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(accessibilityReducer, initialState);

    // Load settings on app start
    useEffect(() => {
        loadSettings();
    }, []);

    // Save settings whenever they change
    useEffect(() => {
        if (!state.isLoading) {
            saveSettings();
        }
    }, [state.textSizeMultiplier, state.highContrast, state.screenReaderEnhanced, state.colorFilter, state.fabPosition, state.isMinimized]);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                dispatch({ type: 'LOAD_SETTINGS', payload: { ...defaultSettings, ...parsedSettings } });
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            console.error('Failed to load accessibility settings:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const saveSettings = async () => {
        try {
            const settingsToSave: AccessibilitySettings = {
                textSizeMultiplier: state.textSizeMultiplier,
                highContrast: state.highContrast,
                screenReaderEnhanced: state.screenReaderEnhanced,
                colorFilter: state.colorFilter,
                fabPosition: state.fabPosition,
                isMinimized: state.isMinimized,
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
        } catch (error) {
            console.error('Failed to save accessibility settings:', error);
        }
    };

    const contextValue: AccessibilityContextType = {
        state,
        setTextSize: (size: number) => dispatch({ type: 'SET_TEXT_SIZE', payload: size }),
        toggleHighContrast: () => dispatch({ type: 'TOGGLE_HIGH_CONTRAST' }),
        toggleScreenReader: () => dispatch({ type: 'TOGGLE_SCREEN_READER' }),
        setColorFilter: (filter: AccessibilitySettings['colorFilter']) => dispatch({ type: 'SET_COLOR_FILTER', payload: filter }),
        setFabPosition: (position: { x: number; y: number }) => dispatch({ type: 'SET_FAB_POSITION', payload: position }),
        toggleMinimized: () => dispatch({ type: 'TOGGLE_MINIMIZED' }),
    };

    return (
        <AccessibilityContext.Provider value={contextValue}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}