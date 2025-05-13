import { View, StyleSheet } from 'react-native';

interface OnboardingDotsProps {
    currentIndex: number;
    totalSlides: number;
}


export default function OnboardingDots({ currentIndex, totalSlides }: OnboardingDotsProps) {
    return (
        <View style={styles.dotsContainer}>
            {Array.from({ length: totalSlides }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index === currentIndex ? styles.activeDot : styles.inactiveDot,
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#C2C3CB',
    },
    inactiveDot: {
        backgroundColor: '#1E1E1E',
    },
});