// screens/HealthcareScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import InsuranceSection from '../components/InsuranceComponent';

const HealthcareScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Healthcare Consultation Services</Text>
        <Card>
          <Card.Content>
            <Title>Telemedicine</Title>
            <Paragraph>Connect with healthcare professionals remotely.</Paragraph>
            <Button mode="contained" style={styles.button}>Book Appointment</Button>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Health Records</Title>
            <Paragraph>Access and manage your medical history securely.</Paragraph>
            <Button mode="outlined" style={styles.button}>View Records</Button>
          </Card.Content>
        </Card>
      </View>
      <InsuranceSection/>
    </>
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
  button: {
    marginTop: 10,
  },
});

export default HealthcareScreen;
