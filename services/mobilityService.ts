// Services for handling mobility-related functionality
import { TransportRoute, TransportSacco } from '@/types/mobility'

// Mock data for public transport routes
export const getPublicTransportRoutes = (): TransportRoute[] => {
  return [
    {
      id: '1',
      routeNumber: '125',
      routeName: 'Kikuyu to CBD',
      startPoint: 'Kikuyu',
      endPoint: 'Nairobi CBD',
      frequency: '10-15 mins',
      estimatedArrival: '10 mins',
      wheelchairAccessible: true,
      hasRamp: true,
      visualAids: false,
      trainedDriver: true,
      caregiverSpace: true,
      verified: true,
      saccoId: '1',
      rating: 4.5,
      reviews: [
        {
          id: '1',
          userName: 'Jane M.',
          rating: 4,
          comment: 'Driver was kind and waited while I boarded.',
          date: '2025-05-20'
        },
        {
          id: '2',
          userName: 'Michael O.',
          rating: 5,
          comment: 'Great accessibility, they have a proper ramp.',
          date: '2025-05-15'
        }
      ]
    },
    {
      id: '2',
      routeNumber: '23A',
      routeName: 'Gikambura to Westlands',
      startPoint: 'Gikambura',
      endPoint: 'Westlands',
      frequency: '20-30 mins',
      estimatedArrival: '25 mins',
      wheelchairAccessible: false,
      hasRamp: false,
      visualAids: true,
      trainedDriver: false,
      caregiverSpace: true,
      verified: false,
      saccoId: '2',
      rating: 3.2,
      reviews: [
        {
          id: '3',
          userName: 'Simon K.',
          rating: 3,
          comment: 'Limited access but they have visual indicators.',
          date: '2025-05-18'
        }
      ]
    },
    {
      id: '3',
      routeNumber: '237',
      routeName: 'Ongata Rongai to Nairobi',
      startPoint: 'Ongata Rongai',
      endPoint: 'Nairobi CBD',
      frequency: '15-20 mins',
      estimatedArrival: '15 mins',
      wheelchairAccessible: true,
      hasRamp: true,
      visualAids: true,
      trainedDriver: true,
      caregiverSpace: true,
      verified: true,
      saccoId: '3',
      rating: 4.8,
      reviews: [
        {
          id: '4',
          userName: 'Grace W.',
          rating: 5,
          comment: 'Best accessible route, drivers are well trained!',
          date: '2025-05-22'
        }
      ]
    },
    {
      id: '4',
      routeNumber: '105',
      routeName: 'Thika to Nairobi',
      startPoint: 'Thika',
      endPoint: 'Nairobi CBD',
      frequency: '15-20 mins',
      estimatedArrival: '20 mins',
      wheelchairAccessible: false,
      hasRamp: false,
      visualAids: false,
      trainedDriver: false,
      caregiverSpace: false,
      verified: false,
      saccoId: '4',
      rating: 2.5,
      reviews: [
        {
          id: '5',
          userName: 'Peter M.',
          rating: 2,
          comment: 'Not accessible for wheelchairs at all.',
          date: '2025-05-10'
        }
      ]
    },
    {
      id: '5',
      routeNumber: '58',
      routeName: 'Karen to CBD',
      startPoint: 'Karen',
      endPoint: 'Nairobi CBD',
      frequency: '20-25 mins',
      estimatedArrival: '30 mins',
      wheelchairAccessible: true,
      hasRamp: true,
      visualAids: true,
      trainedDriver: false,
      caregiverSpace: true,
      verified: true,
      saccoId: '5',
      rating: 4.2,
      reviews: [
        {
          id: '6',
          userName: 'Mercy N.',
          rating: 4,
          comment: 'Good ramp and space, but route is bumpy.',
          date: '2025-05-21'
        }
      ]
    }
  ];
};

// Mock data for transport SACCOs
export const getTransportSaccos = (): TransportSacco[] => {
  return [
    {
      id: '1',
      name: 'City Hoppers SACCO',
      contact: '+254712345678',
      whatsapp: '+254712345678',
      routes: ['125', '126', '127'],
      hasWheelchairSpace: true,
      hasCaregiverTraining: true,
      partnered: true,
      logo: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      name: 'Super Metro',
      contact: '+254723456789',
      whatsapp: '+254723456789',
      routes: ['23A', '23B'],
      hasWheelchairSpace: false,
      hasCaregiverTraining: false,
      partnered: false,
      logo: 'https://via.placeholder.com/150'
    },
    {
      id: '3',
      name: 'Rongai Accessible Transport',
      contact: '+254734567890',
      whatsapp: '+254734567890',
      routes: ['237', '238'],
      hasWheelchairSpace: true,
      hasCaregiverTraining: true,
      partnered: true,
      logo: 'https://via.placeholder.com/150'
    },
    {
      id: '4',
      name: 'Thika Riders',
      contact: '+254745678901',
      whatsapp: '+254745678901',
      routes: ['105', '106'],
      hasWheelchairSpace: false,
      hasCaregiverTraining: false,
      partnered: false,
      logo: 'https://via.placeholder.com/150'
    },
    {
      id: '5',
      name: 'Karen Access SACCO',
      contact: '+254756789012',
      whatsapp: '+254756789012',
      routes: ['58', '59'],
      hasWheelchairSpace: true,
      hasCaregiverTraining: true,
      partnered: true,
      logo: 'https://via.placeholder.com/150'
    }
  ];
};

// Safety tips for public transport
export const getTransportSafetyTips = () => {
  return [
    {
      id: '1',
      title: 'Boarding Safely',
      content: 'Always signal the driver and wait for the vehicle to come to a complete stop before attempting to board.'
    },
    {
      id: '2',
      title: 'Securing Your Position',
      content: 'Ask for priority seating and secure your mobility device if possible. Consider traveling with a companion during busy hours.'
    },
    {
      id: '3',
      title: 'Inform the Driver',
      content: 'Let the driver know your destination and any assistance you might need when alighting.'
    },
    {
      id: '4',
      title: 'Travel During Off-Peak',
      content: 'If possible, travel during off-peak hours when vehicles are less crowded and drivers can assist more easily.'
    },
    {
      id: '5',
      title: 'Prepare Payment',
      content: 'Have your fare ready before boarding to avoid fumbling for money during the journey.'
    }
  ];
};

// Legal rights information
export const getLegalRights = () => {
  return [
    {
      id: '1',
      title: 'Right to Accessibility',
      content: 'Kenyas Persons with Disabilities Act entitles you to accessible public transport facilities.'
    },
    {
      id: '2',
      title: 'Priority Seating',
      content: 'You have the right to priority seating in public vehicles.'
    },
    {
      id: '3',
      title: 'Reduced Fares',
      content: 'Some transport providers offer reduced fares for persons with disabilities. Always ask.'
    },
    {
      id: '4',
      title: 'Discrimination Protection',
      content: 'Its illegal for transport providers to refuse service based on disability.'
    },
    {
      id: '5',
      title: 'Complaint Mechanism',
      content: 'Report discrimination to the National Council for Persons with Disabilities at +254-20-2226770.'
    }
  ];
};

// Emergency contacts
export const getEmergencyContacts = () => {
  return [
    {
      id: '1',
      name: 'AbiliLife Mobility Hotline',
      number: '+254700000000'
    },
    {
      id: '2',
      name: 'National Transport Authority',
      number: '+254711111111'
    },
    {
      id: '3',
      name: 'Emergency Services',
      number: '999'
    },
    {
      id: '4',
      name: 'Disability Rights Hotline',
      number: '+254722222222'
    }
  ];
};

// Get a SACCO by ID
export const getSaccoById = (id: string): TransportSacco | undefined => {
  const saccos = getTransportSaccos();
  return saccos.find(sacco => sacco.id === id);
};

// Filter routes by accessibility criteria
export const filterRoutesByAccessibility = (
  routes: TransportRoute[], 
  filters: {
    wheelchairAccessible?: boolean;
    hasRamp?: boolean;
    visualAids?: boolean;
    trainedDriver?: boolean;
    caregiverSpace?: boolean;
    verified?: boolean;
  }
) => {
  return routes.filter(route => {
    if (filters.wheelchairAccessible && !route.wheelchairAccessible) return false;
    if (filters.hasRamp && !route.hasRamp) return false;
    if (filters.visualAids && !route.visualAids) return false;
    if (filters.trainedDriver && !route.trainedDriver) return false;
    if (filters.caregiverSpace && !route.caregiverSpace) return false;
    if (filters.verified && !route.verified) return false;
    return true;
  });
};