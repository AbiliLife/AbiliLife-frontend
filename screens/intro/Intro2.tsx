import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { images } from '../../constants';

export default function Intro2() {
  return (
    <View style={styles.container}>
      <Image 
      source={images.intro} 
      />
      <Text style={styles.titleText}>HealthCare</Text>
      <Text style={styles.subtitleText}>TeleMedicine & Monitoring</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitleText: {
    fontSize: 16,
    marginTop: 8,
  },
});