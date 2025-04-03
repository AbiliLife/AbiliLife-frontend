import { useRef, useState } from 'react';
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
import { router } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { Text, useThemeColor, View } from '@/components/Themed';

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

// Interface for notification items
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  day: number;
  month: string;
  color: string;
  isNew?: boolean;
}

export default function AlertsScreen() {
  const colorScheme = useColorScheme();

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = useState(false);

  const toggleAccessibilityDrawer = () => {
    setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
  };

  // Theme colors
  const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');
  const cardBgColor = useThemeColor({ light: '#fff', dark: '#333' }, 'background');

  // Animation values
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // Sample notification data
  const todayNotifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Doctor Appointment Confirmed',
      message: 'Your appointment with Dr. Sarah has been confirmed for tomorrow at 10:00 AM',
      date: 'Apr 3',
      day: 3,
      month: 'Apr',
      color: '#FF6B6B',  // Red
      isNew: true
    },
    {
      id: '2',
      title: 'New Job Opportunity',
      message: 'A new job matching your profile has been posted. Click to view details.',
      date: 'Apr 3',
      day: 3,
      month: 'Apr',
      color: '#4CD97B',  // Green
      isNew: true
    }
  ];

  const earlierNotifications: NotificationItem[] = [
    {
      id: '3',
      title: 'Reminder: Health Workshop',
      message: 'Don\'t forget about the inclusive health workshop tomorrow at 2:00 PM',
      date: 'Apr 2',
      day: 2,
      month: 'Apr',
      color: '#4E9BFF',  // Blue
    }
  ];

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
      onPress: () => { handleCloseDrawer() }
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

  // Function to render notification card
  const renderNotificationCard = (notification: NotificationItem) => {
    return (
      <TouchableOpacity
        key={notification.id}
        style={[styles.notificationCard, { borderLeftColor: notification.color, backgroundColor: cardBgColor }]}
        activeOpacity={0.7}
      >
        <RNView style={styles.notificationContent}>
          <RNView style={[styles.notificationIcon, { backgroundColor: notification.color }]} />
          <RNView style={styles.notificationTextContainer}>
            <Text style={[styles.notificationTitle, { color: notification.isNew ? primaryColor : textColor }]}>
              {notification.title}
            </Text>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
          </RNView>
          <Text style={styles.notificationDate}>{notification.date}</Text>
        </RNView>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: primaryColor }]}>
        <TouchableOpacity onPress={handleOpenDrawer} style={styles.headerButton}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: 'white' }]}>Notifications</Text>
        <Text style={[styles.headerSubtitle, { color: 'white' }]}>
          Stay updated with your recent activities
        </Text>
      </View>

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

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        {/* Today Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Today
          </Text>
        </View>

        {/* Today Notifications */}
        {todayNotifications.map(notification => renderNotificationCard(notification))}

        {/* Earlier Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Earlier
          </Text>
        </View>

        {/* Earlier Notifications */}
        {earlierNotifications.map(notification => renderNotificationCard(notification))}
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
  // Notification Card Styles
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
  notificationDate: {
    fontSize: 12,
    opacity: 0.6,
    alignSelf: 'flex-start',
    marginLeft: 8,
    minWidth: 40,
    textAlign: 'right',
  },
  // Mute Button
  muteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100,
  },
});
