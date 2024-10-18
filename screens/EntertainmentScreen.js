// screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

const EntertainmentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AbiliLife Entertainment</Text>
      <Card>
        <Card.Content>
          <Title>Quick Access</Title>
          <Paragraph>Entertainment features and services here.</Paragraph>
        </Card.Content>
      </Card>
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
});

export default EntertainmentScreen;