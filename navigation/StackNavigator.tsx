import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import Landing from '../screens/Landing';
import Intro from '../screens/Intro';
import Welcome from '../screens/Welcome';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}