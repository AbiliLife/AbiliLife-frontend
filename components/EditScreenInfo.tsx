import React from 'react';
import { Text, View } from 'react-native';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <Text>This is the EditScreenInfo component for the path: {path}</Text>
    </View>
  );
}