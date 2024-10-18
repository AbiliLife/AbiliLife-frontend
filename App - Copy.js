// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import InsuranceScreen from './screens/InsuranceScreen';
import HealthcareScreen from './screens/HealthcareScreen';
import AssistiveTechScreen from './screens/AssistiveTechScreen';
import FinanceScreen from './screens/FinanceScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Insurance" component={InsuranceScreen} />
    <Tab.Screen name="Healthcare" component={HealthcareScreen} />
    <Tab.Screen name="Assistive Tech" component={AssistiveTechScreen} />
    <Tab.Screen name="Finance" component={FinanceScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" headerMode="none">
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;








