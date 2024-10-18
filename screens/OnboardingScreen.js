// screens/OnboardingScreen.js
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Text, Button } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const carouselItems = [
    { title: 'Welcome', text: 'Empowering PWDs with accessible services' },
    { title: 'Insurance', text: 'Find tailored insurance plans' },
    { title: 'Healthcare', text: 'Access telemedicine and health services' },
    { title: 'Assistive Tech', text: 'Discover and purchase assistive devices' },
    { title: 'Finance', text: 'Manage your finances with ease' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const handleNext = () => {
    if (activeIndex < carouselItems.length - 1) {
      flatListRef.current.scrollToIndex({ index: activeIndex + 1 });
    } else {
      navigation.replace('Main');
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={carouselItems}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.indicatorContainer}>
        {carouselItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === activeIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
      <Button mode="contained" onPress={handleNext} style={styles.button}>
        {activeIndex === carouselItems.length - 1 ? 'Get Started' : 'Next'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  slide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#6200ee',
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default OnboardingScreen;