import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAccessibility } from '@/contexts/AccessibilityContext';

import { View, Text, useThemeColor } from '@/components/Themed';
import SearchBar from '@/components/common/SearchBar';
import AccessibilityOption from '@/components/accessibility/AccessibilityOption';
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';

// Interface for navigation items
interface NavItem {
  id: string;
  icon: string;
  iconType: 'ionicons' | 'material' | 'fontawesome';
  title: string;
  hasChevron?: boolean;
  onPress: () => void;
}

// Interface for service categories
interface ServiceCategory {
  id: string;
  title: string;
  description?: string;
  icon: string;
  iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
  iconColor: string;
  path?: '/healthcare' | '/insurance' | '/education' | '/employment';
}

const allServices: ServiceCategory[] = [
  {
    id: 'healthcare',
    title: 'AbiliLife Care',
    description: 'Accessible healthcare services (currently in beta)',
    icon: 'heart-outline',
    iconType: 'ionicons',
    iconColor: '#F44336', // Red color
    path: '/healthcare',
  },
  {
    id: 'assistiveTech',
    title: "AbiliLife Access",
    description: 'Assistive Tech Marketplace (currently in beta)',
    icon: 'shopping-cart',
    iconType: 'fontawesome',
    iconColor: '#FF9800', // Orange color
  },
  {
    id: 'jobs',
    title: 'AbiliLife Work',
    description: 'Employment & Financial Inclusion (Our Promise)',
    icon: 'briefcase-outline',
    iconType: 'materialcommunity',
    iconColor: '#9E9E9E', // Grey color
    // Note: This path is currently not implemented
    path: '/employment',
  },
  {
    id: 'education',
    title: 'AbiliLife Learn',
    description: 'Inclusive Education & Skills Training (Our Promise)',
    icon: 'book',
    iconType: 'ionicons',
    iconColor: '#9E9E9E', // Grey color
    // Note: This path is currently not implemented
    path: '/education',
  },
  {
    id: 'insurance',
    title: 'AbiliLife Insurance',
    description: 'Insurance & Financial Support (Our Promise)',
    icon: 'shield',
    iconType: 'materialcommunity',
    iconColor: '#9E9E9E', // Grey color
    // Note: This path is currently not implemented
    path: '/insurance',
  },
]

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');


  // Function to render the appropriate icon for service categories
  const renderServiceIcon = (category: ServiceCategory) => {
    const { iconType, icon, iconColor } = category;

    switch (iconType) {
      case 'ionicons':
        return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={28} color={iconColor} />;
      case 'materialcommunity':
        return <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={28} color={iconColor} />;
      case 'fontawesome':
        return <FontAwesome5 name={icon as keyof typeof FontAwesome5.glyphMap} size={28} color={iconColor} />;
      default:
        return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={28} color={iconColor} />;
    }
  };

  return (
    <View>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: 'white' }]}>Services</Text>
        <Text style={[styles.headerSubtitle, { color: 'white' }]}>
          Find and access services tailored to your needs
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search for services..."
          value=""
          onChangeText={() => { }}
          onPress={() => { }}
        />

        {/* Services Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Our Main Service (Ongoing Beta)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.newServiceCard, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}
          onPress={() => router.push('/mobility')}
          activeOpacity={0.5}
        >
          <View style={styles.newIconContainer}>
            <FontAwesome5 name="wheelchair" size={28} color="#2196F3" />
          </View>
          <View style={styles.newCardContent}>
            <Text style={styles.serviceTitle}>AbiliLife Mobility</Text>
            <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              Accessible, affordable transportation
            </Text>
          </View>
        </TouchableOpacity>

        {/* Services Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Other Services
          </Text>
        </View>

        {/* Service Categories Grid */}
        <View style={styles.servicesGrid}>
          {allServices.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.serviceCard, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}
              onPress={() => router.push(category.path || '/services')}
              activeOpacity={0.5}
              disabled={category.path !== '/healthcare'}
            >
              <View style={styles.iconContainer}>
                {renderServiceIcon(category)}
              </View>
              <Text style={[styles.serviceTitle, { textAlign: 'center', color: (category.title !== 'AbiliLife Care' && category.title !== 'AbiliLife Access') ? '#999' : undefined }]}>
                {category.title}
              </Text>
              {category.description && (
                <Text style={[styles.serviceTitle, { fontSize: 12, color: (category.title !== 'AbiliLife Care' && category.title !== 'AbiliLife Access') ? '#999' : textColor, marginTop: 4, textAlign: 'center' }]}>
                  {category.description}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Accessibility Settings Button (fixed position) */}
      <AccessibilityOption
        handlePress={toggleAccessibilityDrawer}
      />

      {/* Accessibility Drawer */}
      {accessibilityDrawerVisible && (
        <AccessibilityDrawer
          handlePress={toggleAccessibilityDrawer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerContainer: {
    height: 150,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    borderBottomColor: '#7135B1',
    marginBottom: 16,
    backgroundColor: '#7135B1',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  serviceTitle: {
    fontSize: 16,
  },
  newServiceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newIconContainer: {
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  newCardContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});