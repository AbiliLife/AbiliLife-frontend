import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native'
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import FormField from '@/components/common/FormField'
import CustomButton from '@/components/common/CustomButton'
import { 
  getPublicTransportRoutes, 
  getTransportSafetyTips, 
  getLegalRights,
  getEmergencyContacts,
  filterRoutesByAccessibility,
  getSaccoById
} from '@/services/mobilityService'
import { TransportRoute, AccessibilityFilters } from '@/types/mobility'

const PublicTransportScreen = () => {
  // Theme colors
  const primaryColor = '#7135B1' // purple
  const backgroundColor = '#fff'; // white
  const textColor = '#46216E' // dark purple
  const cardBackgroundColor = '#F5F5F5' // light gray

  // State
  const [location, setLocation] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false)
  const [routes, setRoutes] = useState<TransportRoute[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<TransportRoute[]>([])
  const [filters, setFilters] = useState<AccessibilityFilters>({
    wheelchairAccessible: false,
    hasRamp: false,
    visualAids: false,
    trainedDriver: false,
    caregiverSpace: false,
    verified: false
  })
  
  // Modals
  const [safetyTipsVisible, setSafetyTipsVisible] = useState<boolean>(false)
  const [legalRightsVisible, setLegalRightsVisible] = useState<boolean>(false)
  const [emergencyContactsVisible, setEmergencyContactsVisible] = useState<boolean>(false)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

  // Load routes
  useEffect(() => {
    setIsLoading(true)
    // Get current location
    if (Platform.OS !== 'web') {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({})
          let address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          })
          setLocation(address[0]?.city || 'Nairobi')
        }
      })()
    }
    
    // Get routes
    const allRoutes = getPublicTransportRoutes()
    setRoutes(allRoutes)
    setFilteredRoutes(allRoutes)
    setIsLoading(false)
  }, [])

  // Apply filters
  useEffect(() => {
    const filtered = filterRoutesByAccessibility(routes, filters)
    setFilteredRoutes(filtered)
  }, [filters, routes])

  // Toggle filters
  const toggleFilter = (key: keyof AccessibilityFilters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Handle current location
  const handleUseCurrentLocation = async () => {
    setLoadingLocation(true)
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to see nearby routes')
        setLoadingLocation(false)
        return
      }
      
      let location = await Location.getCurrentPositionAsync({})
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
      
      setLocation(address[0]?.city || 'Nairobi')
      setLoadingLocation(false)
    } catch (error) {
      Alert.alert('Error', 'Could not get your location')
      setLoadingLocation(false)
    }
  }

  // Handle WhatsApp assistance
  const handleWhatsAppAssistance = () => {
    const message = `Hi, I need help planning an accessible route from ${location || 'my location'} to my destination.`
    Linking.openURL(`https://wa.me/254742560540?text=${encodeURIComponent(message)}`)
      .catch(() => Alert.alert('Error', 'Could not open WhatsApp'))
  }

  // Get SACCO by ID
  const getSaccoName = (saccoId: string) => {
    const sacco = getSaccoById(saccoId)
    return sacco ? sacco.name : 'Unknown Provider'
  }

  // Call a number
  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`)
      .catch(() => Alert.alert('Error', 'Could not make a call'))
  }

  // Open WhatsApp
  const openWhatsApp = (number: string, message: string = '') => {
    Linking.openURL(`https://wa.me/${number}?text=${encodeURIComponent(message)}`)
      .catch(() => Alert.alert('Error', 'Could not open WhatsApp'))
  }

  // View route details
  const viewRouteDetails = (routeId: string) => {
    setSelectedRouteId(routeId)
  }

  // Close route details
  const closeRouteDetails = () => {
    setSelectedRouteId(null)
  }

  // Selected route
  const selectedRoute = selectedRouteId 
    ? routes.find(route => route.id === selectedRouteId) 
    : null

  // Selected route's SACCO
  const selectedRouteSacco = selectedRoute 
    ? getSaccoById(selectedRoute.saccoId) 
    : null

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={true}
      accessibilityLabel="Public transport options screen"
    >
      {/* Location Header */}
      <View style={styles.locationHeader}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={24} color={primaryColor} />
          <Text 
            style={[styles.locationText, { color: textColor }]
            }
            accessibilityLabel={location ? `Your location: ${location}` : "Set your location"}
          >
            {location || 'Set your location'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleUseCurrentLocation} 
          disabled={loadingLocation}
          style={styles.locationButton}
          accessibilityLabel="Use current location"
          accessibilityHint="Gets your current location to show nearby routes"
          accessibilityRole="button"
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color={primaryColor} />
          ) : (
            <Ionicons name="locate" size={24} color={primaryColor} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Location */}
      <FormField
        type="text"
        title="Search"
        icon={true}
        iconName="search"
        iconFamily="Ionicons"
        value={location}
        placeholder="Search location or route number"
        onChangeText={setLocation}
        otherStyles={{ marginBottom: 16 }}
        accessibilityLabel="Search location input"
        accessibilityHint="Enter your location or a route number"
      />

      {/* Accessibility Filters */}
      <Text 
        style={[styles.sectionTitle, { color: textColor }]
        }
        accessibilityRole="header"
        accessibilityLabel="Accessibility Filters"
      >
        Accessibility Filters
      </Text>
      <View style={styles.filtersRow}>
        <TouchableOpacity 
          style={[
            styles.filterChip, 
            filters.wheelchairAccessible && { backgroundColor: primaryColor }
          ]} 
          onPress={() => toggleFilter('wheelchairAccessible')}
          accessibilityLabel="Wheelchair Accessible Filter"
          accessibilityHint="Toggle to show only wheelchair accessible routes"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filters.wheelchairAccessible }}
        >
          <FontAwesome5 
            name="wheelchair" 
            size={16} 
            color={filters.wheelchairAccessible ? '#fff' : primaryColor} 
          />
          <Text style={[
            styles.filterText, 
            filters.wheelchairAccessible && { color: '#fff' }
          ]}>Wheelchair</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterChip, 
            filters.hasRamp && { backgroundColor: primaryColor }
          ]} 
          onPress={() => toggleFilter('hasRamp')}
          accessibilityLabel="Ramp Available Filter"
          accessibilityHint="Toggle to show only routes with ramps"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filters.hasRamp }}
        >
          <MaterialCommunityIcons 
            name="slope-uphill" 
            size={16} 
            color={filters.hasRamp ? '#fff' : primaryColor} 
          />
          <Text style={[
            styles.filterText, 
            filters.hasRamp && { color: '#fff' }
          ]}>Ramp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterChip, 
            filters.trainedDriver && { backgroundColor: primaryColor }
          ]} 
          onPress={() => toggleFilter('trainedDriver')}
          accessibilityLabel="Trained Driver Filter"
          accessibilityHint="Toggle to show only routes with trained drivers"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filters.trainedDriver }}
        >
          <FontAwesome5 
            name="chalkboard-teacher" 
            size={16} 
            color={filters.trainedDriver ? '#fff' : primaryColor} 
          />
          <Text style={[
            styles.filterText, 
            filters.trainedDriver && { color: '#fff' }
          ]}>Trained Driver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity 
          style={[
            styles.filterChip, 
            filters.visualAids && { backgroundColor: primaryColor }
          ]} 
          onPress={() => toggleFilter('visualAids')}
          accessibilityLabel="Visual Aids Filter"
          accessibilityHint="Toggle to show only routes with visual aids"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filters.visualAids }}
        >
          <Ionicons 
            name="eye" 
            size={16} 
            color={filters.visualAids ? '#fff' : primaryColor} 
          />
          <Text style={[
            styles.filterText, 
            filters.visualAids && { color: '#fff' }
          ]}>Visual Aids</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterChip, 
            filters.caregiverSpace && { backgroundColor: primaryColor }
          ]} 
          onPress={() => toggleFilter('caregiverSpace')}
          accessibilityLabel="Caregiver Space Filter"
          accessibilityHint="Toggle to show only routes with caregiver space"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filters.caregiverSpace }}
        >
          <Ionicons 
            name="people" 
            size={16} 
            color={filters.caregiverSpace ? '#fff' : primaryColor} 
          />
          <Text style={[
            styles.filterText, 
            filters.caregiverSpace && { color: '#fff' }
          ]}>Caregiver Space</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterChip, 
            filters.verified && { backgroundColor: primaryColor }
          ]} 
          onPress={() => toggleFilter('verified')}
          accessibilityLabel="Verified Routes Filter"
          accessibilityHint="Toggle to show only verified routes"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filters.verified }}
        >
          <Ionicons 
            name="shield-checkmark" 
            size={16} 
            color={filters.verified ? '#fff' : primaryColor} 
          />
          <Text style={[
            styles.filterText, 
            filters.verified && { color: '#fff' }
          ]}>Verified</Text>
        </TouchableOpacity>
      </View>

      {/* Route Listings */}
      <Text 
        style={[styles.sectionTitle, { color: textColor }]
        }
        accessibilityRole="header"
      >
        Nearby Routes
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={primaryColor} style={{ marginVertical: 20 }} />
      ) : filteredRoutes.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="not-listed-location" size={48} color="#888" />
          <Text 
            style={styles.emptyStateText}
            accessibilityLabel="No routes match your filters"
          >
            No routes match your filters
          </Text>
          <TouchableOpacity 
            onPress={() => setFilters({
              wheelchairAccessible: false,
              hasRamp: false,
              visualAids: false,
              trainedDriver: false,
              caregiverSpace: false,
              verified: false
            })}
            style={styles.resetButton}
            accessibilityLabel="Reset Filters"
            accessibilityHint="Clears all selected filters"
            accessibilityRole="button"
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        filteredRoutes.map(route => (
          <TouchableOpacity 
            key={route.id} 
            style={[styles.routeCard, { backgroundColor: cardBackgroundColor }]}
            onPress={() => viewRouteDetails(route.id)}
            accessibilityLabel={`Route ${route.routeNumber} ${route.routeName}`}
            accessibilityHint="Tap to view details about this route"
            accessibilityRole="button"
          >
            <View style={styles.routeHeader}>
              <View style={styles.routeNumberContainer}>
                <Text 
                  style={styles.routeNumber}
                  accessibilityLabel={`Route number ${route.routeNumber}`}
                >
                  {route.routeNumber}
                </Text>
              </View>
              <View style={styles.routeHeaderRight}>
                <Text style={[styles.routeName, { color: textColor }]}>{route.routeName}</Text>
                {route.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={12} color="#fff" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.routeDetails}>
              <View 
                style={styles.routeDetail}
                accessibilityLabel={`Frequency: Every ${route.frequency}`}
              >
                <Ionicons name="time-outline" size={16} color={primaryColor} />
                <Text style={styles.routeDetailText}>Every {route.frequency}</Text>
              </View>
              <View 
                style={styles.routeDetail}
                accessibilityLabel={`Route from ${route.startPoint} to ${route.endPoint}`}
              >
                <Ionicons name="location-outline" size={16} color={primaryColor} />
                <Text style={styles.routeDetailText}>{route.startPoint} → {route.endPoint}</Text>
              </View>
              <View 
                style={styles.routeDetail}
                accessibilityLabel={`Provider: ${getSaccoName(route.saccoId)}`}
              >
                <FontAwesome name="users" size={16} color={primaryColor} />
                <Text style={styles.routeDetailText}>{getSaccoName(route.saccoId)}</Text>
              </View>
            </View>
            
            <View 
              style={styles.accessibilityIcons}
              accessibilityLabel={
                `Accessibility features: ${route.wheelchairAccessible ? 'Wheelchair accessible, ' : ''}` +
                `${route.hasRamp ? 'Has ramp, ' : ''}` +
                `${route.visualAids ? 'Visual aids, ' : ''}` +
                `${route.trainedDriver ? 'Trained driver, ' : ''}` +
                `${route.caregiverSpace ? 'Caregiver space' : ''}`
              }
            >
              <View style={[
                styles.accessibilityIcon, 
                { backgroundColor: route.wheelchairAccessible ? primaryColor : '#f0f0f0' }
              ]}>
                <FontAwesome5 
                  name="wheelchair" 
                  size={12} 
                  color={route.wheelchairAccessible ? '#fff' : '#888'} 
                />
              </View>
              <View style={[
                styles.accessibilityIcon, 
                { backgroundColor: route.hasRamp ? primaryColor : '#f0f0f0' }
              ]}>
                <MaterialCommunityIcons 
                  name="slope-uphill" 
                  size={12} 
                  color={route.hasRamp ? '#fff' : '#888'} 
                />
              </View>
              <View style={[
                styles.accessibilityIcon, 
                { backgroundColor: route.visualAids ? primaryColor : '#f0f0f0' }
              ]}>
                <Ionicons 
                  name="eye" 
                  size={12} 
                  color={route.visualAids ? '#fff' : '#888'} 
                />
              </View>
              <View style={[
                styles.accessibilityIcon, 
                { backgroundColor: route.trainedDriver ? primaryColor : '#f0f0f0' }
              ]}>
                <FontAwesome5 
                  name="chalkboard-teacher" 
                  size={12} 
                  color={route.trainedDriver ? '#fff' : '#888'} 
                />
              </View>
              <View style={[
                styles.accessibilityIcon, 
                { backgroundColor: route.caregiverSpace ? primaryColor : '#f0f0f0' }
              ]}>
                <Ionicons 
                  name="people" 
                  size={12} 
                  color={route.caregiverSpace ? '#fff' : '#888'} 
                />
              </View>
            </View>
            
            <View style={styles.routeRating}>
              <View style={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                  <FontAwesome 
                    key={star} 
                    name={star <= Math.round(route.rating) ? "star" : "star-o"} 
                    size={16} 
                    color="#FAB515" 
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <Text 
                style={styles.ratingText}
                accessibilityLabel={`Rating ${route.rating.toFixed(1)} out of 5 stars`}
              >
                {route.rating.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Support Tools */}
      <Text 
        style={[styles.sectionTitle, { color: textColor }]
        }
        accessibilityRole="header"
      >
        Public Transport Support
      </Text>
      <View style={styles.supportTools}>
        <TouchableOpacity 
          style={[styles.supportTool, { backgroundColor: cardBackgroundColor }]}
          onPress={() => setSafetyTipsVisible(true)}
          accessibilityLabel="Safety Tips"
          accessibilityHint="View safety tips for using public transport"
          accessibilityRole="button"
        >
          <Ionicons name="information-circle" size={24} color={primaryColor} />
          <Text style={[styles.supportToolText, { color: textColor }]}>Safety Tips</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.supportTool, { backgroundColor: cardBackgroundColor }]}
          onPress={() => setLegalRightsVisible(true)}
          accessibilityLabel="Legal Rights"
          accessibilityHint="Learn about your legal rights on public transport"
          accessibilityRole="button"
        >
          <FontAwesome5 name="balance-scale" size={24} color={primaryColor} />
          <Text style={[styles.supportToolText, { color: textColor }]}>Legal Rights</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.supportTool, { backgroundColor: cardBackgroundColor }]}
          onPress={() => setEmergencyContactsVisible(true)}
          accessibilityLabel="Emergency Contacts"
          accessibilityHint="View emergency contacts for transport assistance"
          accessibilityRole="button"
        >
          <Ionicons name="call" size={24} color={primaryColor} />
          <Text style={[styles.supportToolText, { color: textColor }]}>Emergency</Text>
        </TouchableOpacity>
      </View>

      {/* WhatsApp Assistance */}
      <View 
        style={[styles.whatsappCard, { backgroundColor: cardBackgroundColor }]}
        accessible={true}
        accessibilityLabel="WhatsApp assistance"
        accessibilityRole="summary"
      >
        <Text style={[styles.whatsappTitle, { color: textColor }]}>Need Route Planning Help?</Text>
        <Text style={styles.whatsappSubtitle}>Our team can help you plan an accessible route</Text>
        <CustomButton
          title="Message AbiliLife Assistant"
          handlePress={handleWhatsAppAssistance}
          containerStyle={styles.whatsappButton}
          textStyle={styles.whatsappButtonText}
          accessibilityLabel="Message AbiliLife Assistant"
          accessibilityHint="Opens WhatsApp to message for route planning assistance"
        />
      </View>

      {/* Safety Tips Modal */}
      <Modal
        visible={safetyTipsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSafetyTipsVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View 
            style={[styles.modalContent, { backgroundColor }]
            }
            accessibilityLabel="Safety Tips Modal"
            accessibilityRole="alert"
          >
            <View style={styles.modalHeader}>
              <Text 
                style={[styles.modalTitle, { color: textColor }]
                }
                accessibilityRole="header"
              >
                Safety Tips
              </Text>
              <TouchableOpacity 
                onPress={() => setSafetyTipsVisible(false)}
                accessibilityLabel="Close safety tips"
                accessibilityHint="Closes the safety tips modal"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              accessibilityLabel="Safety tips list"
            >
              {getTransportSafetyTips().map(tip => (
                <View 
                  key={tip.id} 
                  style={[styles.tipCard, { backgroundColor: cardBackgroundColor }]}
                  accessible={true}
                  accessibilityLabel={`Safety tip: ${tip.title}`}
                  accessibilityRole="text"
                >
                  <Text style={[styles.tipTitle, { color: textColor }]}>{tip.title}</Text>
                  <Text style={styles.tipContent}>{tip.content}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Legal Rights Modal */}
      <Modal
        visible={legalRightsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLegalRightsVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View 
            style={[styles.modalContent, { backgroundColor }]
            }
            accessibilityLabel="Legal Rights Modal"
            accessibilityRole="alert"
          >
            <View style={styles.modalHeader}>
              <Text 
                style={[styles.modalTitle, { color: textColor }]
                }
                accessibilityRole="header"
              >
                Your Legal Rights
              </Text>
              <TouchableOpacity 
                onPress={() => setLegalRightsVisible(false)}
                accessibilityLabel="Close legal rights"
                accessibilityHint="Closes the legal rights modal"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              accessibilityLabel="Legal rights list"
            >
              {getLegalRights().map(right => (
                <View key={right.id} style={[styles.tipCard, { backgroundColor: cardBackgroundColor }]}>
                  <Text style={[styles.tipTitle, { color: textColor }]}>{right.title}</Text>
                  <Text style={styles.tipContent}>{right.content}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Emergency Contacts Modal */}
      <Modal
        visible={emergencyContactsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEmergencyContactsVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View 
            style={[styles.modalContent, { backgroundColor }]
            }
            accessibilityLabel="Emergency Contacts Modal"
            accessibilityRole="alert"
          >
            <View style={styles.modalHeader}>
              <Text 
                style={[styles.modalTitle, { color: textColor }]
                }
                accessibilityRole="header"
              >
                Emergency Contacts
              </Text>
              <TouchableOpacity 
                onPress={() => setEmergencyContactsVisible(false)}
                accessibilityLabel="Close emergency contacts"
                accessibilityHint="Closes the emergency contacts modal"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              accessibilityLabel="Emergency contacts list"
            >
              {getEmergencyContacts().map(contact => (
                <TouchableOpacity 
                  key={contact.id} 
                  style={[styles.contactCard, { backgroundColor: cardBackgroundColor }]}
                  onPress={() => callNumber(contact.number)}
                  accessibilityLabel={`Call ${contact.name} at ${contact.number}`}
                  accessibilityHint="Tap to call this emergency contact"
                  accessibilityRole="button"
                >
                  <View style={styles.contactInfo}>
                    <Text style={[styles.contactName, { color: textColor }]}>{contact.name}</Text>
                    <Text style={styles.contactNumber}>{contact.number}</Text>
                  </View>
                  <View style={styles.callButton}>
                    <Ionicons name="call" size={24} color={primaryColor} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Route Details Modal */}
      <Modal
        visible={!!selectedRouteId}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRouteDetails}
        accessibilityViewIsModal={true}
      >
        {selectedRoute && selectedRouteSacco && (
          <View style={styles.modalOverlay}>
            <View 
              style={[styles.modalContent, { backgroundColor }]
              }
              accessibilityLabel={`Route ${selectedRoute.routeNumber} Details`}
              accessibilityRole="alert"
            >
              <View style={styles.modalHeader}>
                <Text 
                  style={[styles.modalTitle, { color: textColor }]
                  }
                  accessibilityRole="header"
                >
                  Route Details
                </Text>
                <TouchableOpacity 
                  onPress={closeRouteDetails}
                  accessibilityLabel="Close route details"
                  accessibilityHint="Closes the route details modal"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalScrollView}
                accessibilityLabel={`Details for route ${selectedRoute.routeNumber} from ${selectedRoute.startPoint} to ${selectedRoute.endPoint}`}
              >
                <View style={[styles.routeDetailCard, { backgroundColor: cardBackgroundColor }]}>
                  <View style={styles.routeDetailHeader}>
                    <View style={styles.routeNumberContainerLarge}>
                      <Text style={styles.routeNumberLarge}>{selectedRoute.routeNumber}</Text>
                    </View>
                    <View style={styles.routeHeaderRightLarge}>
                      <Text style={[styles.routeNameLarge, { color: textColor }]}>{selectedRoute.routeName}</Text>
                      {selectedRoute.verified && (
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="shield-checkmark" size={12} color="#fff" />
                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.routeInfoSection}>
                    <Text style={[styles.routeInfoTitle, { color: textColor }]}>Route Information</Text>
                    <View style={styles.routeInfoRow}>
                      <View style={styles.routeInfoItem}>
                        <Ionicons name="location" size={20} color={primaryColor} />
                        <Text style={styles.routeInfoLabel}>Start Point</Text>
                        <Text style={[styles.routeInfoValue, { color: textColor }]}>{selectedRoute.startPoint}</Text>
                      </View>
                      <View style={styles.routeInfoItem}>
                        <Ionicons name="flag" size={20} color={primaryColor} />
                        <Text style={styles.routeInfoLabel}>End Point</Text>
                        <Text style={[styles.routeInfoValue, { color: textColor }]}>{selectedRoute.endPoint}</Text>
                      </View>
                    </View>
                    <View style={styles.routeInfoRow}>
                      <View style={styles.routeInfoItem}>
                        <Ionicons name="time" size={20} color={primaryColor} />
                        <Text style={styles.routeInfoLabel}>Frequency</Text>
                        <Text style={[styles.routeInfoValue, { color: textColor }]}>{selectedRoute.frequency}</Text>
                      </View>
                      <View style={styles.routeInfoItem}>
                        <Ionicons name="timer" size={20} color={primaryColor} />
                        <Text style={styles.routeInfoLabel}>Est. Arrival</Text>
                        <Text style={[styles.routeInfoValue, { color: textColor }]}>{selectedRoute.estimatedArrival}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.accessibilitySection}>
                    <Text style={[styles.routeInfoTitle, { color: textColor }]}>Accessibility Features</Text>
                    <View style={styles.accessibilityRow}>
                      <View 
                        style={styles.accessibilityFeature}
                        accessibilityLabel={`Wheelchair Access: ${selectedRoute.wheelchairAccessible ? 'Available' : 'Not available'}`}
                      >
                        <FontAwesome5 
                          name="wheelchair" 
                          size={20} 
                          color={selectedRoute.wheelchairAccessible ? primaryColor : '#888'} 
                        />
                        <Text style={[
                          styles.accessibilityText, 
                          { color: selectedRoute.wheelchairAccessible ? textColor : '#888' }
                        ]}>Wheelchair Access</Text>
                        <Ionicons 
                          name={selectedRoute.wheelchairAccessible ? "checkmark-circle" : "close-circle"} 
                          size={20} 
                          color={selectedRoute.wheelchairAccessible ? 'green' : 'red'} 
                        />
                      </View>
                      <View 
                        style={styles.accessibilityFeature}
                        accessibilityLabel={`Ramp Access: ${selectedRoute.hasRamp ? 'Available' : 'Not available'}`}
                      >
                        <MaterialCommunityIcons 
                          name="slope-uphill" 
                          size={20} 
                          color={selectedRoute.hasRamp ? primaryColor : '#888'} 
                        />
                        <Text style={[
                          styles.accessibilityText, 
                          { color: selectedRoute.hasRamp ? textColor : '#888' }
                        ]}>Ramp Access</Text>
                        <Ionicons 
                          name={selectedRoute.hasRamp ? "checkmark-circle" : "close-circle"} 
                          size={20} 
                          color={selectedRoute.hasRamp ? 'green' : 'red'} 
                        />
                      </View>
                    </View>
                    <View style={styles.accessibilityRow}>
                      <View 
                        style={styles.accessibilityFeature}
                        accessibilityLabel={`Visual Aids: ${selectedRoute.visualAids ? 'Available' : 'Not available'}`}
                      >
                        <Ionicons 
                          name="eye" 
                          size={20} 
                          color={selectedRoute.visualAids ? primaryColor : '#888'} 
                        />
                        <Text style={[
                          styles.accessibilityText, 
                          { color: selectedRoute.visualAids ? textColor : '#888' }
                        ]}>Visual Aids</Text>
                        <Ionicons 
                          name={selectedRoute.visualAids ? "checkmark-circle" : "close-circle"} 
                          size={20} 
                          color={selectedRoute.visualAids ? 'green' : 'red'} 
                        />
                      </View>
                      <View 
                        style={styles.accessibilityFeature}
                        accessibilityLabel={`Trained Driver: ${selectedRoute.trainedDriver ? 'Available' : 'Not available'}`}
                      >
                        <FontAwesome5 
                          name="chalkboard-teacher" 
                          size={20} 
                          color={selectedRoute.trainedDriver ? primaryColor : '#888'} 
                        />
                        <Text style={[
                          styles.accessibilityText, 
                          { color: selectedRoute.trainedDriver ? textColor : '#888' }
                        ]}>Trained Driver</Text>
                        <Ionicons 
                          name={selectedRoute.trainedDriver ? "checkmark-circle" : "close-circle"} 
                          size={20} 
                          color={selectedRoute.trainedDriver ? 'green' : 'red'} 
                        />
                      </View>
                    </View>
                    <View style={styles.accessibilityRow}>
                      <View 
                        style={styles.accessibilityFeature}
                        accessibilityLabel={`Caregiver Space: ${selectedRoute.caregiverSpace ? 'Available' : 'Not available'}`}
                      >
                        <Ionicons 
                          name="people" 
                          size={20} 
                          color={selectedRoute.caregiverSpace ? primaryColor : '#888'} 
                        />
                        <Text style={[
                          styles.accessibilityText, 
                          { color: selectedRoute.caregiverSpace ? textColor : '#888' }
                        ]}>Caregiver Space</Text>
                        <Ionicons 
                          name={selectedRoute.caregiverSpace ? "checkmark-circle" : "close-circle"} 
                          size={20} 
                          color={selectedRoute.caregiverSpace ? 'green' : 'red'} 
                        />
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.saccoSection}>
                    <Text style={[styles.routeInfoTitle, { color: textColor }]}>Transport Provider</Text>
                    <View style={styles.saccoCard}>
                      <Image 
                        source={{ uri: selectedRouteSacco.logo }}
                        style={styles.saccoLogo}
                        accessibilityLabel={`${selectedRouteSacco.name} logo`}
                      />
                      <View style={styles.saccoInfo}>
                        <Text style={[styles.saccoName, { color: textColor }]}>{selectedRouteSacco.name}</Text>
                        {selectedRouteSacco.partnered && (
                          <View style={styles.partneredBadge}>
                            <Text style={styles.partneredText}>AbiliLife Partner</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.saccoActions}>
                      <TouchableOpacity 
                        style={styles.saccoActionButton}
                        onPress={() => callNumber(selectedRouteSacco.contact)}
                        accessibilityLabel={`Call ${selectedRouteSacco.name}`}
                        accessibilityHint="Tap to call this transport provider"
                        accessibilityRole="button"
                      >
                        <Ionicons name="call" size={20} color={primaryColor} />
                        <Text style={styles.saccoActionText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.saccoActionButton}
                        onPress={() => openWhatsApp(
                          selectedRouteSacco.whatsapp, 
                          `Hello ${selectedRouteSacco.name}, I would like information about route ${selectedRoute.routeNumber} (${selectedRoute.routeName}). I have accessibility requirements.`
                        )}
                        accessibilityLabel={`WhatsApp ${selectedRouteSacco.name}`}
                        accessibilityHint="Tap to message this transport provider on WhatsApp"
                        accessibilityRole="button"
                      >
                        <FontAwesome5 name="whatsapp" size={20} color="#25D366" />
                        <Text style={styles.saccoActionText}>WhatsApp</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View 
                    style={styles.reviewsSection}
                    accessibilityLabel={`Reviews and ratings: ${selectedRoute.rating.toFixed(1)} out of 5 stars from ${selectedRoute.reviews.length} reviews`}
                  >
                    <View style={styles.reviewsSummary}>
                      <View style={styles.reviewsRating}>
                        <Text style={[styles.reviewsRatingNumber, { color: textColor }]}>{selectedRoute.rating.toFixed(1)}</Text>
                        <View style={styles.reviewsStars}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <FontAwesome 
                              key={star} 
                              name={star <= Math.round(selectedRoute.rating) ? "star" : "star-o"} 
                              size={16} 
                              color="#FAB515" 
                              style={{ marginRight: 2 }}
                            />
                          ))}
                        </View>
                        <Text style={styles.reviewsCount}>{selectedRoute.reviews.length} reviews</Text>
                      </View>
                    </View>
                    
                    {selectedRoute.reviews.map(review => (
                      <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                          <Text style={[styles.reviewUserName, { color: textColor }]}>{review.userName}</Text>
                          <View style={styles.reviewStars}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <FontAwesome 
                                key={star} 
                                name={star <= review.rating ? "star" : "star-o"} 
                                size={12} 
                                color="#FAB515" 
                                style={{ marginRight: 1 }}
                              />
                            ))}
                          </View>
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </ScrollView>
  )
}

export default PublicTransportScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  locationButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
  },
  routeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeNumberContainer: {
    backgroundColor: '#7135B1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  routeNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  routeHeaderRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  routeDetails: {
    marginBottom: 12,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeDetailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  accessibilityIcons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  accessibilityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  routeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starRating: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
    marginBottom: 16,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#7135B1',
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  supportTools: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  supportTool: {
    width: '31%',
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  supportToolText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  whatsappCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  whatsappTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  whatsappSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScrollView: {
    marginBottom: 8,
  },
  tipCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: '#888',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDetailCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  routeDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeNumberContainerLarge: {
    backgroundColor: '#7135B1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 14,
  },
  routeNumberLarge: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  routeHeaderRightLarge: {
    flex: 1,
  },
  routeNameLarge: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  routeInfoSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  routeInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  routeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeInfoItem: {
    width: '48%',
    alignItems: 'flex-start',
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginBottom: 2,
  },
  routeInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  accessibilitySection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  accessibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  accessibilityFeature: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessibilityText: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
  },
  saccoSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  saccoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  saccoLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  saccoInfo: {
    flex: 1,
  },
  saccoName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  partneredBadge: {
    backgroundColor: '#7135B1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  partneredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  saccoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  saccoActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saccoActionText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  reviewsSection: {
    marginBottom: 8,
  },
  reviewsSummary: {
    marginBottom: 12,
  },
  reviewsRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsRatingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reviewsStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#888',
  },
  reviewCard: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewUserName: {
    fontWeight: '500',
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
  },
})