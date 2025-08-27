import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { NotificationItem } from '@/types/notifications';
import notificationsData from '@/assets/data/notifications.json';

import { ThemeContext } from '@/contexts/ThemeContext';

import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer';


export default function AlertsScreen() {
  const { currentTheme } = useContext(ThemeContext);

  const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleAccessibilityDrawer = () => {
    setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
  };

  // Handle notification press
  const handleNotificationPress = (item: NotificationItem) => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  // Render item for FlatList
  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleNotificationPress(item)}
      style={{ width: '100%' }}
    >
      <View
        style={[
          styles.notificationContainer,
          {
            backgroundColor: item.isNew
              ? (currentTheme === 'light' ? Colors.lightPurple : Colors.darkPurple)
              : (currentTheme === 'light' ? Colors.white : Colors.darkGray),
            borderColor: item.isNew
              ? (currentTheme === 'light' ? Colors.secondary : '#B983FF')
              : (currentTheme === 'light' ? Colors.borderLight : Colors.borderDark),
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.isNew ? "notifications" : "notifications-outline"}
            size={24}
            color={
              item.isNew
                ? (currentTheme === 'light' ? Colors.secondary : '#B983FF')
                : (currentTheme === 'light' ? Colors.mediumGray : Colors.white)
            }
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: item.isNew
                  ? (currentTheme === 'light' ? Colors.secondary : '#B983FF')
                  : (currentTheme === 'light' ? Colors.primary : Colors.white),
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.message,
              {
                color: currentTheme === 'light'
                  ? (item.isNew ? '#7135B1' : '#4B3B6B')
                  : (item.isNew ? '#E0C3FC' : Colors.white),
              },
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.date,
              {
                color: currentTheme === 'light'
                  ? (item.isNew ? '#B983FF' : '#A29EB6')
                  : (item.isNew ? '#E0C3FC' : Colors.white),
              },
            ]}
          >
            {item.date}
          </Text>
        </View>
        {item.isNew && (
          <View
            style={[
              styles.dot,
              {
                backgroundColor: currentTheme === 'light' ? Colors.secondary : '#B983FF',
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Your Notifications',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: currentTheme === 'light' ? Colors.primary : Colors.white,
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer,
          }
        }}
      />

      {/* Accessibility Drawer */}
      {accessibilityDrawerVisible && (
        <AccessibilityDrawer />
      )}

      <View style={[styles.container, { backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }]}>
        <FlatList
          data={notificationsData}
          keyExtractor={item => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Notification Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.darkContainer }]}>
            {selectedNotification && (
              <>
                <Text style={[styles.modalTitle, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole='header' accessibilityLabel={`Notification: ${selectedNotification.title}`}>
                  {selectedNotification.title}
                </Text>
                <Text style={styles.modalMessage} accessibilityRole='text' accessibilityLabel={`Message: ${selectedNotification.message}`}>
                  {selectedNotification.message}
                </Text>
                <Text style={styles.modalDate}>
                  {selectedNotification.date}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    position: 'relative',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2D1457',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#4B3B6B',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#A29EB6',
    fontStyle: 'italic',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7135B1',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 21, 87, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#7135B1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7135B1',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.accent,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDate: {
    fontSize: 13,
    color: '#A29EB6',
    fontStyle: 'italic',
    marginBottom: 18,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: '#7135B1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
