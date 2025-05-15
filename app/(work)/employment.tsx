import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { ChevronLeft } from 'lucide-react-native'
import { router } from 'expo-router'
import { useThemeColor } from '@/components/Themed'
import SearchBar from '@/components/common/SearchBar'

// Interface for available insurance services
interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
  iconColor: string;
}

// Interface for latest job openings
interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  datePosted: string;
  mode: string;
  features: {
    id: string;
    title: string;
    color: string;
    backgroundColor: string;
  }[];
}

const servicesAvailble: ServiceCategory[] = [
  {
    id: 'job-search',
    title: 'Accessible Job Listings',
    icon: 'briefcase-search',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    icon: 'file-document-edit',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'interview',
    title: 'Interview Prep',
    icon: 'account-question',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'networking',
    title: 'Networking Opportunities',
    icon: 'account-network',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'counseling',
    title: 'Career Counseling',
    icon: 'account-cog',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'job-alerts',
    title: 'Job Alerts',
    icon: 'bell-ring',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
]

// Latest job openings data
const latestJobOpenings: JobOpening[] = [
  {
    id: 'job1',
    title: 'Administrative Assistant',
    company: 'ABC Company',
    location: 'Nairobi',
    datePosted: '2 days ago',
    mode: 'Full-time',
    features: [
      { id: '2', title: 'Disability-Friendly', color: '#fff', backgroundColor: '#2196F3' },
      { id: '3', title: '401k', color: '#fff', backgroundColor: '#FF9800' },
    ],
  },
  {
    id: 'job2',
    title: 'Customer Service Representative',
    company: 'XYZ Services',
    location: 'Kampala',
    datePosted: '1 week ago',
    mode: 'Part-time',
    features: [
      { id: '1', title: 'Inclusive Workplace', color: '#fff', backgroundColor: '#4CAF50' },
    ],
  },
]

const EmploymentModule = () => {
  const colorScheme = useColorScheme();

  const [accessibilityDrawerVisible, setAccessibilityDrawerVisible] = React.useState(false);

  const toggleAccessibilityDrawer = () => {
    setAccessibilityDrawerVisible(!accessibilityDrawerVisible);
  };

  // Theme colors
  const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#fff', dark: '#333' }, 'background');

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
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ChevronLeft size={32} color="white" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="briefcase-outline" size={40} color="white" />
          <View>
            <Text style={[styles.headerTitle, { color: 'white' }]}>Jobs</Text>
            <Text style={[styles.headerSubtitle, { color: 'white' }]}>
              Find and access employment services
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search for jobs or services..."
          value=""
          onChangeText={() => { }}
          onPress={() => { }}
        />
        {/* Services Available Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Services Available
          </Text>
        </View>

        {/* Services Available Categories Grid */}
        <View style={styles.servicesGrid}>
          {servicesAvailble.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.serviceCard, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}
              onPress={() => console.log(`Selected service: ${category.title}`)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                {renderServiceIcon(category)}
              </View>
              <Text style={[styles.serviceTitle, { color: textColor }]}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Latest Job Openings Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Latest Job Openings
          </Text>
        </View>

        {/* Latest Job Openings List */}
        <View style={styles.jobsContainer}>
          {latestJobOpenings.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, { backgroundColor: cardBackgroundColor }]}
              onPress={() => console.log(`Selected job: ${job.title}`)}
              activeOpacity={0.8}
            >
              <View style={styles.jobInfo}>
                {/* Job Icon/Avatar */}
                <View style={styles.jobAvatar}>
                  <MaterialCommunityIcons name="briefcase-outline" size={24} color="#7135B1" />
                </View>

                {/* Job Details */}
                <View style={styles.jobDetails}>
                  <Text style={[styles.jobTitle, { color: textColor }]}>
                    {job.title}
                  </Text>
                  <Text style={[styles.companyName, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
                    {job.company}
                  </Text>

                  {/* Location and Date Info */}
                  <View style={styles.infoContainer}>
                    <View style={styles.location}>
                      <Ionicons name="location-outline" size={16} color="#7135B1" />
                      <Text style={[styles.locationText, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
                        {job.location}
                      </Text>
                    </View>
                    <View style={styles.date}>
                      <Ionicons name="time-outline" size={16} color="#7135B1" />
                      <Text style={[styles.dateText, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
                        {job.datePosted}
                      </Text>
                    </View>
                  </View>

                  {/* Job Mode */}
                  <View style={styles.modeContainer}>
                    <Text style={[styles.modeText, { color: '#7135B1' }]}>
                      {job.mode}
                    </Text>
                  </View>

                  {/* Job Features */}
                  <View style={styles.featureContainer}>
                    {job.features.map((feature) => (
                      <View
                        key={feature.id}
                        style={[
                          styles.featureBadge,
                          { backgroundColor: feature.backgroundColor }
                        ]}
                      >
                        <Text style={[styles.featureText, { color: feature.color }]}>
                          {feature.title}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  )
}

export default EmploymentModule

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
    borderBottomColor: '#4CAF50', // Green color
    marginBottom: 16,
    backgroundColor: '#4CAF50', // Green color
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
  jobsContainer: {
    marginTop: 16,
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobAvatar: {
    marginRight: 16,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 4,
    fontSize: 14,
  },
  modeContainer: {
    marginTop: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  featureBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
})