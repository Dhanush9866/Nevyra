import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Zap, Trash2, Plus, Minus, Star } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { CartItem } from '@/types';

const { width } = Dimensions.get('window');
const ERROR_RED = '#D11243';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onBuyNow?: (id: string) => void;
  showActions?: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onBuyNow,
  showActions = true,
}) => {
  return (
    <View style={styles.cartItemCard}>
      <View style={styles.itemMainInfo}>
        <View style={styles.itemImageContainer}>
          <Image
            source={{ uri: item.product.images[0] }}
            style={styles.itemImage}
            resizeMode="contain"
          />
          {onUpdateQuantity && (
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                style={styles.qtyButton}
              >
                <Minus size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
              <AppText variant="caption" weight="bold" style={styles.qtyText}>
                {item.quantity}
              </AppText>
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                style={styles.qtyButton}
              >
                <Plus size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {!item.product.inStock && (
            <AppText style={styles.stockStatus} weight="medium">Out of Stock</AppText>
          )}
        </View>

        <View style={styles.itemDetails}>
          <AppText variant="body" weight="medium" numberOfLines={1} style={styles.itemTitle}>
            {item.product.name}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.itemSpecs}>
            {item.product.brand} • {item.product.category}
          </AppText>

          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={12}
                  color={i <= item.product.rating ? Colors.rating : Colors.textLight}
                  fill={i <= item.product.rating ? Colors.rating : 'transparent'}
                  style={{ marginRight: 1 }}
                />
              ))}
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.ratingText}>
              {item.product.rating} • ({item.product.reviewCount})
            </AppText>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Zap size={14} color={Colors.success} />
              <AppText variant="body" weight="semibold" color={Colors.success} style={styles.discountText}>
                {item.product.discount || 0}% OFF
              </AppText>
              <AppText variant="body" color={Colors.textSecondary} style={styles.mrpText}>
                ₹{(item.product.originalPrice || item.product.price * 1.2).toLocaleString('en-IN')}
              </AppText>
              <AppText variant="h4" weight="semibold" style={styles.currentPrice}>
                ₹{item.product.price.toLocaleString('en-IN')}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {showActions && (
        <View style={styles.itemActions}>
          {onRemove && (
            <TouchableOpacity
              style={[styles.actionButton, styles.removeBtn]}
              onPress={() => onRemove(item.id)}
            >
              <Trash2 size={16} color={ERROR_RED} />
              <AppText variant="caption" weight="semibold" style={[styles.actionText, { color: ERROR_RED }]}>Remove</AppText>
            </TouchableOpacity>
          )}
          {onBuyNow && (
            <TouchableOpacity
              style={[styles.actionButton, styles.buyBtn]}
              onPress={() => onBuyNow(item.id)}
            >
              <Zap size={16} color={Colors.white} />
              <AppText variant="caption" weight="semibold" style={[styles.actionText, { color: Colors.white }]}>Buy this now</AppText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemMainInfo: {
    flexDirection: 'row',
  },
  itemImageContainer: {
    width: width * 0.25,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: '#F9F9F9',
  },
  qtyButton: {
    padding: 6,
  },
  qtyText: {
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  stockStatus: {
    color: ERROR_RED,
    fontSize: 10,
    marginTop: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    marginBottom: 2,
  },
  itemSpecs: {
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    lineHeight: 14,
  },
  priceContainer: {
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    marginLeft: 4,
    marginRight: 8,
  },
  mrpText: {
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  currentPrice: {
    color: Colors.black,
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  removeBtn: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFE0E0',
  },
  buyBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 11,
  },
});

export default CartItemCard;
