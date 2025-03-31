import { StyleSheet, useColorScheme } from 'react-native'
import React from 'react'

import { Text, useThemeColor, View } from '@/components/Themed';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
    const colorScheme = useColorScheme();

    const textColor = useThemeColor({ light: '#46216E', dark: '#fff' }, 'text');

  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 50,
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
      },
      titleContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      title: {
        fontSize: 26,
        fontWeight: "bold",
      },
})