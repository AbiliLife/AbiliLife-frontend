import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAccessibility } from '@/contexts/AccessibilityContext';

import { View, Text, useThemeColor } from '@/components/Themed';
import SearchBar from '@/components/common/SearchBar';
import AccessibilityOption from '@/components/accessibility/AccessibilityOption';
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';
import SideBarDrawer from '@/components/services/SideBarDrawer';

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
    id: 'mobility',
    title: 'AbiliLife Mobility',
    description: 'Accessible, affordable transportation',
    icon: 'wheelchair',
    iconType: 'fontawesome',
    iconColor: '#2196F3', // Yellow color
  },
  {
    id: 'healthcare',
    title: 'AbiliLife Care',
    description: 'Accessible healthcare services',
    icon: 'heart-outline',
    iconType: 'ionicons',
    iconColor: '#F44336', // Red color
    path: '/healthcare',
  },
  {
    id: 'assistiveTech',
    title: "AbiliLife Access",
    description: 'Assistive Tech Marketplace',
    icon: 'shopping-cart',
    iconType: 'fontawesome',
    iconColor: '#FF9800', // Orange color
  },
  {
    id: 'jobs',
    title: 'AbiliLife Work',
    description: 'Employment & Financial Inclusion',
    icon: 'briefcase-outline',
    iconType: 'materialcommunity',
    iconColor: '#4CAF50', // Green color
    path: '/employment',
  },
  {
    id: 'education',
    title: 'AbiliLife Learn',
    description: 'Inclusive Education & Skills Training',
    icon: 'book',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
    path: '/education',
  },
  {
    id: 'insurance',
    title: 'AbiliLife Insurance',
    description: 'Insurance & Financial Support',
    icon: 'shield',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
    path: '/insurance',
  },
]

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Theme colors
  const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');

  // Navigation items for the sidebar
  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: 'home',
      iconType: 'ionicons',
      title: 'Home',
      onPress: () => { closeSidebar(); router.push('/'); }
    },
    {
      id: 'services',
      icon: 'grid',
      iconType: 'ionicons',
      title: 'All Services',
      hasChevron: true,
      onPress: () => closeSidebar()
    },
    {
      id: 'accessibility',
      icon: 'settings',
      iconType: 'ionicons',
      title: 'Accessibility Settings',
      onPress: () => { closeSidebar(); toggleAccessibilityDrawer(); }
    },
    {
      id: 'feedback',
      icon: 'chatbubble-ellipses-outline',
      iconType: 'ionicons',
      title: 'Feedback & Support',
      onPress: () => closeSidebar()
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      iconType: 'ionicons',
      title: 'About AbiliLife',
      onPress: () => closeSidebar()
    },
  ];

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);

  // Function to render the appropriate icon for navigation items
  const renderNavIcon = (item: NavItem) => {
    const { iconType, icon } = item;

    switch (iconType) {
      case 'ionicons':
        return <Ionicons name={icon as any} size={22} color={primaryColor} />;
      case 'material':
        return <MaterialIcons name={icon as any} size={22} color={primaryColor} />;
      case 'fontawesome':
        return <FontAwesome5 name={icon as any} size={20} color={primaryColor} />;
      default:
        return <Ionicons name={icon as any} size={22} color={primaryColor} />;
    }
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={openSidebar} style={styles.headerButton}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
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
            Our Core Services
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
            >
              <View style={styles.iconContainer}>
                {renderServiceIcon(category)}
              </View>
              <Text style={styles.serviceTitle}>{category.title}</Text>
              {category.description && (
                <Text style={[styles.serviceTitle, { fontSize: 12, color: '#999', marginTop: 4 }]}>
                  {category.description}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Sidebar Navigation Drawer */}
      <SideBarDrawer 
        visible={isSidebarVisible}
        onClose={closeSidebar}
        textColor={textColor}
        primaryColor={primaryColor}
        navItems={navItems}
        renderIcon={renderNavIcon}
      />

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
    </SafeAreaView>
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
    paddingVertical: 50,
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
    textAlign: 'center',
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