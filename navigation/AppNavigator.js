import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// Import routes and screens
import { ROUTES } from '../constants/routes';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import HealthcareScreen from '../screens/HealthcareScreen';
import AssistiveTechScreen from '../screens/AssistiveTechScreen';
import FinanceScreen from '../screens/FinanceScreen';
import ServicesScreen from '../screens/MiniServicesScreen';
import WebViewScreen from '../screens/WebViewScreen';

// Import VoiceCommandButton
import VoiceCommandButton from '../components/VoiceCommandButton';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

// Global Voice Command Context
export const VoiceCommandContext = React.createContext({
  startVoiceCommand: () => {},
  stopVoiceCommand: () => {},
});

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case ROUTES.HOME:
            iconName = focused ? 'home' : 'home-outline';
            break;
          case ROUTES.SERVICES:
            iconName = focused ? 'shield-check' : 'shield-check-outline';
            break;
          case ROUTES.HEALTHCARE:
            iconName = focused ? 'hospital-box' : 'hospital-box-outline';
            break;
          case ROUTES.ASSISTIVE_TECH:
            iconName = focused ? 'wheelchair-accessibility' : 'human';
            break;
          case ROUTES.FINANCE:
            iconName = focused ? 'bank' : 'bank-outline';
            break;
        }

        return (
          <AnimatedIcon
            entering={FadeIn}
            exiting={FadeOut}
            name={iconName}
            size={size}
            color={color}
          />
        );
      },
    })}
  >
    <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
    <Tab.Screen name={ROUTES.SERVICES} component={ServicesScreen} />
    <Tab.Screen name={ROUTES.HEALTHCARE} component={HealthcareScreen} />
    <Tab.Screen name={ROUTES.ASSISTIVE_TECH} component={AssistiveTechScreen} />
    <Tab.Screen name={ROUTES.FINANCE} component={FinanceScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabs} />
    <Stack.Screen
      name={ROUTES.WEB_VIEW}
      component={WebViewScreen}
      options={({ route }) => ({
        headerShown: true,
        title: route.params?.title || 'WebView',
      })}
    />
  </Stack.Navigator>
);

const App = () => {
  const [isVoiceCommandActive, setIsVoiceCommandActive] = useState(false);
  const voiceCommandRef = useRef(null);

  const startVoiceCommand = () => {
    setIsVoiceCommandActive(true);
    // Implement global voice command logic here
    console.log('Global voice command started');
  };

  const stopVoiceCommand = () => {
    setIsVoiceCommandActive(false);
    // Implement global voice command stop logic here
    console.log('Global voice command stopped');
  };

  const handleVoiceCommand = (isListening) => {
    if (isListening) {
      startVoiceCommand();
    } else {
      stopVoiceCommand();
    }
  };

  return (
    <VoiceCommandContext.Provider value={{ startVoiceCommand, stopVoiceCommand }}>
      <PaperProvider>
        <SafeAreaProvider style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={ROUTES.SPLASH}
              screenOptions={{
                headerShown: false,
                cardStyleInterpolator: ({ current: { progress } }) => ({
                  cardStyle: { opacity: progress },
                }),
              }}
            >
              <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
              <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
              <Stack.Screen name={ROUTES.MAIN} component={MainStack} />
            </Stack.Navigator>
            
            {/* Global Voice Command Button */}
            <VoiceCommandButton 
              ref={voiceCommandRef}
              onVoiceCommand={handleVoiceCommand} 
            />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </VoiceCommandContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default App;