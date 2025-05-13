export interface DoctorFeature {
    id: string;
    name: string;
    color: string;
    backgroundColor: string;
}

export interface DoctorLocation {
    name: string;
    address: string;
}

export interface DoctorReview {
    id: string;
    name: string;
    rating: number;
    text: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    distance?: string;
    rating: number;
    reviewCount: number;
    availability: string | {
        status?: 'available' | 'next';
        text: string;
    };
    about: string;
    experience: string;
    languages: string[];
    features: DoctorFeature[];
    location: DoctorLocation;
    reviews: DoctorReview[];
}