import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import AppText from '../atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
}

export default function RatingStars({
  rating,
  size = 16,
  showNumber = true,
  reviewCount,
}: RatingStarsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            color={star <= rating ? Colors.rating : Colors.border}
            fill={star <= rating ? Colors.rating : 'transparent'}
          />
        ))}
      </View>
      {showNumber && (
        <AppText variant="caption" color={Colors.textSecondary}>
          {rating.toFixed(1)}
          {reviewCount && ` (${reviewCount})`}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
});
