import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Icons
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/Home';
import Services from '../screens/Services';
import Healthcare from '../screens/Healthcare';
import MarketPlace from '../screens/MarketPlace';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            id={undefined}
            screenOptions={({ route }) => ({
                tabBarIcon: ({color, size }) => {
                    let iconName: any;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Services') {
                        iconName = 'list';
                    } else if (route.name === 'Healthcare') {
                        iconName = 'medkit';
                    } else if (route.name === 'MarketPlace') {
                        iconName = 'cart';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Services" component={Services} />
            <Tab.Screen name="Healthcare" component={Healthcare} />
            <Tab.Screen name="MarketPlace" component={MarketPlace} />
        </Tab.Navigator>
    )
}