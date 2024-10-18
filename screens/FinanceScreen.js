// screens/FinanceScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, DataTable } from 'react-native-paper';

const FinanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Services</Text>
      <Card>
        <Card.Content>
          <Title>Account Overview</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Account</DataTable.Title>
              <DataTable.Title numeric>Balance</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
              <DataTable.Cell>Savings</DataTable.Cell>
              <DataTable.Cell numeric>$1,000</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Checking</DataTable.Cell>
              <DataTable.Cell numeric>$500</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Financial Planning</Title>
          <Paragraph>Get personalized advice for your financial goals.</Paragraph>
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

export default FinanceScreen;