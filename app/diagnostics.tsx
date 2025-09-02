// app/diagnostics.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import axios from 'axios';
import { DEV_BACKEND_URL, PROD_BACKEND_URL } from '@/constants/staticURLs';
import Colors from '@/constants/Colors';

export default function DiagnosticsScreen() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ [key: string]: any }>({});

    const runDiagnostics = async () => {
        setLoading(true);
        const diagnosticResults: { [key: string]: any } = {
            environment: __DEV__ ? 'Development' : 'Production',
            timestamp: new Date().toISOString(),
            devBackendUrl: DEV_BACKEND_URL,
            prodBackendUrl: PROD_BACKEND_URL,
            activeBackendUrl: __DEV__ ? DEV_BACKEND_URL : PROD_BACKEND_URL,
        };

        // Test health endpoint with better error handling
        try {
            const url = `${__DEV__ ? DEV_BACKEND_URL : PROD_BACKEND_URL}/health`;
            console.log(`Testing health endpoint: ${url}`);

            const response = await Promise.race([
                axios.get(url),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
                )
            ]) as any;

            diagnosticResults.healthCheck = {
                success: true,
                status: response.status,
                data: response.data,
            };
        } catch (error: any) {
            console.error('Health check error:', error);
            diagnosticResults.healthCheck = {
                success: false,
                error: error.message || 'Unknown error',
                code: error.code || 'NO_CODE',
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : 'No response received',
            };
        }

        setResults(diagnosticResults);
        setLoading(false);
    };

    // Auto-run diagnostics on mount with error handling
    useEffect(() => {
        const safeDiagnostics = async () => {
            try {
                await runDiagnostics();
            } catch (error) {
                console.error('Diagnostics failed to run:', error);
                setResults({
                    error: 'Failed to run diagnostics',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
                setLoading(false);
            }
        };
        safeDiagnostics();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Network Diagnostics' }} />

            <View style={styles.header}>
                <Text style={styles.title}>AbiliLife Network Diagnostics</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={runDiagnostics}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Refresh Tests</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Running diagnostics...</Text>
                </View>
            ) : (
                <ScrollView style={styles.resultsContainer}>
                    {Object.keys(results).map((key) => (
                        <View key={key} style={styles.resultItem}>
                            <Text style={styles.resultKey}>{key}:</Text>
                            <Text style={styles.resultValue}>
                                {typeof results[key] === 'object'
                                    ? JSON.stringify(results[key], null, 2)
                                    : results[key].toString()}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Use this information to diagnose connection issues.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    refreshButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.mediumGray,
    },
    resultsContainer: {
        flex: 1,
    },
    resultItem: {
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
    },
    resultKey: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'monospace',
    },
    footer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    footerText: {
        color: Colors.mediumGray,
        textAlign: 'center',
    },
});