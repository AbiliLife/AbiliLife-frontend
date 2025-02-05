import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import store from './store/store';
import { Provider } from 'react-redux';

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
    <Provider store={store}>
      <StatusBar style="auto" />
      <NavigationContainer>
        {isShowSplash ? (
          <Splash />
        ) : (
          <StackNavigator />
        )}
      </NavigationContainer>
    </Provider>
  );
}