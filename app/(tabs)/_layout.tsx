import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/common/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs tabBar={props => <CustomTabBar {...props} />} />
  );
}