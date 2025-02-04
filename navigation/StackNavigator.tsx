import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Intro from '../screens/Intro';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}