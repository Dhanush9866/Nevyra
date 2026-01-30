import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../Skeleton';
import CategoryItemSkeleton from '../molecules/CategoryItemSkeleton';
import HorizontalProductSectionSkeleton from '../organisms/HorizontalProductSectionSkeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreenSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Skeleton width="100%" height={50} borderRadius={8} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <Skeleton
          width="92%"
          height={180}
          borderRadius={16}
          style={{ alignSelf: 'center', marginTop: Spacing.md }}
        />

        {/* Categories */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: Spacing.md }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <CategoryItemSkeleton key={i} />
            ))}
          </ScrollView>
        </View>

        {/* Sections */}
        <HorizontalProductSectionSkeleton />
        <HorizontalProductSectionSkeleton />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.md,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginTop: Spacing.lg,
  },
});

export default HomeScreenSkeleton;
