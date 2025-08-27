import React from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Constants
import { images } from '@/constants/Images';
import Colors from '@/constants/Colors';

// Components - Onboard
import Button from '@/components/onboard/Button';

// Context & Store
import { ThemeContext } from '@/contexts/ThemeContext';
import { useOnboardingStore } from '@/store/onboardingStore';


// Beta Badge - for pilot mode
const BetaBadge = () => {
    return (
        <View style={styles.betaBadgeContainer}>
            <Text style={styles.betaBadgeText}>Pilot Mode - Early Access</Text>
        </View>
    );
};

const Welcome = () => {
    const router = useRouter();

    // Obtain context values
    const { currentTheme } = React.useContext(ThemeContext);
    const { user } = useOnboardingStore();

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: currentTheme === 'light' ? Colors.lightContainer : Colors.darkContainer }}
            edges={['top', 'left', 'right']}
        >
            <Image
                source={images.welcome}
                style={styles.image}
                resizeMode="cover"
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel="Welcome illustration"
                accessibilityHint="Illustration welcoming users to AbiliLife"
            />

            <BetaBadge />

            <View style={styles.textContainer} accessible={true}>
                <Text style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Welcome to AbiliLife">
                    Welcome to AbiliLife
                </Text>
                <Text style={[styles.subtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Your journey to a more accessible life starts here.">
                    Your journey to a more accessible life starts here.
                </Text>
            </View>

            <View style={styles.buttonContainer} accessible={true}>
                <Text style={{ color: currentTheme === 'light' ? Colors.accent : Colors.lightGray, textAlign: 'center', textDecorationLine: 'underline' }} accessibilityRole="text" accessibilityLabel="Are you a new user?">
                    Are you a new user?
                </Text>
                <Button
                    title="Get Started"
                    onPress={() => user.hasSeenOnboardingSlide === false ? router.replace('/onboard-slides')
                        : Alert.alert(
                            "Oh! It seems like you already started your onboarding process.",
                            "Login to continue where you left of.",
                            [
                                {
                                    text: "Sign In",
                                    onPress: () => router.replace('/auth')
                                }
                            ]
                        )
                    }
                    variant="primary"
                    style={{ marginTop: 10 }}
                />

                <Text style={{ color: currentTheme === 'light' ? Colors.accent : Colors.lightGray, textAlign: 'center', marginTop: 10, textDecorationLine: 'underline' }} accessibilityRole="text" accessibilityLabel="Already have an account?">
                    Already have an account?
                </Text>
                <Button
                    title="Sign In"
                    onPress={() => router.replace('/auth')}
                    variant="outline"
                    style={{ marginTop: 10 }}
                />

                {/* Uncomment for Developer Mode */}
                {/* <Button
                    title="Guest/Developer Mode"
                    onPress={() => router.push('/(tabs)')}
                    variant="secondary"
                    style={{ marginTop: 10 }}
                /> */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '55%',
        resizeMode: 'cover',
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 28,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },

    betaBadgeContainer: {
        alignSelf: 'center',
        backgroundColor: Colors.orange,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 10,
    },
    betaBadgeText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
})

export default Welcome