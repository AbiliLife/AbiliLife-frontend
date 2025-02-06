import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Landing = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Intro');
  }


  return (
    <SafeAreaView style={styles.container}>

      {/* Accessibility Menu Icon */}
      <View style={styles.accessibilityContainer}>
        <Ionicons name="accessibility" size={28} />
        <Text style={styles.accessibilityText}>Accessibility Menu</Text>
      </View>

      {/* Logo Placeholder */}
      <View style={styles.logoContainer}>
        <View style={styles.logo} />
      </View>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appNameText}>AbiliLife</Text>
        <Text style={styles.taglineText}>Improving the lives of PWDs</Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  accessibilityContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessibilityText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666666',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: '30%',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'black',
    borderRadius: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
  },
  appNameText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  taglineText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 24,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Landing;