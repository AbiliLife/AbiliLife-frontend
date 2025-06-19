import { GuideStep } from "@/types/onboard";
import illustrations from "@/assets/data/illustrations";

/**
 * Guide steps for booking a ride with AbiliLife Mobility.
 * Each step includes a title, optional image, and detailed instructions.
*/
export const guideSteps: GuideStep[] = [
    {
        id: 1,
        title: "Choose Your Mobility Option",
        image: illustrations.mobilityOption,
        steps: [
            {
                main: "On the Mobility Options screen, select:",
                subSteps: [
                    "Private Ride (Ace): Book a private accessible ride.",
                    "Public Transport Info: View accessible public transport options.",
                    "Schedule a Ride: Plan a ride for a future date/time.",
                    "Or tap Caregiver Mode to book for someone in your care."
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Book Your Ride",
        image: illustrations.bookRide,
        steps: [
            {
                main: "If you select Private Ride or Schedule a Ride, you’ll be taken to the Ride Booking screen.",
                subSteps: [
                    "Enter your pickup and drop-off locations.",
                    "Choose ride time (ASAP or Schedule for later).",
                    "Set any accessibility preferences (Ramp/Lift, Assistive Device, Sign Language).",
                    "Add special instructions if needed.",
                    "Review your trip summary.",
                    "Tap Request via WhatsApp to send your booking."
                ]
            }
        ]
    },
    {
        id: 4,
        title: "Tips for Caregivers",
        image: illustrations.caregiver,
        steps: [
            {
                main: "If you’re booking for someone else, use Caregiver Mode from the Mobility screen.",
                subSteps: [
                    "This lets you enter the rider’s details and your own, and includes extra options for caregivers."
                ]
            }
        ]
    },
    {
        id: 5,
        title: "Customize Your Preferences",
        image: illustrations.preferences,
        steps: [
            {
                main: "Visit your profile to update your accessibility needs, preferred drivers, and payment methods anytime."
            }
        ]
    },
    {
        id: 6,
        title: "Need Assistance?",
        image: illustrations.support,
        steps: [
            {
                main: "Use the SOS button in any ride for immediate help.",
                subSteps: [
                    "Our support team is available 24/7 via chat or call."
                ]
            }
        ]
    }
];