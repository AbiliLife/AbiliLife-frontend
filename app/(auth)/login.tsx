import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';


import { useThemeColor, View, Text } from '@/components/Themed';
import FormField from '@/components/common/FormField'
import CustomButton from '@/components/common/CustomButton';

export default function LoginScreen() {
    const colorScheme = useColorScheme();

    // State for the form fields
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Theme colors
    const primaryColor = useThemeColor({ light: '#7135B1', dark: '#9C68E7' }, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.container}>
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
                    Welcome Back!
                </Text>
                <Text style={[styles.subTitle, { color: colorScheme === 'dark' ? '#888' : '#46216E' }]}>
                    Please enter your credentials to access your account.
                </Text>

                {/* Form Fields */}
                <View style={styles.formContainer}>
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
                </View>

                <TouchableOpacity
                    style={styles.forgotPasswordContainer}
                    onPress={() => { }}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.forgotPasswordText, { color: colorScheme === 'dark' ? '#fff' : '#7135B1' }]}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                <CustomButton
                    title="Login"
                    handlePress={() => router.replace("/(tabs)")}
                    containerStyle={{
                        backgroundColor: primaryColor,
                        paddingVertical: 15,
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

                <Text style={{ color: textColor, marginTop: 20, textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        style={{ color: primaryColor, fontWeight: 'bold' }}
                        onPress={() => { }}
                    >
                        Register
                    </Link>
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
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
})