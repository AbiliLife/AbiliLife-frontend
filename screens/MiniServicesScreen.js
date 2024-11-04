import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Surface,
  Text,
  IconButton,
  useTheme,
  Searchbar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ServicesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const services_categories = [
    { id: 1, title: 'Education', icon: 'school', screen: 'Healthcare' },
    { id: 2, title: 'Entertainment', icon: 'movie', screen: 'Finance' },
    {
      id: 3,
      title: 'Events & Experience',
      icon: 'party-popper',
      screen: 'Assistive Tech',
    },
    {
      id: 4,
      title: 'Financial Services',
      icon: 'finance',
      screen: 'Finance',
    },
    { id: 5, title: 'Insurance Services', icon: 'shield', screen: 'Healthcare' },
  ];

  const frequents = [
    {
      id: 1,
      title: 'My Insurance',
      icon: 'shield-check',
      webview: 'https://inclusive-insurance-pwds.vercel.app/',
    },
    { id: 2, title: 'Telemedicine', icon: 'video', screen: 'Healthcare' },
    {
      id: 3,
      title: 'Assistive Tech',
      icon: 'wheelchair-accessibility',
      webview: 'https://assistive-technologies-for-pwd.vercel.app/',
    },
    { id: 4, title: 'Financial Services', icon: 'bank', screen: 'Finance' },
    {
      id: 5,
      title: 'Emergency Contact',
      icon: 'phone-alert',
      screen: 'Emergency',
    },
    {
      id: 6,
      title: 'Prothea Prosthetics',
      icon: 'doctor',
      webview: 'https://www.prothea.co.ke/',
    },
  ];

  const discover = [
    {
      id: 1,
      title: 'Tailored Coverage',
      icon: 'shield-plus',
      screen: 'Insurance',
    },
    {
      id: 2,
      title: 'File Claim',
      icon: 'file-document-edit',
      screen: 'Insurance',
    },
    { id: 3, title: 'Premium Payment', icon: 'credit-card', screen: 'Finance' },
    {
      id: 4,
      title: 'Insurance Eligibility',
      icon: 'clipboard-check',
      screen: 'Insurance',
    },
    {
      id: 5,
      title: 'Doctor Consultation',
      icon: 'doctor',
      webview: 'https://example.com/telemedicine',
    },
    {
      id: 6,
      title: 'Health Tracker',
      icon: 'heart-pulse',
      screen: 'Healthcare',
    },
    {
      id: 7,
      title: 'Medical Records',
      icon: 'folder-medical',
      screen: 'Healthcare',
    },
    {
      id: 8,
      title: 'Prescription Manager',
      icon: 'pill',
      screen: 'Healthcare',
    },
    {
      id: 9,
      title: 'Assistive Devices',
      icon: 'shopping-outline',
      screen: 'AssistiveTech',
    },
    {
      id: 10,
      title: 'Device Financing',
      icon: 'cash-multiple',
      screen: 'Finance',
    },
    {
      id: 11,
      title: 'Virtual Try-On',
      icon: 'augmented-reality',
      screen: 'AssistiveTech',
    },
    { id: 12, title: 'Apply for Loan', icon: 'hand-coin', screen: 'Finance' },
    {
      id: 13,
      title: 'Budget Planner',
      icon: 'calculator-variant',
      screen: 'Finance',
    },
    {
      id: 14,
      title: 'Support Groups',
      icon: 'account-group',
      webview: 'https://example.com/support-groups',
    },
    {
      id: 15,
      title: 'Accessibility Ratings',
      icon: 'star-check',
      screen: 'Accessibility',
    },
    { id: 16, title: 'Legal Resources', icon: 'gavel', screen: 'Advocacy' },
    {
      id: 17,
      title: 'Events & Workshops',
      icon: 'calendar-clock',
      webview: 'https://example.com/events',
    },
    {
      id: 18,
      title: 'Job Opportunities',
      icon: 'briefcase-search',
      screen: 'Employment',
    },
    {
      id: 19,
      title: 'PWD News',
      icon: 'newspaper-variant',
      webview: 'https://example.com/pwd-news',
    },
  ];

  // Filter function for items
  const filterItems = (items) => {
    if (!searchQuery) return items;
    const lowercaseQuery = searchQuery.toLowerCase();
    return items.filter((item) =>
      item.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  // // Memoize filtered results
  const filteredFrequents = useMemo(
    () => filterItems(frequents), [searchQuery]
  );
  const filteredDiscover = useMemo(() => filterItems(discover), [searchQuery]);

  const ServiceItem = ({ title, icon, screen, webview }) => (
    <TouchableOpacity
      onPress={() => {
        if (webview) {
          navigation.navigate('WebView', { url: webview, title });
        } else if (screen) {
          navigation.navigate(screen);
        }
      }}
      activeOpacity={0.7}>
      <Surface
        style={[styles.serviceItem, { backgroundColor: theme.colors.surface }]}
        elevation={1}>
        <IconButton
          icon={icon}
          size={32}
          style={[
            styles.icon,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          iconColor={theme.colors.primary}
        />
        <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
      </Surface>
    </TouchableOpacity>
  );

  const SectionTitle = ({ title, itemCount }) => (
    <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
      {title} {itemCount > 0 && `(${itemCount})`}
    </Text>
  );

  const NoResults = () => (
    <View style={styles.noResults}>
      <Text style={{ color: theme.colors.onBackground }}>
        No matching services found
      </Text>
    </View>
  );

  const hasResults =
    filteredFrequents.length > 0 ||
    filteredDiscover.length > 0;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search Mini-Services..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />

      <ScrollView style={styles.scrollView}>
        {/* Horizontal Scrollable Services Section */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalGrid}>
              {services_categories.map((item) => (
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


        {/* Only show sections if there are filtered results or no search query */}
        {(filteredFrequents.length > 0 || !searchQuery) && (
          <>
            <SectionTitle
              title="FREQUENTS"
              itemCount={filteredFrequents.length}
            />
            <View style={styles.section}>
              <View style={styles.grid}>
                {filteredFrequents.map((item) => (
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
          </>
        )}

        {(filteredDiscover.length > 0 || !searchQuery) && (
          <>
            <SectionTitle
              title="DISCOVER MORE"
              itemCount={filteredDiscover.length}
            />
            <View style={styles.section}>
              <View style={styles.grid}>
                {filteredDiscover.map((item) => (
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
          </>
        )}

        {searchQuery && !hasResults && <NoResults />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 2,
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
  noResults: {
    padding: 16,
    alignItems: 'center',
  },
});

export default ServicesScreen;
