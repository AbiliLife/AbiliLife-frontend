import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { images } from '../../constants';

export default function Intro3() {
  return (
    <View style={styles.container}>
      <Image 
      source={images.marketplace}
      style={{width: 350, height: 350, borderRadius: 100}} 
      />
      <Text style={styles.titleText}>Assistive Tech</Text>
      <Text style={styles.subtitleText}>Marketplace & Financing</Text>
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