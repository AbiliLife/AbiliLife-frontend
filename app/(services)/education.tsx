import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useThemeColor } from '@/components/Themed'
import SearchBar from '@/components/SearchBar'

// Interface for available insurance services
interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
  iconColor: string;
}

// Interface for popular courses
interface PopularCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  features: {
    id: string;
    title: string;
    color: string;
    backgroundColor: string;
  }[];
}

const servicesAvailble: ServiceCategory[] = [
  {
    id: 'courses',
    title: 'Accessible Courses',
    icon: 'school',
    iconType: 'ionicons',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'tutoring',
    title: 'One-on-One Tutoring',
    icon: 'person',
    iconType: 'ionicons',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'assistive-resources',
    title: 'Assistive Resources',
    icon: 'library',
    iconType: 'ionicons',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'scholarships',
    title: 'Scholarships for Disabilities',
    icon: 'cash',
    iconType: 'ionicons',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'inclusive-events',
    title: 'Inclusive Events',
    icon: 'calendar',
    iconType: 'ionicons',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'support-groups',
    title: 'Support Groups',
    icon: 'people',
    iconType: 'ionicons',
    iconColor: '#9C27B0', // Purple color
  },
]

// Popular courses data
const popularCourses: PopularCourse[] = [
  {
    id: 'course1',
    title: 'Digital Skills Training',
    description: 'Learn essential digital skills for the modern workplace.',
    duration: '8 week course',
    price: 'Free',
    features: [
      { id: 'feature1', title: 'Screen Reader Compatible', color: '#FF9800', backgroundColor: '#FFF3E0' },
      { id: 'feature2', title: 'Certificate', color: '#4CAF50', backgroundColor: '#E8F5E9' },
    ],
  },
  {
    id: 'course2',
    title: 'Community Business Skills',
    description: 'Learn how to start and manage a community business.',
    duration: '12 week course',
    price: 'Scholarship Available',
    features: [
      { id: 'feature1', title: 'Flexible Schedule', color: '#4CAF50', backgroundColor: '#E8F5E9' },
    ],
  },
]

const EducationModule = () => {
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
      <View style={[styles.headerContainer, { backgroundColor: primaryColor }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="book" size={28} color="white" />
          <View>
            <Text style={[styles.headerTitle, { color: 'white' }]}>Education</Text>
            <Text style={[styles.headerSubtitle, { color: 'white' }]}>
              Find and access education services
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search for education services..."
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

        {/* Popular Courses Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Popular Courses
          </Text>
        </View>

        {/* Popular Courses List */}
        <View style={styles.coursesContainer}>
          {popularCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={[styles.courseCard, { backgroundColor: cardBackgroundColor }]}
              onPress={() => console.log(`Selected course: ${course.title}`)}
              activeOpacity={0.8}
            >
              <View style={styles.courseInfo}>
                {/* Course Icon/Avatar */}
                <View style={styles.courseAvatar}>
                  <Ionicons name="school" size={24} color="#7135B1" />
                </View>

                {/* Course Details */}
                <View style={styles.courseDetails}>
                  <Text style={[styles.courseTitle, { color: textColor }]}>
                    {course.title}
                  </Text>
                  <Text style={styles.courseDescription}>
                    {course.description}
                  </Text>

                  {/* Duration and Price Info */}
                  <View style={styles.infoContainer}>
                    <View style={styles.duration}>
                      <Ionicons name="time-outline" size={16} color="#7135B1" />
                      <Text style={styles.durationText}>{course.duration}</Text>
                    </View>
                    <View style={styles.price}>
                      <Ionicons name="pricetag-outline" size={16} color="#7135B1" />
                      <Text style={styles.priceText}>{course.price}</Text>
                    </View>
                  </View>

                  {/* Course Features */}
                  <View style={styles.featureContainer}>
                    {course.features.map((feature) => (
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

export default EducationModule

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
  // Popular Courses Styles
  coursesContainer: {
    backgroundColor: 'transparent',
  },
  courseCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  courseInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  courseAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
  },
})