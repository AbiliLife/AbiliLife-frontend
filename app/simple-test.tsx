import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function SimpleTestScreen() {
    const [status, setStatus] = useState('Ready to test...');
    const [results, setResults] = useState<Array<{ test: string; result: string; success: boolean }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const addResult = (test: string, result: string, success: boolean) => {
        setResults(prev => [...prev, { test, result, success }]);
    };

    const testConnection = async () => {
        setIsLoading(true);
        setResults([]);

        try {
            // Test 1: Environment detection
            setStatus('Checking environment...');
            const isDev = __DEV__;
            addResult('Environment Detection', `Running in: ${isDev ? 'Development' : 'Production'}`, true);

            // Test 2: Test public API first
            setStatus('Testing public API...');
            try {
                const publicResponse = await fetch('https://httpbin.org/json', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (publicResponse.ok) {
                    addResult('Public API Test', `✅ httpbin.org responded with status ${publicResponse.status}`, true);
                } else {
                    addResult('Public API Test', `❌ httpbin.org responded with status ${publicResponse.status}`, false);
                }
            } catch (error: any) {
                addResult('Public API Test', `❌ Error: ${error.message}`, false);
            }

            // Test 3: Test our backend health endpoint
            setStatus('Testing AbiliLife backend...');
            try {
                const backendUrl = 'https://abililife-backend-api.onrender.com/health';
                const backendResponse = await fetch(backendUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (backendResponse.ok) {
                    const data = await backendResponse.json();
                    addResult('Backend Health', `✅ Backend responded: ${JSON.stringify(data)}`, true);
                } else {
                    addResult('Backend Health', `❌ Backend error: ${backendResponse.status} - ${backendResponse.statusText}`, false);
                }
            } catch (error: any) {
                addResult('Backend Health', `❌ Backend connection failed: ${error.message}`, false);
            }

            // Test 4: Test with different method (POST to login endpoint)
            setStatus('Testing login endpoint...');
            try {
                const loginUrl = 'https://abililife-backend-api.onrender.com/api/v1/auth/login';
                const loginResponse = await fetch(loginUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'testpassword'
                    }),
                });

                // We expect this to fail with 400 or similar, but connection should work
                if (loginResponse.status === 400 || loginResponse.status === 401) {
                    addResult('Login Endpoint', `✅ Login endpoint reachable (status: ${loginResponse.status})`, true);
                } else if (loginResponse.ok) {
                    addResult('Login Endpoint', `✅ Login endpoint responded (status: ${loginResponse.status})`, true);
                } else {
                    addResult('Login Endpoint', `⚠️ Unexpected status: ${loginResponse.status}`, false);
                }
            } catch (error: any) {
                addResult('Login Endpoint', `❌ Login endpoint failed: ${error.message}`, false);
            }

            setStatus('Tests completed!');
        } catch (error: any) {
            addResult('General Error', `❌ Unexpected error: ${error.message}`, false);
            setStatus('Tests failed with error');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-run tests on mount
    useEffect(() => {
        testConnection();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Network Test',
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => router.replace('/welcome')}
                        style={styles.headerButton}
                    >
                        <Text style={styles.headerButtonText}>Continue</Text>
                    </TouchableOpacity>
                )
            }} />

            <View style={styles.header}>
                <Text style={styles.title}>Simple Network Test</Text>
                <Text style={styles.subtitle}>Testing connectivity before main app</Text>
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.status}>{status}</Text>
                {isLoading && (
                    <View style={styles.loadingDot}>
                        <Text>⏳</Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.resultsContainer}>
                {results.map((result, index) => (
                    <View key={index} style={[styles.resultItem, result.success ? styles.successItem : styles.errorItem]}>
                        <Text style={styles.testName}>{result.test}</Text>
                        <Text style={styles.testResult}>{result.result}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.infoContainer}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.gray500} />
                <Text style={styles.infoText}>
                    We have added this simple network diagnostics tool to help identify connectivity issues with our backend services. This can be useful if you encounter problems logging in or accessing certain features. The tests include checking connectivity to a public API (httpbin.org) and our own backend health and login endpoints. If any tests fail, please check your internet connection or contact support for further assistance.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.retryButton]}
                    onPress={testConnection}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>Retry Tests</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.continueButton]}
                    onPress={() => router.replace('/welcome')}
                >
                    <Text style={styles.buttonText}>Continue to App</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.gray500,
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        minHeight: 30,
    },
    status: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.gray800,
    },
    loadingDot: {
        marginLeft: 8,
    },
    resultsContainer: {
        flex: 1,
        marginBottom: 20,
    },
    resultItem: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    successItem: {
        backgroundColor: '#f0f9ff',
        borderColor: '#22c55e',
    },
    errorItem: {
        backgroundColor: '#fef2f2',
        borderColor: '#ef4444',
    },
    testName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.gray800,
    },
    testResult: {
        fontSize: 13,
        color: Colors.gray500,
        lineHeight: 18,
    },
    infoContainer: {
        marginBottom: 20,
        padding: 12,
        borderRadius: 8,
        backgroundColor: Colors.gray300,
    },
    infoText: {
        fontSize: 14,
        color: Colors.gray500,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    retryButton: {
        backgroundColor: Colors.gray300,
    },
    continueButton: {
        backgroundColor: Colors.primary,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
    },
    headerButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.primary,
        borderRadius: 6,
    },
    headerButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});
