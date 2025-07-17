import ModuleHeader from '@/components/common/ModuleHeader';
import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

const MarketplaceModule = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <ModuleHeader
        title="AbiliLife Access"
        subtitle="Find and explore a variety of products and services to enhance your life."
        onBackPress={() => router.back()}
        color={Colors.orange}
        iconName='shopping-cart'
        iconFamily='FontAwesome'
      />
    </SafeAreaView>
  )
}

export default MarketplaceModule