// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './screens/HomeScreen';
import InsuranceScreen from './screens/InsuranceScreen';
import HealthcareScreen from './screens/HealthcareScreen';
import AssistiveTechScreen from './screens/AssistiveTechScreen';
import FinanceScreen from './screens/FinanceScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Insurance" component={InsuranceScreen} />
            <Tab.Screen name="Healthcare" component={HealthcareScreen} />
            <Tab.Screen name="Assistive Tech" component={AssistiveTechScreen} />
            <Tab.Screen name="Finance" component={FinanceScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;