import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  View as RNView,
  Pressable,
  useColorScheme,
  ScrollView
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { View, Text, useThemeColor } from '@/components/Themed';
import SearchBar from '@/components/SearchBar';

// Dimensions for the sidebar
const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

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
  icon: string;
  iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
  iconColor: string;
  path?: '/healthcare' | '/insurance' | '/education' | '/employment';
}

const allServices: ServiceCategory[] = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: 'heart-outline',
    iconType: 'ionicons',
    iconColor: '#F44336', // Red color
    path: '/healthcare',
  },
  {
    id: 'insurance',
    title: 'Insurance',
    icon: 'shield',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
    path: '/insurance',
  },
  {
    id: 'education',
    title: 'Education',
    icon: 'book',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
    path: '/education',
  },
  {
    id: 'jobs',
    title: 'Jobs',
    icon: 'briefcase-outline',
    iconType: 'materialcommunity',
    iconColor: '#4CAF50', // Green color
    path: '/employment',
  },
  {
    id: 'marketplace',
    title: "Assistive Tech",
    icon: 'shopping-cart',
    iconType: 'fontawesome',
    iconColor: '#FF9800', // Orange color
  }
]

const serviceData = {
  healthcare: {
    title: 'Healthcare',
    icon: 'heart-outline',
    iconColor: '#F44336', // Red color
    iconType: 'ionicons',
    features: [
      { title: "Accessible Clinics", icon: "search", iconType: "ionicons" },
      { title: "Book Appointments", icon: "calendar", iconType: "ionicons" },
      { title: "Medication Reminders", icon: "alarm", iconType: "ionicons" },
      { title: "Health Records", icon: "folder", iconType: "ionicons" },
      { title: "Telehealth Services", icon: "videocam", iconType: "ionicons" },
      { title: "Emergency Assistance", icon: "medkit", iconType: "ionicons" },
    ]
  },
  insurance: {
    title: 'Insurance',
    icon: 'shield',
    iconColor: '#9C27B0', // Purple color
    iconType: 'materialcommunity',
    features: [
      { title: "Disability Coverage", icon: "shield-check", iconType: "materialcommunity" },
      { title: "File Claims", icon: "file-document", iconType: "materialcommunity" },
      { title: "Claim Status", icon: "check-circle", iconType: "materialcommunity" },
      { title: "Accessible Providers", icon: "account-search", iconType: "materialcommunity" },
      { title: "Coverage Details", icon: "information-outline", iconType: "materialcommunity" },
      { title: "Support Hotline", icon: "phone", iconType: "materialcommunity" },
    ]
  },
  education: {
    title: 'Education',
    icon: 'book',
    iconColor: '#2196F3', // Blue color
    iconType: 'ionicons',
    features: [
      { title: "Accessible Courses", icon: "school", iconType: "ionicons" },
      { title: "One-on-One Tutoring", icon: "person", iconType: "ionicons" },
      { title: "Assistive Resources", icon: "library", iconType: "ionicons" },
      { title: "Scholarships for Disabilities", icon: "cash", iconType: "ionicons" },
      { title: "Inclusive Events", icon: "calendar", iconType: "ionicons" },
      { title: "Support Groups", icon: "people", iconType: "ionicons" },
    ]
  },
  jobs: {
    title: 'Jobs',
    icon: 'briefcase-outline',
    iconColor: '#4CAF50', // Green color
    iconType: 'materialcommunity',
    features: [
      { title: "Accessible Job Listings", icon: "briefcase-search", iconType: "materialcommunity" },
      { title: "Resume Builder", icon: "file-document-edit", iconType: "materialcommunity" },
      { title: "Interview Prep", icon: "account-question", iconType: "materialcommunity" },
      { title: "Networking Opportunities", icon: "account-network", iconType: "materialcommunity" },
      { title: "Career Counseling", icon: "account-cog", iconType: "materialcommunity" },
      { title: "Job Alerts", icon: "bell-ring", iconType: "materialcommunity" },
    ]
  },
  marketplace: {
    title: 'Assistive Tech',
    icon: 'shopping-cart',
    iconColor: '#FF9800', // Orange color
    iconType: 'fontawesome',
    features: [
      { title: "Assistive Products", icon: "box", iconType: "fontawesome" },
      { title: "Product Reviews", icon: "star", iconType: "fontawesome" },
      { title: "Special Deals", icon: "tag", iconType: "fontawesome" },
      { title: "Wishlist", icon: "heart", iconType: "fontawesome" },
      { title: "Order Tracking", icon: "truck", iconType: "fontawesome" },
      { title: "Customer Support", icon: "headset", iconType: "fontawesome" },
    ]
  }
};

export default function ServicesScreen() {
  const colorScheme = useColorScheme();

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = React.useState(false);

  const toggleAccessibilityDrawer = () => {
    setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
  };

  // Animation values
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // Theme colors
  const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: 'home',
      iconType: 'ionicons',
      title: 'Home',
      onPress: () => { handleCloseDrawer(); router.push('/'); }
    },
    {
      id: 'services',
      icon: 'grid',
      iconType: 'ionicons',
      title: 'My Services',
      hasChevron: true,
      onPress: () => handleCloseDrawer()
    },
    {
      id: 'accessibility',
      icon: 'settings',
      iconType: 'ionicons',
      title: 'Accessibility Settings',
      onPress: () => { handleCloseDrawer(); toggleAccessibilityDrawer(); }
    },
    {
      id: 'feedback',
      icon: 'chatbubble-ellipses-outline',
      iconType: 'ionicons',
      title: 'Feedback & Support',
      onPress: () => handleCloseDrawer()
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      iconType: 'ionicons',
      title: 'About AbiliLife',
      onPress: () => handleCloseDrawer()
    },
  ];

  // Drawer open/close handlers
  const handleOpenDrawer = () => {
    setSidebarVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSidebarVisible(false);
    });
  };

  // Function to render the appropriate icon
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
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: primaryColor }]}>
        <TouchableOpacity onPress={handleOpenDrawer} style={styles.headerButton}>
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
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            All Services
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
            </TouchableOpacity>
          ))}
        </View>

        {/* Recomended Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Recommended for You
          </Text>
        </View>

        {/* Create a card with the title "Healthcare Services" and the description "Find doctors, book appointments, and more" using a new card UI */}
        <TouchableOpacity
          style={[styles.newServiceCard, { backgroundColor: colorScheme === 'dark' ? '#444' : '#f9f9f9' }]}
          onPress={() => console.log(`Healthcare Services pressed`)}
          activeOpacity={0.7}
        >
          <View style={styles.newIconContainer}>
            <Ionicons name="heart-outline" size={32} color="#F44336" />
          </View>
          <View style={styles.newCardContent}>
            <Text style={[styles.serviceTitle, { fontSize: 16, color: textColor }]}>
              Healthcare Services
            </Text>
            <Text style={[styles.serviceTitle, { fontSize: 12, color: '#999' }]}>
              Find doctors, book appointments, and more
            </Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* Sidebar Navigation Drawer */}
      <Modal
        visible={isSidebarVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseDrawer}
      >
        <RNView style={[
          styles.modalContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}>
          {/* Backdrop - closes drawer when tapped */}
          <TouchableWithoutFeedback onPress={handleCloseDrawer}>
            <Animated.View
              style={[
                styles.backdrop,
                { opacity: fadeAnim }
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Sidebar Content */}
          <Animated.View
            style={[
              styles.sidebar,
              {
                transform: [{ translateX: slideAnim }],
                height: '100%'
              }
            ]}
          >
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <RNView style={styles.profileContainer}>
                <RNView style={styles.profileAvatar}>
                  <Text style={styles.profileInitials}>EK</Text>
                </RNView>
                <RNView style={styles.profileInfo}>
                  <Text style={styles.profileName}>Eli Keli</Text>
                  <Text style={styles.profileViewText}>View Profile</Text>
                </RNView>
              </RNView>
              <TouchableOpacity onPress={handleCloseDrawer} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Navigation Items */}
            <View style={styles.navItemsContainer}>
              {navItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.navItem}
                  onPress={item.onPress}
                >
                  <RNView style={styles.navItemContent}>
                    {renderNavIcon(item)}
                    <Text style={[styles.navItemText, { color: textColor }]}>
                      {item.title}
                    </Text>
                  </RNView>
                  {item.hasChevron && (
                    <Ionicons name="chevron-forward" size={22} color={primaryColor} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
              <TouchableOpacity style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={20} color={primaryColor} />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </RNView>
      </Modal>


      {/* Accessibility Settings Button (fixed position) */}
      <TouchableOpacity
        style={styles.accessibilityButton}
        onPress={toggleAccessibilityDrawer}
        activeOpacity={0.9}
      >
        <Ionicons name="accessibility-outline" size={24} color="#fff" />
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
    marginBottom: 16,
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: 'white',
  },
  profileSection: {
    height: 80,
    backgroundColor: '#7135B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7135B1',
  },
  profileInfo: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  profileViewText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItemText: {
    fontSize: 16,
    marginLeft: 16,
    // color: '#46216E',
  },
  logoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7135B1',
    borderRadius: 24,
    paddingVertical: 12,
  },
  logoutText: {
    color: '#7135B1',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
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