import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import Intro Screens
import Intro1 from './intro/Intro1';
import Intro2 from './intro/Intro2';
import Intro3 from './intro/Intro3';
import Intro4 from './intro/Intro4';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const introScreens = [
    { key: '1', component: <Intro1 /> },
    { key: '2', component: <Intro2 /> },
    { key: '3', component: <Intro3 /> },
    { key: '4', component: <Intro4 /> },
];

const Intro = () => {
    const navigation = useNavigation();

    const handleSkip = () => {
        navigation.navigate('Main');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.introHeader}>
                <Button title="Skip" onPress={handleSkip} />
                <View style={styles.accessibilityContainer}>
                    <Ionicons name="accessibility" size={28} color="black" />
                    <Text style={styles.accessibilityText}>Accessibility Settings</Text>
                </View>
            </View>
            <FlatList
                data={introScreens}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.screenContainer}>
                        {item.component}
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screenContainer: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    introHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    accessibilityContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    accessibilityText: {
        marginLeft: 5,
        fontSize: 12,
    },
});

export default Intro;