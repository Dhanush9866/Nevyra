import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import AppText from '../atoms/AppText';
import PriceTag from '../molecules/PriceTag';
import IconButton from '../atoms/IconButton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onPress?: () => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onPress,
}: CartItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <Image
        source={{ uri: item.product.images[0] }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.info}>
          <AppText variant="body" weight="medium" numberOfLines={2}>
            {item.product.name}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {item.product.brand}
          </AppText>
          <PriceTag
            price={item.product.price}
            originalPrice={item.product.originalPrice}
            discount={item.product.discount}
            size="sm"
          />
        </View>
        <View style={styles.actions}>
          <View style={styles.quantityControl}>
            <IconButton
              icon={Minus}
              onPress={() => onQuantityChange(item.id, item.quantity - 1)}
              size={16}
              color={Colors.text}
              style={styles.quantityButton}
            />
            <AppText variant="body" weight="semibold" style={styles.quantity}>
              {item.quantity}
            </AppText>
            <IconButton
              icon={Plus}
              onPress={() => onQuantityChange(item.id, item.quantity + 1)}
              size={16}
              color={Colors.text}
              style={styles.quantityButton}
            />
          </View>
          <IconButton
            icon={Trash2}
            onPress={() => onRemove(item.id)}
            size={20}
            color={Colors.error}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    ...Colors.shadow.sm,
    gap: Spacing.md,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  info: {
    gap: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: Spacing.xs,
    gap: Spacing.sm,
  },
  quantityButton: {
    padding: Spacing.xs,
  },
  quantity: {
    minWidth: 24,
    textAlign: 'center',
  },
});
