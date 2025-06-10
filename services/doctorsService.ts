import { Doctor } from "@/types/doctor";
import doctorsData from '@/assets/data/doctors.json';

export const getDoctors = (): Doctor[] => {
    return doctorsData as Doctor[];
};

export const getDoctorById = (id: string): Doctor | undefined => {
    return doctorsData.find(doctor => doctor.id === id) as Doctor | undefined;
};

// For production, this would be an async function that fetches from an API
export const fetchDoctors = async (): Promise<Doctor[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getDoctors();
};

export const fetchDoctorById = async (id: string): Promise<Doctor | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getDoctorById(id);
};