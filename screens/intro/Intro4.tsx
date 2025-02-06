import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Images
import images from '../../constants/images';

export default function Intro4() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Main Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={images.community}
          style={{ width: 350, height: 350, borderRadius: 100 }}
          alt='community'
        />
      </View>

      {/* Text Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>COMMUNITY</Text>
        <Text style={styles.subtitle}>Support & Advocacy</Text>
      </View>
    </SafeAreaView>
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
  imageContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 30,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
});