import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Banner } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeBannerCarouselProps {
  banners: Banner[];
  onBannerPress?: (banner: Banner) => void;
}

export default function HomeBannerCarousel({
  banners,
  onBannerPress,
}: HomeBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onBannerPress?.(item)}
            activeOpacity={0.9}
            style={styles.bannerItem}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
              contentFit="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: Spacing.base,
  },
  bannerItem: {
    width: SCREEN_WIDTH - Spacing.base * 2,
    height: 200,
    marginHorizontal: Spacing.base,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: Spacing.md,
    alignSelf: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
    width: 24,
  },
});
