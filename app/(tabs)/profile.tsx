import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, Switch, ScrollView, useColorScheme } from 'react-native';
import { Text, useThemeColor, View } from '@/components/Themed';
import Slider from '@react-native-community/slider';
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  // State for toggle switches
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(0.7);

  // Theme Colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');
  const avatarBackgroundColor = useThemeColor({ light: '#e8e3f5', dark: '#512DA8' }, 'background');
  const cardBgColor = useThemeColor({ light: '#fff', dark: '#333' }, 'background');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        {/* Profile Section */}
        <Text style={[styles.profileTitle, { color: textColor }]}>
          Profile
        </Text>
        <View style={styles.profileContainer}>
          <View style={[styles.avatarContainer, { backgroundColor: avatarBackgroundColor }]}>
            <Ionicons name="person-circle" size={60} color={textColor} />
          </View>
          <Text style={[styles.userName, { color: colorScheme === 'dark' ? '#fff' : '#512DA8' }]}>
            Eli Keli
          </Text>
          <Text style={styles.userEmail}>
            elikeli@gmail.com
          </Text>
          <TouchableOpacity>
            <Text style={styles.editProfile}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Accessibility Settings Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Accessibility Settings
          </Text>
        </View>

        {/* Accessibility Settings Cards */}
        <View style={[styles.settingsCard, { backgroundColor: cardBgColor }]}>
          {/* Text Size */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="text" size={20} color="#8954dc" />
              <Text style={styles.settingLabel}>Text Size</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={textSize}
              onValueChange={setTextSize}
              minimumTrackTintColor="#8954dc"
              maximumTrackTintColor="#00c2a8"
              thumbTintColor="#fff"
            />
          </View>

          {/* Voice Commands */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="keyboard-voice" size={20} color="#8954dc" />
              <Text style={styles.settingLabel}>Voice Commands</Text>
            </View>
            <Switch
              value={voiceCommands}
              onValueChange={setVoiceCommands}
              trackColor={{ false: '#e4e4e4', true: '#8954dc' }}
              thumbColor={'#fff'}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="moon" size={20} color="#8954dc" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e4e4e4', true: '#8954dc' }}
              thumbColor={'#fff'}
            />
          </View>

          {/* High Contrast */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="sunny" size={20} color="#8954dc" />
              <Text style={styles.settingLabel}>High Contrast</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#e4e4e4', true: '#8954dc' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* Account Settings Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Account Settings
          </Text>
        </View>

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={20} color="#8954dc" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Feather name="settings" size={20} color="#8954dc" />
              <Text style={styles.settingLabel}>General Settings</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Feather name="help-circle" size={20} color="#8954dc" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="logout" size={20} color="#f44336" />
              <Text style={[styles.settingLabel, { color: '#f44336' }]}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  profileTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 24,
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editProfile: {
    color: '#8954dc',
    fontSize: 14,
  },
  settingsCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  slider: {
    flex: 1,
    marginLeft: 16,
    height: 40,
  },
});