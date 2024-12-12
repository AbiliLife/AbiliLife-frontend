import React, { useState, forwardRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { IconButton, TouchableRipple } from 'react-native-paper';

const VoiceCommandButton = forwardRef(({ 
  onVoiceCommand, 
  position = 'bottom-right', 
  customStyle={
    bottom: 100,
    right: 35   
  },
  buttonSize = 60,
  colors = {
    inactive: '#f0f0f0',
    active: '#007bff',
    icon: {
      inactive: 'black',
      active: 'white'
    }
  }
}, ref) => {
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

    // Call the provided onVoiceCommand prop
    if (onVoiceCommand) {
      onVoiceCommand(newListeningState);
    }
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0]
  });

  // Determine positioning styles
  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute',
      width: buttonSize,
      height: buttonSize,
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: 16, left: 16 };
      case 'top-right':
        return { ...baseStyle, top: 16, right: 16 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 16, left: 16 };
      case 'bottom-right':
      default:
        return { ...baseStyle, bottom: 16, right: 16 };
    }
  };

  return (
    <View style={[getPositionStyle(), customStyle]}>
      {/* Pulse background */}
      <Animated.View 
        style={[
          styles.pulseBg, 
          {
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
            backgroundColor: isListening ? colors.active : colors.inactive
          }
        ]} 
      />

      {/* Main button */}
      <TouchableRipple
        style={[
          styles.voiceButton, 
          { 
            width: buttonSize, 
            height: buttonSize, 
            borderRadius: buttonSize / 2,
            backgroundColor: isListening ? colors.active : colors.inactive 
          }
        ]}
        onPress={handleVoiceCommand}
        rippleColor="rgba(0, 123, 255, 0.3)"
      >
        <IconButton 
          icon="microphone" 
          iconColor={isListening ? colors.icon.active : colors.icon.inactive}
          size={24} 
        />
      </TouchableRipple>
    </View>
  );
});

const styles = StyleSheet.create({
  pulseBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  voiceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
});

export default VoiceCommandButton;