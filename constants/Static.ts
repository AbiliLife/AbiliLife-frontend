// Development Backend URLs - From .env file
export const DEV_BACKEND_URL = process.env.EXPO_PUBLIC_DEV_BACKEND_URL;

// Production Backend URLs - From .env file
export const PROD_BACKEND_URL = process.env.EXPO_PUBLIC_PROD_BACKEND_URL;

// API Keys for external services - From .env file
export const OPEN_CAGE_API_KEY = process.env.EXPO_PUBLIC_OPENCAGE_API_KEY;
export const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// External API URLs
export const GEOAPIFY_API_URL = process.env.EXPO_PUBLIC_GEOAPIFY_API_URL;
export const WHATSAPP_API_URL = process.env.EXPO_PUBLIC_WHATSAPP_API_URL;
export const ACE_MOBILITY_API_URL = process.env.EXPO_PUBLIC_ACE_MOBILITY_API_URL;




// ===============================
// USER ROLES & SYSTEM ROLES
// ===============================
export const USER_ROLES = {
    PWD: 'Person with Disability', // Individual with a disability (main user)
    CAREGIVER: 'Caregiver', // Professional or informal caregiver
    FAMILY_MEMBER: 'Family Member', // Family caregiver or relative
    GUARDIAN: 'Guardian', // Legal guardian caregiver
    DRIVER: 'Driver', // Driver role for transportation services (still a caregiver)
    ADMIN: 'Admin' // System administrator with full access
} as const;

// ===============================
// DISABILITY CLASSIFICATIONS
// ===============================
export const DISABILITY_TYPES = [
    'Physical',
    'Visual', 
    'Hearing',
    'Cognitive',
    'Mental Health',
    'Neurological',
    'Chronic Illness',
    'Multiple',
    'Other'
] as const;

// Detailed physical disabilities
export const PHYSICAL_DISABILITIES = [
    'Spinal Cord Injury',
    'Amputation',
    'Cerebral Palsy',
    'Muscular Dystrophy',
    'Arthritis',
    'Spina Bifida',
    'Paralysis',
    'Limb Differences',
    'Joint Disorders',
    'Other Physical'
] as const;

// Visual impairments
export const VISUAL_IMPAIRMENTS = [
    'Blindness',
    'Low Vision',
    'Color Blindness',
    'Night Blindness',
    'Glaucoma',
    'Cataracts',
    'Diabetic Retinopathy',
    'Macular Degeneration',
    'Other Visual'
] as const;

// Hearing impairments
export const HEARING_IMPAIRMENTS = [
    'Deafness',
    'Hard of Hearing',
    'Auditory Processing Disorder',
    'Tinnitus',
    'Conductive Hearing Loss',
    'Sensorineural Hearing Loss',
    'Mixed Hearing Loss',
    'Other Hearing'
] as const;

// Cognitive disabilities
export const COGNITIVE_DISABILITIES = [
    'Intellectual Disability',
    'Learning Disability',
    'ADHD',
    'Autism Spectrum Disorder',
    'Down Syndrome',
    'Dementia',
    'Traumatic Brain Injury',
    'Memory Disorders',
    'Other Cognitive'
] as const;

// Mental health conditions
export const MENTAL_HEALTH_CONDITIONS = [
    'Depression',
    'Anxiety Disorders',
    'Bipolar Disorder',
    'PTSD',
    'Schizophrenia',
    'OCD',
    'Eating Disorders',
    'Panic Disorder',
    'Other Mental Health'
] as const;

// ===============================
// MOBILITY & ASSISTIVE DEVICES
// ===============================
export const MOBILITY_AIDS = [
    'Manual Wheelchair',
    'Electric Wheelchair',
    'Walker',
    'Rollator',
    'Single Point Cane',
    'Quad Cane',
    'Underarm Crutches',
    'Forearm Crutches',
    'Leg Prosthetic',
    'Arm Prosthetic',
    'Leg Brace',
    'Back Support',
    'Service Animal',
    'Guide Dog',
    'Oxygen Tank',
    'Mobility Scooter',
    'Standing Frame',
    'Transfer Board',
    'None',
    'Other'
] as const;

// ===============================
// VISUAL, HEARING & COGNITIVE AIDS
// ===============================
export const VISUAL_AIDS = [
    'White Cane',
    'Guide Dog',
    'Screen Reader',
    'Magnifying Glass',
    'CCTV Magnifier',
    'Braille Display',
    'Talking Watch',
    'Color Identifier',
    'Navigation App',
    'High Contrast Glasses',
    'None',
    'Other'
] as const;

export const HEARING_AIDS = [
    'Hearing Aid',
    'Cochlear Implant',
    'FM System',
    'Personal Amplifier',
    'Vibrating Alarm',
    'Flashing Light Alert',
    'TTY/TDD Device',
    'Video Phone',
    'Sign Language Interpreter',
    'Real-time Captioning',
    'None',
    'Other'
] as const;

export const COGNITIVE_AIDS = [
    'Memory Reminder Device',
    'Task Scheduling App',
    'Picture Communication Board',
    'Voice Output Device',
    'Simple Phone',
    'Medication Reminder',
    'GPS Tracker',
    'Emergency Button',
    'Visual Schedule',
    'Noise-Canceling Headphones',
    'None',
    'Other'
] as const;

// ==============================
// COMMUNICATION PREFERENCES
// ==============================
export const COMMUNICATION_MODES = [
    'Verbal', // Spoken communication
    'Written', // Text-based communication
    'Sign Language', // Visual-manual communication
    'Visual Aids', // Supports understanding through visuals
    'Gesture', // Communication through body language
    'Touch/Tactile', // Communication through touch
    'Speech-to-Text', // Converts spoken language into text
    'Text-to-Speech', // Converts text into spoken language
    'AAC Device', // Augmentative and Alternative Communication device
    'Communication Board', // Visual support for communication
    'Video Relay Service', // Sign language interpretation via video
    'Telephone Relay Service', // Assists phone communication
    'Real-time Captioning', // Provides live text captions (FOR VIDEO)
    'Interpreter Services', // Professional interpretation support
    'Simple Language', // Use of plain language
    'Picture Exchange', // Communication through images
    'Other' // Any other communication mode
] as const;

export const SIGN_LANGUAGES = [
    'Kenyan Sign Language (KSL)', // Primary sign language in Kenya
    // 'American Sign Language (ASL)', // FUTURE USE
    // 'British Sign Language (BSL)', // FUTURE USE
    // 'International Sign', // FUTURE USE
    // 'Other Sign Language' // FUTURE USE
] as const;

// ==============================
// DEFAULT LANGUAGES - Common languages in Kenya
// ==============================
export const LANGUAGES = [
    'English',
    'Swahili',
    // 'Kikuyu', // FUTURE USE
    // 'Luhya', // FUTURE USE
    // 'Luo', // FUTURE USE
    // 'Kalenjin', // FUTURE USE
    // 'Kamba', // FUTURE USE
    // 'Kisii', // FUTURE USE
    // 'Meru', // FUTURE USE
    // 'Mijikenda', // FUTURE USE
    // 'Turkana', // FUTURE USE
    // 'Other'
] as const;

// ==============================
// RELATIONSHIP & CARE NETWORK
// ==============================
export const RELATIONSHIP_TYPES = [
    'Parent',
    'Child',
    'Sibling',
    'Spouse',
    'Partner',
    'Grandparent',
    'Grandchild',
    'Aunt/Uncle',
    'Cousin',
    'Friend',
    'Caregiver',
    'Personal Assistant',
    'Healthcare Provider',
    'Guardian',
    'Support Worker',
    'Neighbor',
    'Colleague',
    'Teacher',
    'Therapist',
    'Other'
] as const;

export const CARE_LEVELS = [
    'Independent',
    'Minimal Support',
    'Moderate Support',
    'Extensive Support',
    'Full Care'
] as const;

export const EMERGENCY_CONTACT_PRIORITIES = [
    'Primary',
    'Secondary',
    'Tertiary',
    'Medical Emergency Only',
    'Backup'
] as const;

// ===============================
// ACCESSIBILITY PREFERENCES
// ===============================
export const FONT_SIZES = [
    'Small',
    'Medium', 
    'Large',
    'Extra Large',
] as const;

export const CONTRAST_LEVELS = [
    'Normal',
    'High',
    'Extra High',
    'Inverted'
] as const;

export const INTERACTION_METHODS = [
    'Touch', // Touchscreen interaction (e.g., smartphone, tablet)
    'Voice Control', // Voice commands (e.g., Siri, Google Assistant)
    'Eye Tracking', // Eye movement interaction (e.g., Tobii)
    'Head Tracking', // Head movement interaction (e.g., PCEye)
    'Assistive Touch', // Touch-based accessibility feature
    'Other' // Any other interaction method
] as const;

export const NOTIFICATION_TYPES = [
    'Visual',
    'Audio',
    'Vibration',
    'Text',
    'Email',
    'Push Notification',
    'LED Flash',
    'None'
] as const;

// ===============================
// TRANSPORT & MOBILITY SERVICES
// ===============================
export const VEHICLE_TYPES = [
    'Wheelchair Accessible Van',
    'Modified Vehicle',
    'Regular Car',
    'Accessible Bus',
    'Medical Transport',
    'Any Vehicle'
] as const;

export const VEHICLE_FEATURES = [
    'Wheelchair Ramp',
    'Wheelchair Lift',
    'Hand Controls',
    'Swivel Seat',
    'Transfer Seat',
    'Accessible Door',
    'Visual Alerts',
    'Audio Announcements',
    'Space for Service Animal',
    'Oxygen Tank Storage',
    'Medication Storage',
    'Emergency Equipment'
] as const;

export const TRANSFER_ASSISTANCE_TYPES = [
    'None Needed',
    'Minimal Help',
    'Moderate Assistance',
    'Full Transfer',
    'Wheelchair Transfer',
    'Walking Assistance',
    'Two-Person Transfer',
    'Mechanical Lift'
] as const;

export const DRIVER_PREFERENCES = [
    'No Preference',
    'Female Driver',
    'Male Driver',
    'Sign Language Capable',
    'Medical Training',
    'Disability Awareness Trained',
    'Pet Friendly'
] as const;

// ===============================
// CONTACT & COMMUNICATION
// ===============================
export const CONTACT_METHODS = [
    'WhatsApp',
    'SMS',
    'Email',
    'In-App Message',
    'Voice Call',
    'Video Call',
    'Sign Language Video',
    'Text Relay Service',
    'Emergency Alert'
] as const;

export const PREFERRED_CONTACT_TIMES = [
    'Morning (6AM-12PM)',
    'Afternoon (12PM-6PM)',
    'Evening (6PM-10PM)',
    'Night (10PM-6AM)',
    'Business Hours Only',
    'Emergency Only',
    'Anytime'
] as const;

// ===============================
// PAYMENT & FINANCIAL - FUTURE USE
// ================================
export const PAYMENT_METHODS = [
    'Cash',
    'M-Pesa',
    'Airtel Money',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Insurance',
    'Government Voucher',
    'Disability Grant',
    'NGO Sponsorship',
    'Family Payment'
] as const;

export const INSURANCE_PROVIDERS = [
    'NHIF',
    'AAR Insurance',
    'Jubilee Insurance',
    'CIC Insurance',
    'Liberty Life',
    'Old Mutual',
    'Britam',
    'GA Insurance',
    'ICEA LION',
    'Other Private',
    'None'
] as const;

// ================================
// HEALTHCARE & MEDICAL - FUTURE USE
// ================================
export const MEDICAL_CONDITIONS = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Epilepsy',
    'Asthma',
    'COPD',
    'Kidney Disease',
    'Liver Disease',
    'Cancer',
    'HIV/AIDS',
    'Tuberculosis',
    'Mental Health Condition',
    'Chronic Pain',
    'Autoimmune Disorder',
    'Blood Disorder',
    'Other'
] as const;

export const MEDICATION_FREQUENCIES = [
    'As Needed',
    'Daily',
    'Twice Daily',
    'Three Times Daily',
    'Four Times Daily',
    'Weekly',
    'Monthly',
    'Other Schedule'
] as const;

export const HEALTHCARE_PROVIDERS = [
    'General Practitioner',
    'Specialist Doctor',
    'Physiotherapist',
    'Occupational Therapist',
    'Speech Therapist',
    'Psychologist',
    'Psychiatrist',
    'Social Worker',
    'Nurse',
    'Community Health Worker',
    'Traditional Healer',
    'Other'
] as const;

// ================================
// EDUCATION & EMPLOYMENT - FUTURE USE
// ================================
export const EDUCATION_LEVELS = [
    'No Formal Education',
    'Primary Education',
    'Secondary Education',
    'Certificate',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Vocational Training',
    'Special Education',
    'Other'
] as const;

export const EMPLOYMENT_STATUS = [
    'Unemployed',
    'Employed Full-time',
    'Employed Part-time',
    'Self-employed',
    'Student',
    'Retired',
    'Unable to Work',
    'Volunteer',
    'Seeking Employment',
    'On Disability Leave'
] as const;

export const WORK_ACCOMMODATIONS = [
    'Flexible Hours',
    'Remote Work',
    'Accessible Workspace',
    'Assistive Technology',
    'Sign Language Interpreter',
    'Modified Equipment',
    'Frequent Breaks',
    'Job Coach',
    'Reduced Hours',
    'Task Modification',
    'Transportation Support',
    'Personal Assistant'
] as const;

// ================================
// HOUSING & LIVING SITUATION - FUTURE USE
// ================================
export const HOUSING_TYPES = [
    'Private Home',
    'Apartment',
    'Assisted Living',
    'Group Home',
    'Nursing Home',
    'Independent Living Center',
    'Family Home',
    'Rental Property',
    'Government Housing',
    'Temporary Housing',
    'Homeless',
    'Other'
] as const;

export const HOME_MODIFICATIONS = [
    'Wheelchair Ramp',
    'Grab Bars',
    'Accessible Bathroom',
    'Widened Doorways',
    'Lowered Counters',
    'Accessible Kitchen',
    'Stair Lift',
    'Elevator',
    'Visual Alerts',
    'Audio Systems',
    'Emergency Buttons',
    'Smart Home Technology'
] as const;

// ================================
// EMERGENCY & SAFETY - IMPORTANT
// ================================
export const EMERGENCY_TYPES = [
    'Medical Emergency',
    'Fall/Injury',
    'Medication Emergency',
    'Equipment Failure',
    'Lost/Confused',
    'Stuck/Trapped',
    'Communication Emergency',
    'Transportation Emergency',
    'Home Emergency',
    'Personal Safety',
    'Other'
] as const;

export const EMERGENCY_RESPONSE_NEEDS = [
    'Call Ambulance',
    'Contact Doctor',
    'Contact Caregiver',
    'Contact Family',
    'Medication Administration',
    'Equipment Assistance',
    'Communication Support',
    'Transportation Help',
    'Police Assistance',
    'Fire Department'
] as const;

// ================================
// APP MODULES & SERVICES
// ================================
export const APP_MODULES = [
    'Mobility', // AbiliLife Mobility
    'Access', // AbiliLife Access
    'Care', // AbiliLife Care
    'Work', // AbiliLife Work
    'Learn' // AbiliLife Learn
] as const;

export const SERVICE_CATEGORIES = {
    MOBILITY: [
        'Accessible Transport',
        'Public Transport Info',
        'Route Planning',
        'Emergency Transport',
        'Medical Transport',
        'Airport Services'
    ],
    ACCESS: [
        'Assistive Devices',
        'Home Modifications',
        'Digital Accessibility',
        'Legal Support',
        'Advocacy Services',
        'Information Resources'
    ],
    CARE: [
        'Healthcare Services',
        'Therapy Services',
        'Personal Care',
        'Respite Care',
        'Medical Equipment',
        'Health Insurance'
    ],
    WORK: [
        'Job Search',
        'Skills Training',
        'Career Counseling',
        'Workplace Accommodations',
        'Financial Services',
        'Business Support'
    ],
    LEARN: [
        'Online Courses',
        'Skill Development',
        'Adaptive Learning',
        'Certification Programs',
        'Peer Support',
        'Educational Resources'
    ]
} as const;

// ================================
// SYSTEM & TECHNICAL
// ================================
export const APP_THEMES = [
    'Light',
    'Dark',
    'High Contrast Light',
    'High Contrast Dark',
    'System Default'
] as const;

export const DATA_SYNC_FREQUENCIES = [
    'Real-time',
    'Every 5 minutes',
    'Every 15 minutes',
    'Hourly',
    'Daily',
    'Manual Only'
] as const;

export const PRIVACY_LEVELS = [
    'Public',
    'Friends Only',
    'Family Only',
    'Care Team Only',
    'Emergency Contacts Only',
    'Private'
] as const;