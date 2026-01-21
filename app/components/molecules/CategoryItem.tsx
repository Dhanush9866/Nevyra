import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import AppText from '../atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const AnimatedImage = Animated.createAnimatedComponent(View);

interface CategoryItemProps {
  name: string;
  image: string;
  onPress: () => void;
  scrollY?: Animated.Value;
}

export default function CategoryItem({
  name,
  image,
  onPress,
  scrollY,
}: CategoryItemProps) {
  // Animation for icons: scale and fade out
  const scale = scrollY ? scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.4],
    extrapolate: 'clamp',
  }) : 1;

  const opacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  }) : 1;

  const imageHeight = scrollY ? scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [64, 0],
    extrapolate: 'clamp',
  }) : 64;

  // Stop the text from translating UP to prevent overlap with search bar
  const textTranslateY = 0;

  const backgroundColor = scrollY ? scrollY.interpolate({
    inputRange: [30, 50],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.12)'],
    extrapolate: 'clamp',
  }) : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View style={[
        styles.imageContainer,
        {
          transform: [{ scale }],
          opacity,
          height: imageHeight,
          marginBottom: scrollY ? scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [Spacing.xs, 0], // Stop at 0 to keep text neatly below search
            extrapolate: 'clamp'
          }) : Spacing.xs
        }
      ]}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
        />
      </Animated.View>
      <Animated.View style={[
        styles.textWrapper,
        {
          transform: [{ translateY: textTranslateY }],
          backgroundColor: backgroundColor as any
        }
      ]}>
        <AppText
          variant="caption"
          weight="semibold"
          align="center"
          numberOfLines={1}
          color={Colors.white}
          style={{ fontSize: 13 }}
        >
          {name}
        </AppText>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textWrapper: {
    paddingHorizontal: Spacing.sm, // Reduced from md
    paddingVertical: 6,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
