import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { images } from '@/constants/Images';
import Colors from '@/constants/Colors';

import Button from '@/components/onboard/Button';

import { ThemeContext } from '@/contexts/ThemeContext';

const Welcome = () => {
    const router = useRouter();

    const { currentTheme } = React.useContext(ThemeContext);

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
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: currentTheme === 'light' ? Colors.primary : Colors.white }]} accessibilityRole="header" accessibilityLabel="Welcome to AbiliLife">
                    Welcome to AbiliLife
                </Text>
                <Text style={[styles.subtitle, { color: currentTheme === 'light' ? Colors.accent : Colors.lightGray }]} accessibilityRole="text" accessibilityLabel="Your journey to a more accessible life starts here.">
                    Your journey to a more accessible life starts here.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Get Started"
                    onPress={() => router.push('/onboard')}
                    variant="primary"
                />
                <Button
                    title="Guest/Developer Mode"
                    onPress={() => router.push('/(tabs)')}
                    variant="secondary"
                    style={{ marginTop: 10 }}
                />
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
        height: '60%',
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
})

export default Welcome