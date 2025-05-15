import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AccessibilityContextType {
    largeText: boolean;
    toggleLargeText: () => void;
    highContrast: boolean;
    toggleHighContrast: () => void;
    voiceFeedback: boolean;
    toggleVoiceFeedback: () => void;
    fontSize: number;
    adjustFontSize: (size: number) => void;
    screenReaderEnabled: boolean;
    handleScreenReaderToggle: () => void;
    accessibilityDrawerVisible: boolean;
    toggleAccessibilityDrawer: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
    children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
    const [largeText, setLargeText] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [voiceFeedback, setVoiceFeedback] = useState(false);
    const [fontSize, setFontSize] = useState(16); // Default font size
    const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
    const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = useState(false);

    const toggleLargeText = () => {
        setLargeText(!largeText);
    };

    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
    };

    const toggleVoiceFeedback = () => {
        setVoiceFeedback(!voiceFeedback);
    };

    const adjustFontSize = (size: number) => {
        setFontSize(size);
    }

    const handleScreenReaderToggle = () => {
        setScreenReaderEnabled(!screenReaderEnabled);
        if (screenReaderEnabled) {
            // Logic to disable screen reader
        } else {
            // Logic to enable screen reader
        }
    };

    const toggleAccessibilityDrawer = () => {
        setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
    };

    return (
        <AccessibilityContext.Provider
            value={{
                largeText,
                toggleLargeText,
                highContrast,
                toggleHighContrast,
                voiceFeedback,
                toggleVoiceFeedback,
                fontSize,
                adjustFontSize,
                screenReaderEnabled,
                handleScreenReaderToggle,
                accessibilityDrawerVisible,
                toggleAccessibilityDrawer,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = (): AccessibilityContextType => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};