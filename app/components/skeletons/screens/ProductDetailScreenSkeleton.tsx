import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProductDetailScreenSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header Placeholder */}
      <View style={[styles.header, { paddingTop: insets.top, height: 60 + insets.top }]}>
        <View style={styles.headerContent}>
             <Skeleton width={40} height={40} borderRadius={20} /> 
             <Skeleton width={200} height={40} borderRadius={8} /> 
             <Skeleton width={40} height={40} borderRadius={20} /> 
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 60, paddingBottom: 100 }}
      >
        <Skeleton width={width} height={width} borderRadius={0} />

        <View style={styles.content}>
          <Skeleton width={100} height={14} style={{ marginBottom: 8 }} />
          <Skeleton width="90%" height={24} style={{ marginBottom: 12 }} />

          <View style={styles.row}>
            <Skeleton width={100} height={16} />
          </View>

          <Skeleton width={120} height={28} style={{ marginTop: 12, marginBottom: 24 }} />

          <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width="80%" height={14} style={{ marginBottom: 24 }} />

          <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height={40} style={{ marginBottom: 8 }} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
        <Skeleton width="48%" height={48} borderRadius={8} />
        <Skeleton width="48%" height={48} borderRadius={25} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.primary, // Simulate header bg
    justifyContent: 'center'
  },
  headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.base,
      alignItems: 'center'
  },
  content: {
    padding: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductDetailScreenSkeleton;
