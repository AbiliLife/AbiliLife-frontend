
// screens/AssistiveTechScreen.js
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';

const AssistiveTechScreen = () => {
  const devices = [
    { id: '1', name: 'Smart Hearing Aid', description: 'AI-powered hearing assistance' },
    { id: '2', name: 'Eye-controlled Wheelchair', description: 'Navigate with eye movements' },
    { id: '3', name: 'Braille Tablet', description: 'Tactile display for reading and writing' },
  ];

  const renderDevice = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.description}</Paragraph>
        <Button mode="contained" style={styles.button}>Learn More</Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assistive Technology</Text>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
  },
});

export default AssistiveTechScreen;

