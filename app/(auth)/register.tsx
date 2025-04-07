import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router';


import { useThemeColor, View, Text } from '@/components/Themed';
import FormField from '@/components/common/FormField'
import CustomButton from '@/components/common/CustomButton';

export default function RegisterScreen() {
    const colorScheme = useColorScheme();

    // State for the form fields
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    // Theme colors
    const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor }} edges={['top', 'left', 'right']}>
            {/* Logo and brand */}
            <View style={styles.logoContainer}>
                <View style={styles.logoBox}>
                    <Text style={styles.logoText}>AL</Text>
                </View>
                <Text style={[styles.brandName, { color: colorScheme === 'dark' ? '#fff' : '#7135B1' }]}>
                    AbiliLife
                </Text>
            </View>

                {/* Welcome Text */}
                <Text style={[styles.title, { color: textColor }]}>
                    Create Account
                </Text>
                <Text style={[styles.subTitle, { color: colorScheme === 'dark' ? '#888' : '#46216E' }]}>
                    Join us to unlock a world of possibilities and support for your unique journey.
                </Text>
            
            <ScrollView contentContainerStyle={styles.container}>


                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <View style={styles.fieldsContainer}>
                        <Text style={styles.fieldLabel}>
                            Username
                        </Text>
                        <FormField
                            title="Username"
                            icon="person"
                            placeholder="Enter your username"
                            value={username}
                            handleChangeText={(text: string) => setUsername(text)}
                        />
                    </View>

                    <View style={styles.fieldsContainer}>
                        <Text style={styles.fieldLabel}>
                            Email Address
                        </Text>
                        <FormField
                            title="Email"
                            icon="mail"
                            placeholder="Enter your email"
                            value={email}
                            handleChangeText={(text: string) => setEmail(text)}
                        />
                    </View>

                    <View style={styles.fieldsContainer}>
                        <Text style={styles.fieldLabel}>
                            Phone Number
                        </Text>
                        <FormField
                            title="Phone"
                            icon="call"
                            placeholder="Enter your phone number"
                            value={phone}
                            handleChangeText={(text: string) => setPhone(text)}
                        />
                    </View>

                    <View style={styles.fieldsContainer}>
                        <Text style={styles.fieldLabel}>
                            Password
                        </Text>
                        <FormField
                            title="Password"
                            icon="lock-closed"
                            value={password}
                            handleChangeText={(text: string) => setPassword(text)}
                            placeholder="Enter your password"
                            secureTextEntry={true}
                        />
                    </View>

                    <View style={styles.fieldsContainer}>
                        <Text style={styles.fieldLabel}>
                            Confirm Password
                        </Text>
                        <FormField
                            title="Password"
                            icon="lock-closed"
                            value={confirmPassword}
                            handleChangeText={(text: string) => setConfirmPassword(text)}
                            placeholder="Re-enter your password"
                            secureTextEntry={true}
                        />
                    </View>
                </View>
            </ScrollView>
                <CustomButton
                    title="Create Account"
                    handlePress={() => { }}
                    containerStyle={{
                        backgroundColor: primaryColor,
                        paddingVertical: 15,
                        marginTop: 20,
                    }}
                    textStyle={{ color: '#fff', fontSize: 16 }}
                />

                {/* Social login section */}
                <View style={styles.orContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>Or continue with</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Text style={styles.socialButtonText}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        style={{ color: primaryColor, fontWeight: 'bold' }}
                        onPress={() => { }}
                    >
                        Login
                    </Link>
                </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBox: {
        width: 40,
        height: 40,
        backgroundColor: '#7135B1',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    logoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        marginTop: 40,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    formContainer: {
        marginBottom: 20,
    },
    fieldsContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 12,
        color: '#666',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    socialButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.48,
    },
    socialButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    loginText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
})