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
    { id: 5, title: 'Insurance Services', icon: 'shield', screen: 'Healthcare' },
  ];

  const frequents = [
  { id: 1, title: 'My Insurance', icon: 'shield-check', webview: 'https://inclusive-insurance-pwds.vercel.app/' },
  { id: 2, title: 'Telemedicine', icon: 'video', screen: 'Healthcare' },
  { id: 3, title: 'Assistive Tech', icon: 'wheelchair-accessibility', webview: 'https://assistive-technologies-for-pwd.vercel.app/' },
  { id: 4, title: 'Financial Services', icon: 'bank', screen: 'Finance' },
  { id: 5, title: 'Emergency Contact', icon: 'phone-alert', screen: 'Emergency' },
  { id: 6, title: 'Prothea', icon: 'doctor', webview: 'https://www.prothea.co.ke/' }, 
];

const discover = [
  { id: 1, title: 'Tailored Coverage', icon: 'shield-plus', screen: 'Insurance' },
  { id: 2, title: 'File Claim', icon: 'file-document-edit', screen: 'Insurance' },
  { id: 3, title: 'Premium Payment', icon: 'credit-card', screen: 'Finance' },
  { id: 4, title: 'Insurance Eligibility', icon: 'clipboard-check', screen: 'Insurance' },
  { id: 5, title: 'Doctor Consultation', icon: 'doctor', webview: 'https://example.com/telemedicine' },
  { id: 6, title: 'Health Tracker', icon: 'heart-pulse', screen: 'Healthcare' },
  { id: 7, title: 'Medical Records', icon: 'folder-medical', screen: 'Healthcare' },
  { id: 8, title: 'Prescription Manager', icon: 'pill', screen: 'Healthcare' },
  { id: 9, title: 'Assistive Devices', icon: 'shopping-outline', screen: 'AssistiveTech' },
  { id: 10, title: 'Device Financing', icon: 'cash-multiple', screen: 'Finance' },
  { id: 11, title: 'Virtual Try-On', icon: 'augmented-reality', screen: 'AssistiveTech' },
  { id: 12, title: 'Apply for Loan', icon: 'hand-coin', screen: 'Finance' },
  { id: 13, title: 'Budget Planner', icon: 'calculator-variant', screen: 'Finance' },
  { id: 14, title: 'Support Groups', icon: 'account-group', webview: 'https://example.com/support-groups' },
  { id: 15, title: 'Accessibility Ratings', icon: 'star-check', screen: 'Accessibility' },
  { id: 16, title: 'Legal Resources', icon: 'gavel', screen: 'Advocacy' },
  { id: 17, title: 'Events & Workshops', icon: 'calendar-clock', webview: 'https://example.com/events' },
  { id: 18, title: 'Job Opportunities', icon: 'briefcase-search', screen: 'Employment' },
  { id: 19, title: 'PWD News', icon: 'newspaper-variant', webview: 'https://example.com/pwd-news' },
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
                webview={item.webview}
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