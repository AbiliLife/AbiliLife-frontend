import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Splash = () => {
    return (
        <View style={styles.container}>
            {/* Logo Placeholder */}
            <View style={styles.logoContainer}>
                <View style={styles.logo} />
            </View>
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: '30%',
    },
    logo: {
        width: 120,
        height: 120,
        backgroundColor: 'black',
        borderRadius: 24,
    },
})