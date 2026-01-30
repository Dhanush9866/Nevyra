import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Skeleton from '../Skeleton';
import Spacing from '@/constants/spacing';

const HorizontalProductSectionSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={150} height={24} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {[1, 2, 3].map((key) => (
          <View key={key} style={styles.itemWrapper}>
            <Skeleton width="100%" height={180} borderRadius={12} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={12} style={{alignSelf: 'center'}} />
            <Skeleton width="60%" height={12} style={{ marginTop: 4, alignSelf: 'center' }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  itemWrapper: {
    width: 140,
    gap: 0,
  },
});

export default HorizontalProductSectionSkeleton;
