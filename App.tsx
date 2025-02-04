import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import StackNavigator from './navigation/StackNavigator';
import Splash from './screens/Splash';

export default function App() {
  const [isShowSplash, setIsShowSplash] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        {isShowSplash ? (
          <Splash />
        ) : (
          <StackNavigator />
        )}
      </NavigationContainer>
    </>
  );
}