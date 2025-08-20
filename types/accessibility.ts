export interface AccessibilitySettings {
    textSizeMultiplier: number;
    highContrast: boolean;
    screenReaderEnhanced: boolean;
    colorFilter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
    fabPosition: { x: number; y: number };
    isMinimized: boolean;
}

export type AccessibilityAction =
    | { type: 'SET_TEXT_SIZE'; payload: number }
    | { type: 'TOGGLE_HIGH_CONTRAST' }
    | { type: 'TOGGLE_SCREEN_READER' }
    | { type: 'SET_COLOR_FILTER'; payload: AccessibilitySettings['colorFilter'] }
    | { type: 'SET_FAB_POSITION'; payload: { x: number; y: number } }
    | { type: 'TOGGLE_MINIMIZED' }
    | { type: 'LOAD_SETTINGS'; payload: AccessibilitySettings }
    | { type: 'SET_LOADING'; payload: boolean };