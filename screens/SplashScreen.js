// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000); // 3 seconds

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]); // Include navigation in the dependency array

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AbiliLife</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SplashScreen;