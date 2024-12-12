import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

const HomeScreen = () => {
  const handleVoiceCommand = (isListening) => {
    // Implement your voice command logic here
    console.log('Voice command active:', isListening);
    
    // Example of potential navigation or command processing
    if (isListening) {
      // Start listening for commands
      // You might integrate a voice recognition service here
      // Or trigger a voice command modal/overlay
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AbiliLife</Text>
      <Card>
        <Card.Content>
          <Title>Quick Access</Title>
          <Paragraph>Access key features and services here.</Paragraph>
        </Card.Content>
      </Card>
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
});

export default HomeScreen;