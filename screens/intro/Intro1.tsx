import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { images } from '../../constants';

export default function Intro1() {
  return (
    <View style={styles.container}>
      <Image 
      source={images.insurance} 
      style={{width: 350, height: 350, borderRadius: 100}}
      alt='insurance'
      />
      <Text style={styles.titleText}>Inclusive Insurance</Text>
      <Text style={styles.subtitleText}>Tailored, Affordable plans</Text>
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