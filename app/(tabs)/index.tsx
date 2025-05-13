import React from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

import { Text, useThemeColor, View } from '@/components/Themed';
import SearchBar from '@/components/SearchBar';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Interface for service categories
interface ServiceCategory {
  id: string;
  title: string;
  icon: 'heart-outline' | 'book' | 'briefcase-outline' | 'shield';
  iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
  iconColor: string;
}

// Interface for recent activities
interface Activity {
  id: string;
  title: string;
  details: string;
}


// Service categories data
const serviceCategories: ServiceCategory[] = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: 'heart-outline',
    iconType: 'ionicons',
    iconColor: '#F44336', // Red color
  },
  {
    id: 'insurance',
    title: 'Insurance',
    icon: 'shield',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'education',
    title: 'Education',
    icon: 'book',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
  },
  {
    id: 'jobs',
    title: 'Jobs',
    icon: 'briefcase-outline',
    iconType: 'materialcommunity',
    iconColor: '#4CAF50', // Green color
  },
];

// Recent activities data
const recentActivities: Activity[] = [
  {
    id: 'medical-appointment',
    title: 'Medical Appointment',
    details: 'Scheduled for tomorrow at 10:00 AM',
  },
  {
    id: 'job-application',
    title: 'Job Application',
    details: 'Status: Under review',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = React.useState(false);

  const toggleAccessibilityDrawer = () => {
    setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
  };

  // Theme Colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333' }, 'background');
  const cardBgColor = useThemeColor({ light: '#fff', dark: '#333' }, 'background');
  const secondaryTextColor = useThemeColor({ light: '#666', dark: '#aaa' }, 'text');

  // Function to render the appropriate icon
  const renderIcon = (category: ServiceCategory) => {
    const { iconType, icon, iconColor } = category;

    switch (iconType) {
      case 'ionicons':
        return <Ionicons name={icon} size={28} color={iconColor} />;
      case 'materialcommunity':
        return <MaterialCommunityIcons name={icon} size={28} color={iconColor} />;
      case 'fontawesome':
        return <FontAwesome5 name={icon} size={28} color={iconColor} />;
      default:
        return <Ionicons name={icon} size={28} color={iconColor} />;
    }
  };

  return (
    <>
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
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Services
          </Text>
          <TouchableOpacity onPress={() => { }} activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: colorScheme === 'dark' ? '#888' : '#7135B1' }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Service Categories Grid */}
        <View style={styles.servicesGrid}>
          {serviceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.serviceCard, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}
              onPress={() => console.log(`${category.title} pressed`)}
              activeOpacity={0.5}
            >
              <View style={styles.iconContainer}>
                {renderIcon(category)}
              </View>
              <Text style={styles.serviceTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Recommended
          </Text>
        </View>

        {/* Voice Navigation Tutorial Card */}
        <View style={[styles.tutorialCard, { borderColor }]}>
          <View style={styles.tutorialContent}>
            <View style={styles.tutorialHeader}>
              <Text style={styles.tutorialTitle}>Voice Navigation Tutorial</Text>
              <Text style={styles.tutorialDescription}>
                Learn how to navigate AbiliLife with just your voice
              </Text>
            </View>
            <View style={[styles.tutorialFooter, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}>
              <View style={styles.tutorialTimeContainer}>
                <Ionicons name="mic" size={24} color={textColor} />
                <Text style={styles.tutorialTimeText}>3 minute guide</Text>
              </View>
              <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Activities Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Recent Activities
          </Text>
        </View>

        {/* Activities List */}
        {recentActivities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={[styles.activityCard, { backgroundColor: cardBgColor }]}
            activeOpacity={0.7}
          >
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: textColor }]}>{activity.title}</Text>
              <Text style={[styles.activityDetails, { color: secondaryTextColor }]}>{activity.details}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
      {/* Accessibility Settings Button (fixed position) */}
      <TouchableOpacity
        style={styles.accessibilityButton}
        onPress={toggleAccessibilityDrawer}
        activeOpacity={0.9}
      >
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Accessibility Settings Button (fixed position) */}
      <TouchableOpacity
        style={styles.accessibilityButton}
        onPress={toggleAccessibilityDrawer}
        activeOpacity={0.9}
      >
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Accessibility Drawer */}
      {accessibilityDrawerVisible && (
        <View style={styles.accessibilityDrawerOverlay}>
          <Pressable
            style={styles.accessibilityDrawerDismiss}
            onPress={toggleAccessibilityDrawer}
          />
          <View style={styles.accessibilityDrawer}>
            <View style={styles.accessibilityDrawerContent}>
              <Text style={styles.accessibilityDrawerTitle}>Accessibility Settings</Text>

              <TouchableOpacity style={styles.accessibilityOption}>
                <Text style={styles.accessibilityOptionText}>Voice Commands</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessibilityOption}>
                <Text style={styles.accessibilityOptionText}>Text Size</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessibilityOption}>
                <Text style={styles.accessibilityOptionText}>High Contrast</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessibilityOption}>
                <Text style={styles.accessibilityOptionText}>Screen Reader</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  viewAllText: {
    fontSize: 14,
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
  // Tutorial Card Styles
  tutorialCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  tutorialContent: {
  },
  tutorialHeader: {
    padding: 16,
    backgroundColor: '#7135B1', // Purple background
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff', // White text color
  },
  tutorialDescription: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
    color: '#fff', // White text color
  },
  tutorialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tutorialTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tutorialTimeText: {
    marginLeft: 8,
    fontSize: 14,
  },
  startButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#9C27B0',
  },
  startButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Activity Card Styles
  activityCard: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  activityContent: {
    backgroundColor: 'transparent',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
  },
  // Accessibility Button Styles
  accessibilityButton: {
    position: 'absolute',
    bottom: 80, // Position above bottom tabs
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7135B1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  // Accessibility Drawer Styles
  accessibilityDrawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1001,
  },
  accessibilityDrawerDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1002,
  },
  accessibilityDrawer: {
    position: 'absolute',
    right: 20,
    bottom: 150, // Position above the accessibility button
    zIndex: 1003,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: 250,
  },
  accessibilityDrawerContent: {
    backgroundColor: '#f8f2ff', // Light purple background
    padding: 16,
  },
  accessibilityDrawerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7135B1',
    marginBottom: 16,
    textAlign: 'center',
  },
  accessibilityOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  accessibilityOptionText: {
    fontSize: 16,
    color: '#46216E',
  },
});
