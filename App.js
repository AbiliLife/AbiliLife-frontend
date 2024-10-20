// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// Import screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import HealthcareScreen from './screens/HealthcareScreen';
import AssistiveTechScreen from './screens/AssistiveTechScreen';
import FinanceScreen from './screens/FinanceScreen';
import ServicesScreen from './screens/MiniServicesScreen';
import WebViewScreen from './screens/WebViewScreen'; // Add this import

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Services') {
          iconName = focused ? 'shield-check' : 'shield-check-outline';
        } else if (route.name === 'Healthcare') {
          iconName = focused ? 'hospital-box' : 'hospital-box-outline';
        } else if (route.name === 'Assistive Tech') {
          iconName = focused ? 'wheelchair-accessibility' : 'human';
        } else if (route.name === 'Finance') {
          iconName = focused ? 'bank' : 'bank-outline';
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
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Services" component={ServicesScreen} />
    <Tab.Screen name="Healthcare" component={HealthcareScreen} />
    <Tab.Screen name="Assistive Tech" component={AssistiveTechScreen} />
    <Tab.Screen name="Finance" component={FinanceScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen 
      name="WebView" 
      component={WebViewScreen}
      options={({ route }) => ({ 
        headerShown: true,
        title: route.params.title || 'WebView',
      })}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Splash" 
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: ({ current: { progress } }) => ({
                cardStyle: {
                  opacity: progress,
                },
              }),
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;