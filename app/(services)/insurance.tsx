import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useThemeColor } from '@/components/Themed'

// Interface for available insurance services
interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  iconType: 'ionicons' | 'materialcommunity' | 'fontawesome';
  iconColor: string;
}

// Interface for Plans
interface Plan {
  id: string;
  title: string;
  description: string;
  price: string;
  coverageDetails: string;
  features: {
    id: string;
    name: string;
    color: string;
    backgroundColor: string;
  }[];
}

const servicesAvailble: ServiceCategory[] = [
  {
    id: 'general',
    title: 'Disability Coverage',
    icon: 'shield-check',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'file-claims',
    title: 'File Claims',
    icon: 'file-document',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'claim-status',
    title: 'Claim Status',
    icon: 'check-circle',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'providers',
    title: 'Accessible Providers',
    icon: 'account-search',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'coverage-details',
    title: 'Coverage Details',
    icon: 'information-outline',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
  {
    id: 'support-hotline',
    title: 'Support Hotline',
    icon: 'phone',
    iconType: 'materialcommunity',
    iconColor: '#9C27B0', // Purple color
  },
]

// Recommended Plans Data
const recommendedPlans: Plan[] = [
  {
    id: 'plan1',
    title: 'Comprehensive Health Coverage',
    description: 'Comprehensive coverage for all your health needs.',
    price: '$15/month',
    coverageDetails: 'Assistive device coverage',
    features: [
      { id: 'feature1', name: 'Subsidized', color: '#4CAF50', backgroundColor: '#E8F5E9' },
      { id: 'feature2', name: 'Easy Claims', color: '#FF9800', backgroundColor: '#FFF3E0' },
    ],
  },
  {
    id: 'plan2',
    title: 'Basic Health Plan',
    description: 'Basic health coverage for essential medical needs.',
    price: '$10/month',
    coverageDetails: 'Essential coverage',
    features: [
      { id: 'feature1', name: 'Government Sponsored', color: '#2196F3', backgroundColor: '#E3F2FD' },
    ],
  }
]

const InsuranceModule = () => {
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
          <MaterialCommunityIcons name="shield" size={28} color="white" />
          <View>
            <Text style={[styles.headerTitle, { color: 'white' }]}>Insurance</Text>
            <Text style={[styles.headerSubtitle, { color: 'white' }]}>
              Find and access insurance services
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
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

        {/* Recomemended Plans Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Recommended Plans
          </Text>
        </View>

        {/* Recomemended Plans List */}
        <View style={styles.plansContainer}>
          {recommendedPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, { backgroundColor: cardBackgroundColor }]}
              onPress={() => console.log(`Selected plan: ${plan.title}`)}
              activeOpacity={0.8}
            >
              <View style={styles.planInfo}>
                {/* Plan Icon/Avatar */}
                <View style={styles.planAvatar}>
                  <MaterialCommunityIcons name="shield-check" size={24} color="#7135B1" />
                </View>

                {/* Plan Details */}
                <View style={styles.planDetails}>
                  <Text style={[styles.planTitle, { color: textColor }]}>
                    {plan.title}
                  </Text>
                  <Text style={styles.planDescription}>
                    {plan.description}
                  </Text>

                  {/* Price and Coverage Info */}
                  <View style={styles.priceContainer}>
                    <View style={styles.price}>
                      <Ionicons name="pricetag-outline" size={16} color="#7135B1" />
                      <Text style={styles.priceText}>{plan.price}</Text>
                    </View>
                    <View style={styles.coverage}>
                      <MaterialCommunityIcons name="shield-check" size={16} color="#7135B1" />
                      <Text style={styles.coverageText}>{plan.coverageDetails}</Text>
                    </View>
                  </View>

                  {/* Plan Features */}
                  <View style={styles.featureContainer}>
                    {plan.features.map((feature) => (
                      <View
                        key={feature.id}
                        style={[
                          styles.featureBadge,
                          { backgroundColor: feature.backgroundColor }
                        ]}
                      >
                        <Text style={[styles.featureText, { color: feature.color }]}>
                          {feature.name}
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

export default InsuranceModule

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
  // Recommended Plans Styles
  plansContainer: {
    backgroundColor: 'transparent',
  },
  planCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  planInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  planAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planDetails: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  priceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  coverage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverageText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
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