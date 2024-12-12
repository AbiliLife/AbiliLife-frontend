import React, { useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, Card, Title, Paragraph, IconButton, TouchableRipple } from 'react-native-paper';

const HomeScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const pulseAnim = new Animated.Value(0);

  const handleVoiceCommand = () => {
    const newListeningState = !isListening;
    setIsListening(newListeningState);

    if (newListeningState) {
      // Start pulse animation when listening
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      // Stop pulse animation when not listening
      pulseAnim.setValue(0);
    }

    // TODO: Implement actual voice command logic
    console.log('Voice command button pressed');
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0]
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AbiliLife</Text>
      <Card>
        <Card.Content>
          <Title>Quick Access</Title>
          <Paragraph>Access key features and services here.</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.voiceButtonContainer}>
        {/* Pulse background */}
        <Animated.View 
          style={[
            styles.pulseBg, 
            {
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
              backgroundColor: isListening ? '#007bff' : '#f0f0f0'
            }
          ]} 
        />

        {/* Main button */}
        <TouchableRipple
          style={[
            styles.voiceButton, 
            isListening && styles.voiceButtonActive
          ]}
          onPress={handleVoiceCommand}
          rippleColor="rgba(0, 123, 255, 0.3)"
        >
          <IconButton 
            icon="microphone" 
            iconColor={isListening ? 'white' : 'black'}
            size={24} 
          />
        </TouchableRipple>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  voiceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  voiceButtonActive: {
    backgroundColor: '#007bff',
  },
});

export default HomeScreen;