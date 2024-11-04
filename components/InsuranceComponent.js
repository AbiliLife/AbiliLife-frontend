// components/InsuranceComponent.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

const InsuranceComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insurance Services</Text>
      <Card>
        <Card.Content>
          <Title>Find Your Plan</Title>
          <Paragraph>Explore tailored insurance options for PWDs.</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Claim Management</Title>
          <Paragraph>Easily manage and track your insurance claims.</Paragraph>
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
  card: {
    marginTop: 16,
  },
});

export default InsuranceComponent;