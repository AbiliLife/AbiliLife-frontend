import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

import { useAccessibility } from '@/contexts/AccessibilityContext'

import { Text, useThemeColor, View } from '@/components/Themed'
import SearchBar from '@/components/common/SearchBar'
import AccessibilityDrawer from '@/components/accessibility/AccessibilityDrawer'
import AccessibilityOption from '@/components/accessibility/AccessibilityOption'

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
    iconColor: '#2196F3', // Blue color
  },
  {
    id: 'tutoring',
    title: 'One-on-One Tutoring',
    icon: 'person',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
  },
  {
    id: 'assistive-resources',
    title: 'Assistive Resources',
    icon: 'library',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
  },
  {
    id: 'scholarships',
    title: 'Scholarships for Disabilities',
    icon: 'cash',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
  },
  {
    id: 'inclusive-events',
    title: 'Inclusive Events',
    icon: 'calendar',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
  },
  {
    id: 'support-groups',
    title: 'Support Groups',
    icon: 'people',
    iconType: 'ionicons',
    iconColor: '#2196F3', // Blue color
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

  const { accessibilityDrawerVisible, toggleAccessibilityDrawer } = useAccessibility();

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
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'transparent' }}>
          <Ionicons name="book" size={28} color="white" />
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={[styles.headerTitle, { color: 'white' }]}>
              AbiliLife Learn
            </Text>
            <Text style={[styles.headerSubtitle, { color: 'white' }]}>
              Inclusive Education & Skills Training
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
                  <Ionicons name="school" size={24} color='#2196F3' />
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
    borderBottomColor: '#2196F3',
    marginBottom: 16,
    backgroundColor: '#2196F3'
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
    backgroundColor: '#E8F5E9',
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