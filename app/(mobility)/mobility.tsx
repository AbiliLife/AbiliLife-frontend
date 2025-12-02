import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Text, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

// Assets & Constants
import { images } from '@/constants/Images'
import Colors from '@/constants/Colors';

// Context & Store
import { ThemeContext } from '@/contexts/ThemeContext';

// Components
import CustomButton from '@/components/common/CustomButton';
import ModuleHeader from '@/components/common/ModuleHeader';

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: any; // Use 'any' for image source
  iconType?: 'ionicons' | 'materialcommunity' | 'fontawesome';
  iconColor?: string;
  link?: string; // URL or internal route
}

// MINI-SERVICES partners
const miniServices: ServiceCategory[] = [
  {
    id: "bamm-tours",
    title: "Bamm Tours & Safaris",
    image: images.bammToursLogo,
    description: "Wheelchair accessible vehicles for hire in Kenya",
    link: "https://bammtours.co.ke/disabled-car-hire/",
  },
  {
    id: "accessible-travel",
    title: "Accessible Travel",
    image: images.accessibleTravelLogo,
    description: "Disability-friendly travel services in Kenya",
    link: "https://www.accessibletravel.co.ke/",
  },
  {
    id: "nb-airport",
    title: "Nairobi Airport Transfers",
    image: images.nbAirportLogo,
    description: "Wheelchair accessible airport transfers in Nairobi",
    link: "https://www.nairobiairporttransfers.com/jkia-wheelchair-accessible-airport-transfer/",
  },
  {
    id: "inspire-wellness",
    title: "Inspire Wellness",
    image: images.inspireWellnessLogo,
    description: "Wheelchair-Accessible Van Services in Kenya",
    link: "https://www.inspirewellness.co.ke/our-services/van/",
  },
  {
    id: "kenya-airways",
    title: "Kenya Airways",
    image: images.kenyaAirwaysLogo,
    description: "Passengers with Reduced Mobility",
    link: "https://www.kenya-airways.com/en/plan/special-care/reduced-mobility/",
  }
]

// Beta Badge - for pilot mode
const BetaBadge = () => {
  return (
    <View style={styles.betaBadgeContainer}>
      <Text style={styles.betaBadgeText}>Pilot Mode - Early Access</Text>
    </View>
  );
};

const MobilityHomeScreen = () => {
  const router = useRouter();

  // Obtain Context values
  const { currentTheme } = React.useContext(ThemeContext);

  // Handle external link press - WebBrowser
  const handleExternalLinkPress = async (url: string, title: string) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        controlsColor: Colors.blue,
        toolbarColor: currentTheme === 'light' ? Colors.white : Colors.gray800,
        showTitle: true,
      })
    } catch (error) {
      console.error(`Failed to open link for ${title}:`, error);
      // Fallback to Linking if WebBrowser fails
      Linking.openURL(url);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <ModuleHeader
        title="AbiliLife Mobility"
        subtitle="Explore accessible transportation services"
        onBackPress={() => router.back()}
        color={Colors.blue}
        iconName="wheelchair"
        iconFamily="FontAwesome"
      />
      <BetaBadge />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Mobility options screen"
      >
        <Image
          source={images.mobility}
          style={{ width: '100%', height: 300, borderRadius: 12, marginBottom: 16 }}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel="Mobility services illustration"
        />

        <Text
          style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
          accessibilityRole="header"
          accessibilityLabel="Recommended Services"
        >
          Recommended Services
        </Text>

        {/* Private Ride Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800 }]}
          onPress={() => router.push('/rideBooking')}
          accessible={true}
          accessibilityLabel="Private Ride with Ace Mobility"
          accessibilityHint="Book a private accessible ride with Ace Mobility"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <Image
              source={images.aceLogo}
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
              accessible={true}
              accessibilityRole='image'
              accessibilityLabel="Ace Mobility Logo"
            />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="header" accessibilityLabel="Private Ride with Ace Mobility">
                Request a Private Ride
              </Text>
              <Text style={[styles.cardDescription, { color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300 }]} accessibilityRole="text" accessibilityLabel="Book a private accessible ride with Ace Mobility">
                Book a private accessible ride with Ace Mobility
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Schedule Ride Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800 }]}
          onPress={() => router.push('/(mobility)/rideBooking')}
          accessible={true}
          accessibilityLabel="Schedule a Ride"
          accessibilityHint="Plan and schedule transportation in advance"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <Ionicons name="calendar" size={24} color={Colors.blue} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="header" accessibilityLabel="Schedule a Ride">
                Schedule a Ride
              </Text>
              <Text style={[styles.cardDescription, { color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300 }]} accessibilityRole="text" accessibilityLabel="Plan and schedule transportation in advance">
                Plan and schedule transportation in advance with Ace Mobility
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Public Transport Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800, height: 150 }]}
          onPress={() => router.push('/(mobility)/publicTransport')}
          accessible={true}
          accessibilityLabel="Public Transport"
          accessibilityHint="Get information about accessible public transportation options"
          accessibilityRole="button"
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons name="bus" size={24} color={Colors.blue} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="header" accessibilityLabel="Public Transport">
                Public Transport
              </Text>
              <Text style={[styles.cardDescription, { color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300 }]} accessibilityRole="text" accessibilityLabel="Get information about accessible public transportation options">
                Get information about accessible public transportation options
              </Text>
              <Text style={{ color: Colors.info, fontWeight: '500' }} accessibilityRole="text" accessibilityLabel="">
                We are working on integrating public transport options. Stay tuned!
              </Text>
            </View>
          </View>
        </TouchableOpacity>



        {/* Caregiver Mode Button */}
        <CustomButton
          title="Caregiver Booking"
          handlePress={() => router.push('/(mobility)/caregiverBook')}
          containerStyle={styles.caregiverButton}
          textStyle={styles.caregiverButtonText}
          accessibilityLabel="Caregiver Booking"
          accessibilityHint="Book transportation for someone in your care"
          accessibilityRole="button"
        />

        {/* How to Book Guide Button */}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => router.push('/bookingGuide')}
          accessible={true}
          accessibilityLabel="How to Book a Ride Guide"
          accessibilityHint="View step-by-step instructions for booking rides"
          accessibilityRole="button"
        >
          <Ionicons name="help-circle-outline" size={24} color={Colors.blue} />
          <Text style={styles.helpButtonText}>
            How to Book a Ride
          </Text>
        </TouchableOpacity>


        <Text
          style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]}
          accessibilityRole="header"
          accessibilityLabel="Accessible Mini-Services"
        >
          Accessible Mini-Services
        </Text>

        <View style={styles.otherServiceGrid}>
          {miniServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, { backgroundColor: currentTheme === 'light' ? Colors.white : Colors.gray800 }]}
              onPress={() => {
                if (service.link) {
                  handleExternalLinkPress(service.link, service.title);
                }
              }}
              accessible={true}
              accessibilityLabel={`${service.title}, ${service.description}`}
              accessibilityHint={`Learn more about ${service.title}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: !service.link }}
            >
              <Image
                source={service.image}
                style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 8 }}
                resizeMode="contain"
                accessible={true}
                accessibilityRole='image'
                accessibilityLabel={`${service.title} Logo`}
              />
              <Text style={[styles.serviceTitle, { color: currentTheme === 'light' ? Colors.black : Colors.white }]} accessibilityRole="text" accessibilityLabel={service.title}>
                {service.title}
              </Text>
              <Text style={[styles.serviceDescription, { color: currentTheme === 'light' ? Colors.gray700 : Colors.gray300 }]} accessibilityRole="text" accessibilityLabel={service.description}>
                {service.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MobilityHomeScreen

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  caregiverButton: {
    width: '70%',
    padding: 14,
    marginTop: 20,
    backgroundColor: Colors.blue,
  },
  caregiverButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 30,
    padding: 8,
  },
  helpButtonText: {
    color: Colors.blue,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  otherServiceGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: Colors.transparent,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    textAlign: 'center',
  },

  betaBadgeContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.orange,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  betaBadgeText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
})