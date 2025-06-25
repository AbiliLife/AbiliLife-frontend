import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

// Define the type for the theme context
type ThemeContextType = {
    currentTheme: 'light' | 'dark';
    isSystemTheme: boolean;
    toggleTheme: (newTheme: 'light' | 'dark') => void;
    toggleSystemTheme?: () => void;
}

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType>({
    currentTheme: 'light',
    isSystemTheme: false,
    toggleTheme: () => { },
    toggleSystemTheme: () => { }
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme(); // Get the system color scheme (light or dark)

    // State to manage the current theme and whether it's system-based
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [systemTheme, setSystemTheme] = useState<boolean>(false);

    // Load the theme from AsyncStorage when the component mounts and initializes the theme
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedThemeObject = await AsyncStorage.getItem('theme');
                const storedTheme = JSON.parse(storedThemeObject!);
                if (storedTheme) {
                    setTheme(storedTheme.mode);
                    setSystemTheme(storedTheme.isSystem);
                }
            } catch (error) {
                console.log("Error loading theme from AsyncStorage:", error);
            }
        }

        loadTheme();
    }, []);

    // Update the theme when the color scheme changes.
    useEffect(() => {
        if (colorScheme && systemTheme) {
            const themeObject = {
                mode: colorScheme as 'light' | 'dark',
                isSystem: true
            };
            AsyncStorage.setItem('theme', JSON.stringify(themeObject));
            setTheme(colorScheme as 'light' | 'dark');
            setSystemTheme(true);
        }
    }, [colorScheme]);

    // Functions to toggle the theme and system theme
    // These functions update the theme in state and AsyncStorage
    // They also ensure that the system theme is correctly set based on the color scheme
    const toggleTheme = (newTheme: 'light' | 'dark') => {
        const themeObject = {
            mode: newTheme,
            isSystem: false
        };
        AsyncStorage.setItem('theme', JSON.stringify(themeObject));
        setTheme(newTheme);
        setSystemTheme(false);
    }
    const toggleSystemTheme = () => {
        if (colorScheme) {
            const themeObject = {
                mode: colorScheme,
                isSystem: true
            };
            AsyncStorage.setItem('theme', JSON.stringify(themeObject));
            setTheme(colorScheme as 'light' | 'dark');
            setSystemTheme(true);
        }
    }

    return (
        <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme, toggleSystemTheme, isSystemTheme: systemTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;