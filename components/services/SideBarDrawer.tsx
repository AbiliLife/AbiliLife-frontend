import { Animated, Dimensions, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View as RNView } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, useThemeColor, View } from '@/components/Themed'

// Include NavItem interface to match the services screen
interface NavItem {
  id: string;
  icon: string;
  iconType: 'ionicons' | 'material' | 'fontawesome';
  title: string;
  hasChevron?: boolean;
  onPress: () => void;
}

interface SideBarDrawerProps {
    visible: boolean;
    onClose: () => void;
    textColor?: string;
    primaryColor?: string;
    navItems: NavItem[];
    renderIcon: (item: NavItem) => React.ReactElement;
}

// Dimensions for the sidebar
const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

const SideBarDrawer = ({ visible, onClose, textColor, primaryColor, navItems, renderIcon }: SideBarDrawerProps) => {
    // Animation values for the sidebar
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    // Handle animations when visibility changes
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -DRAWER_WIDTH,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <RNView style={[
                styles.modalContainer,
                { paddingTop: insets.top, paddingBottom: insets.bottom }
            ]}>
                {/* Backdrop - closes drawer when tapped */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View
                        style={[
                            styles.backdrop,
                            { opacity: fadeAnim }
                        ]}
                    />
                </TouchableWithoutFeedback>

                {/* Sidebar Content */}
                <Animated.View
                    style={[
                        styles.sidebar,
                        {
                            transform: [{ translateX: slideAnim }],
                            height: '100%'
                        }
                    ]}
                >
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <RNView style={styles.profileContainer}>
                            <RNView style={styles.profileAvatar}>
                                <Text style={styles.profileInitials}>EK</Text>
                            </RNView>
                            <RNView style={styles.profileInfo}>
                                <Text style={styles.profileName}>Eli Keli</Text>
                                <Text style={styles.profileViewText}>View Profile</Text>
                            </RNView>
                        </RNView>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Navigation Items */}
                    <View style={styles.navItemsContainer}>
                        {navItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.navItem}
                                onPress={item.onPress}
                            >
                                <RNView style={styles.navItemContent}>
                                    {renderIcon(item)}
                                    <Text style={[styles.navItemText, { color: textColor }]}>
                                        {item.title}
                                    </Text>
                                </RNView>
                                {item.hasChevron && (
                                    <Ionicons name="chevron-forward" size={22} color={primaryColor} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <View style={styles.logoutContainer}>
                        <TouchableOpacity style={styles.logoutButton}>
                            <Ionicons name="log-out-outline" size={20} color={primaryColor} />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </RNView>
        </Modal>
    )
}

export default SideBarDrawer

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
        width: DRAWER_WIDTH,
        height: '100%',
        backgroundColor: 'white',
    },
    profileSection: {
        height: 80,
        backgroundColor: '#7135B1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitials: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7135B1',
    },
    profileInfo: {
        marginLeft: 12,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    profileViewText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navItemsContainer: {
        flex: 1,
        paddingTop: 16,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    navItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navItemText: {
        fontSize: 16,
        marginLeft: 16,
        // color: '#46216E',
    },
    logoutContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#7135B1',
        borderRadius: 24,
        paddingVertical: 12,
    },
    logoutText: {
        color: '#7135B1',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
})