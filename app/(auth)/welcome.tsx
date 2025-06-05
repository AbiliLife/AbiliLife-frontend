import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { LogIn, UserPlus, Code } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { images } from '@/constants/Images';

const Welcome = () => {
    const router = useRouter();
    return (
        <View>
            {/* <Image
                source={{ uri: 'https://images.unsplash.com/photo-1558354799-ca11afa2492f?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                style={styles.image}
            /> */}
            <Image
                source={images.welcome}
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Welcome to AbiliLife
                </Text>
                <Text style={styles.subtitle}>
                    Your journey to a more accessible life starts here.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={{ backgroundColor: '#46216E', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                    activeOpacity={0.7}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <LogIn size={20} color="#fff" />
                    <Text style={{ color: '#fff', marginLeft: 10, fontSize: 16 }}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: 'transparent', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, borderWidth: 1, borderColor: '#46216E' }}
                    activeOpacity={0.7}
                    onPress={() => router.push('/(auth)/register')}
                >
                    <UserPlus size={20} color="#46216E" />
                    <Text style={{ color: '#46216E', marginLeft: 10, fontSize: 16 }}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ backgroundColor: '#71717A', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}
                    activeOpacity={0.7}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Code size={20} color="#fff" />
                    <Text style={{ color: '#fff', marginLeft: 10, fontSize: 16 }}>Explore as Guest</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        color: '#46216E',
    },
    subtitle: {
        fontSize: 16,
        color: '#4B3B6B',
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
})

export default Welcome