/**
 * Location Search Modal Component
 * 
 * Provides a full-screen modal for searching and selecting locations.
 * Features:
 * - Debounced search to reduce API calls
 * - Theme support (light/dark)
 * - Accessibility features
 * - Real-time search suggestions
 * - Touch-friendly interface
 */

import React, { useState, useEffect, useContext } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    TextInput,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

// Types - Location
import type { GeosearchResult } from '@/types/location';

// Location service
import { debouncedGetLocationSuggestions, cancelDebouncedSearch } from '@/services/locationService';

// Assets & Constants
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Context
import { ThemeContext } from '@/contexts/ThemeContext';

interface LocationSearchModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (location: GeosearchResult) => void;
    placeholder?: string;
    initialQuery?: string;
    title?: string;
}

export default function LocationSearchModal({
    visible,
    onClose,
    onSelect,
    placeholder = 'Search for a location',
    initialQuery = '',
    title = 'Select Location'
}: LocationSearchModalProps) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<GeosearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Obtain current theme value
    const { currentTheme } = useContext(ThemeContext);
    const isDarkTheme = currentTheme === 'dark';

    // Reset query when modal becomes visible
    useEffect(() => {
        if (visible) {
            setQuery(initialQuery); // Reset query
            setResults([]); // Reset results
        } else {
            // Cancel any pending searches when modal closes
            cancelDebouncedSearch();
        }
    }, [visible, initialQuery]);

    // Handle search with debouncing
    useEffect(() => {
        if (query.length >= 3) {
            setLoading(true);
            debouncedGetLocationSuggestions(
                query,
                { limit: 10 }, // Limit to 10 results for better UX
                (locations) => {
                    setResults(locations);
                    setLoading(false);
                }
            );
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [query]);

    const handleSelectLocation = (location: GeosearchResult) => {
        onSelect(location);
        onClose();
    };

    const handleClose = () => {
        cancelDebouncedSearch(); // Cancel any pending searches
        onClose();
    };

    const clearSearch = () => {
        setQuery(''); // Clear the search query
        setResults([]); // Clear the search results
        cancelDebouncedSearch(); // Cancel any ongoing search
    };

    const renderLocationItem = ({ item }: { item: GeosearchResult }) => (
        <TouchableOpacity
            style={[
                styles.resultItem,
                {
                    backgroundColor: isDarkTheme ? Colors.darkGray : Colors.white,
                    borderBottomColor: isDarkTheme ? Colors.borderDark : Colors.borderLight
                }
            ]}
            onPress={() => handleSelectLocation(item)}
            accessible={true}
            accessibilityRole="button"
            accessibilityHint={`Select ${item.name} as your location`}
            activeOpacity={0.7}
        >
            <Ionicons
                name="location"
                size={24}
                color={Colors.secondary}
                style={styles.locationIcon}
                accessibilityRole='image'
                accessibilityLabel='Location icon'
            />
            <View style={styles.resultTextContainer}>
                <Text
                    style={[
                        styles.resultText,
                        { color: isDarkTheme ? Colors.white : Colors.black }
                    ]}
                    numberOfLines={2}
                    accessibilityRole='text'
                    accessibilityLabel={item.name}
                >
                    {item.name}
                </Text>
                {item.type && (
                    <Text
                        style={[
                            styles.resultSubtext,
                            { color: Colors.mediumGray }
                        ]}
                        numberOfLines={1}
                        accessibilityRole='text'
                        accessibilityLabel={item.type}
                    >
                        {item.type}
                    </Text>
                )}
            </View>
            <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.mediumGray}
            />
        </TouchableOpacity>
    );

    const renderEmptyState = () => {
        if (loading) return null;

        // Initial state
        if (query.length === 0) {
            return (
                <View style={styles.emptyContainer} accessible={true}>
                    <Ionicons
                        name="search"
                        size={48}
                        color={Colors.mediumGray}
                        accessibilityRole='image'
                        accessibilityLabel='Search icon'
                    />
                    <Text style={[
                        styles.emptyTitle,
                        { color: isDarkTheme ? Colors.white : Colors.black }
                    ]}
                        accessibilityRole='text'
                        accessibilityLabel='Search for a location'
                    >
                        Search for a location
                    </Text>
                    <Text style={[
                        styles.emptySubtext,
                        { color: Colors.mediumGray }
                    ]}
                        accessibilityRole='text'
                        accessibilityLabel='Type at least 3 characters to see suggestions'
                    >
                        Type at least 3 characters to see suggestions
                    </Text>
                </View>
            );
        }

        // Query length is less than 3
        if (query.length > 0 && query.length < 3) {
            return (
                <View style={styles.emptyContainer} accessible={true}>
                    <Text style={[
                        styles.emptyText,
                        { color: Colors.mediumGray }
                    ]}
                        accessibilityRole='text'
                        accessibilityLabel='Type at least 3 characters to search'
                    >
                        Type at least 3 characters to search
                    </Text>
                </View>
            );
        }

        // No results found
        if (results.length === 0) {
            return (
                <View style={styles.emptyContainer} accessible={true}>
                    <Ionicons
                        name="location-outline"
                        size={48}
                        color={Colors.mediumGray}
                        accessibilityRole='image'
                        accessibilityLabel='Location icon'
                    />
                    <Text style={[
                        styles.emptyTitle,
                        { color: isDarkTheme ? Colors.white : Colors.black }
                    ]}
                        accessibilityRole='text'
                        accessibilityLabel='No locations found'
                    >
                        No locations found
                    </Text>
                    <Text style={[
                        styles.emptySubtext,
                        { color: Colors.mediumGray }
                    ]}
                        accessibilityRole='text'
                        accessibilityLabel='Try a different search term'
                    >
                        Try a different search term
                    </Text>
                </View>
            );
        }

        return null;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={handleClose}
            statusBarTranslucent={false}
            accessibilityViewIsModal={true}
        >
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: isDarkTheme ? Colors.darkContainer : Colors.lightContainer }
                ]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <StatusBar
                        barStyle={isDarkTheme ? "light-content" : "dark-content"}
                        backgroundColor={isDarkTheme ? Colors.darkContainer : Colors.lightContainer}
                    />

                    {/* Header */}
                    <View style={[
                        styles.header,
                        { borderBottomColor: isDarkTheme ? Colors.borderDark : Colors.borderLight }
                    ]}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.backButton}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Close search"
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={isDarkTheme ? Colors.white : Colors.black}
                            />
                        </TouchableOpacity>
                        <Text style={[
                            styles.title,
                            { color: isDarkTheme ? Colors.white : Colors.primary }
                        ]}>
                            {title}
                        </Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    {/* Search Input */}
                    <View style={[
                        styles.searchContainer,
                        {
                            backgroundColor: isDarkTheme ? Colors.darkGray : Colors.white,
                            borderColor: isDarkTheme ? Colors.borderDark : Colors.borderLight
                        }
                    ]}>
                        <Ionicons
                            name="search"
                            size={20}
                            color={Colors.mediumGray}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={[
                                styles.searchInput,
                                { color: isDarkTheme ? Colors.white : Colors.black }
                            ]}
                            placeholder={placeholder}
                            placeholderTextColor={Colors.mediumGray}
                            value={query}
                            onChangeText={setQuery}
                            autoFocus={true}
                            returnKeyType="search"
                            accessible={true}
                            accessibilityLabel="Location search input"
                        />
                        {query.length > 0 && (
                            <TouchableOpacity
                                onPress={clearSearch}
                                style={styles.clearButton}
                                accessibilityRole="button"
                                accessibilityLabel="Clear search"
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color={Colors.mediumGray}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Results or Loading */}
                    <View style={styles.content}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator
                                    size="large"
                                    color={Colors.secondary}
                                />
                                <Text style={[
                                    styles.loadingText,
                                    { color: Colors.mediumGray }
                                ]}>
                                    Searching locations...
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={results}
                                keyExtractor={(item, index) => `${item.name}-${item.latitude}-${item.longitude}-${index}`}
                                renderItem={renderLocationItem}
                                ListEmptyComponent={renderEmptyState()}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={results.length === 0 ? styles.emptyListContainer : undefined}
                            />
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    headerSpacer: {
        width: 40, // Balance the back button
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
    content: {
        flex: 1,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        marginHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    locationIcon: {
        marginRight: 12,
    },
    resultTextContainer: {
        flex: 1,
    },
    resultText: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
    resultSubtext: {
        fontSize: 14,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    emptyListContainer: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 40,
    },
});
