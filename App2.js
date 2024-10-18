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
import EducationScreen from './screens/EducationScreen';
import EntertainmentScreen from './screens/EntertainmentScreen';
import InsuranceScreen from './screens/InsuranceScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ServicesStack = createStackNavigator();

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const ServicesStackScreen = () => (
  <ServicesStack.Navigator>
    <ServicesStack.Screen 
      name="ServicesMain" 
      component={ServicesScreen}
      options={{ headerShown: false }}
    />
    <ServicesStack.Screen 
      name="Education" 
      component={EducationScreen}
      options={{ 
        headerShown: true,
        title: 'Education Services'
      }}
    />
    <ServicesStack.Screen 
      name="Entertainment" 
      component={EntertainmentScreen}
      options={{ 
        headerShown: true,
        title: 'Entertainment'
      }}
    />
    <ServicesStack.Screen 
      name="Insurance" 
      component={InsuranceScreen}
      options={{ 
        headerShown: true,
        title: 'Insurance Services'
      }}
    />
  </ServicesStack.Navigator>
);

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
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#000000',
        borderTopColor: '#333333',
      },
      tabBarLabelStyle: {
        fontSize: 12,
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Services" 
      component={ServicesStackScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Healthcare" 
      component={HealthcareScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Assistive Tech" 
      component={AssistiveTechScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Finance" 
      component={FinanceScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
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
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;