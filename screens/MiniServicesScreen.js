import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ServicesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const services = [
    { id: 1, title: 'Education', icon: 'school', screen: 'Healthcare' },
    { id: 2, title: 'Entertainment', icon: 'movie', screen: 'Finance' },
    { id: 3, title: 'Events & Experience', icon: 'event', screen: 'Assistive Tech' },
    { id: 4, title: 'Financial Services', icon: 'account-balance', screen: 'Finance' },
    { id: 5, title: 'Get Insurance', icon: 'shield', screen: 'Healthcare' },
  ];

  const frequents = [
    { id: 1, title: 'GlobalPay', icon: 'shopping', screen: 'Finance' },
    { id: 2, title: 'eZawadi', icon: 'gift', screen: 'Finance' },
    { id: 3, title: 'Buy gift vouchers', icon: 'card-giftcard', screen: 'Finance' },
    { id: 4, title: 'Hustler Fund', icon: 'account-balance-wallet', screen: 'Finance' },
  ];

  const discover = [
    { id: 1, title: 'DEVICE COVER', icon: 'phone-iphone', webview: 'https://example.com/device-cover' },
    { id: 2, title: 'BOOK A FLIGHT', icon: 'flight', webview: 'https://example.com/book-flight' },
    { id: 3, title: 'CHARGE-ON-THE-GO', icon: 'battery-charging-full', screen: 'Services' },
    { id: 4, title: 'MPESA GO', icon: 'phone-android', screen: 'Finance' },
    { id: 5, title: 'THE STANDARD', icon: 'newspaper', webview: 'https://www.standardmedia.co.ke/' },
    { id: 6, title: 'GLOBAL DUKA', icon: 'store', webview: 'https://example.com/global-duka' },
    { id: 7, title: 'MAJIAPP', icon: 'water', screen: 'Services' },
    { id: 8, title: 'SHELL CLUB', icon: 'local-gas-station', webview: 'https://example.com/shell-club' },
    { id: 9, title: 'MARINE CARGO', icon: 'directions-boat', screen: 'Services' },
    { id: 10, title: 'M-PESA RATIBA', icon: 'schedule', screen: 'Finance' },
    { id: 11, title: 'TAAM TRAVEL', icon: 'flight-takeoff', webview: 'https://example.com/taam-travel' },
    { id: 12, title: 'MDAKTARI', icon: 'local-hospital', webview: 'https://example.com/mdaktari' },
  ];

  const ServiceItem = ({ title, icon, screen, webview }) => (
    <TouchableOpacity 
      onPress={() => {
        if (webview) {
          navigation.navigate('WebView', { url: webview, title });
        } else if (screen) {
          navigation.navigate(screen);
        }
      }}
      activeOpacity={0.7}
    >
      <Surface style={[styles.serviceItem, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <IconButton
          icon={icon}
          size={32}
          style={[styles.icon, { backgroundColor: theme.colors.surfaceVariant }]}
          iconColor={theme.colors.primary}
        />
        <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>{title}</Text>
      </Surface>
    </TouchableOpacity>
  );

  const SectionTitle = ({ title }) => (
    <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>{title}</Text>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Horizontal Scrollable Services Section */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalGrid}>
              {services.map((item) => (
                <ServiceItem 
                  key={item.id} 
                  title={item.title} 
                  icon={item.icon} 
                  screen={item.screen}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <SectionTitle title="FREQUENTS" />
        <View style={styles.section}>
          <View style={styles.grid}>
            {frequents.map((item) => (
              <ServiceItem 
                key={item.id} 
                title={item.title} 
                icon={item.icon} 
                screen={item.screen}
              />
            ))}
          </View>
        </View>

        <SectionTitle title="DISCOVER MORE" />
        <View style={styles.section}>
          <View style={styles.grid}>
            {discover.map((item) => (
              <ServiceItem 
                key={item.id} 
                title={item.title} 
                icon={item.icon} 
                screen={item.screen}
                webview={item.webview}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  horizontalGrid: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  serviceItem: {
    width: 80,
    marginRight: 16,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderRadius: 8,
  },
  icon: {
    margin: 0,
    borderRadius: 20,
  },
  itemText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ServicesScreen;