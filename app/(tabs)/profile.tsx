import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function ProfileScreen() {

  // State for toggle switches
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(0.7);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Your Profile',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#7135B1',
          },
          headerTintColor: '#7135B1',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F5F5F5',
          }
        }}
      />

      <ScrollView style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=bessieduke@marketoid.com' }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Bessie Johnson</Text>
          <Text style={styles.userEmail}>
            bessie.j@example.com
          </Text>
          <TouchableOpacity>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Accessibility Settings Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accessibility Settings</Text>
          <Ionicons name="accessibility-outline" size={24} color="#000" />
        </View>

        {/* Accessibility Settings Cards */}
        <View style={styles.settingsCard}>
          {/* Text Size */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="text" size={24} color="#8954dc" />
              <Text style={styles.settingLabel}>Text Size</Text>
            </View>
            <Slider
              style={styles.slider}
              upperLimit={1}
              lowerLimit={0}
              minimumValue={0}
              maximumValue={1}
              value={textSize}
              onValueChange={setTextSize}
              maximumTrackTintColor='#00c2a8'
              minimumTrackTintColor='#8954dc'
              thumbTintColor='#000'
            />
          </View>

          {/* Voice Commands */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="keyboard-voice" size={24} color="#8954dc" />
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
              <Ionicons name="moon" size={24} color="#8954dc" />
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
              <Ionicons name="sunny" size={24} color="#8954dc" />
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
          <Text style={styles.sectionTitle}>
            Account Settings
          </Text>
        </View>

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={24} color="#8954dc" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Feather name="settings" size={24} color="#8954dc" />
              <Text style={styles.settingLabel}>General Settings</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Feather name="help-circle" size={24} color="#8954dc" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingsCard, { marginBottom: 40 }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="logout" size={24} color="#f44336" />
              <Text style={[styles.settingLabel, { color: '#f44336' }]}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  slider: {
    flex: 1,
    marginLeft: 16,
    height: 40,
    // backgroundColor: 'red', // Testing
  },
});