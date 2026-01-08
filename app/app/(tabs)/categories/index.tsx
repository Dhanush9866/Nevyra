import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Image } from 'expo-image';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockCategories } from '@/services/mockData';

export default function CategoriesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          All Categories
        </AppText>
        <AppText variant="body" color={Colors.textSecondary}>
          Explore our wide range of products
        </AppText>
      </View>

      <View style={styles.categoriesList}>
        {mockCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </View>
    </ScrollView>
  );
}

function CategoryCard({ category }: { category: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.categoryCard}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.categoryHeader}
        activeOpacity={0.8}
      >
        <View style={styles.categoryInfo}>
          <Image
            source={{ uri: category.image }}
            style={styles.categoryImage}
            contentFit="cover"
          />
          <View style={styles.categoryText}>
            <AppText variant="body" weight="semibold">
              {category.name}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {category.subcategories.length} subcategories
            </AppText>
          </View>
        </View>
        <ChevronRight
          size={20}
          color={Colors.textSecondary}
          style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.subcategoriesList}>
          {category.subcategories.map((sub: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {}}
              style={styles.subcategoryItem}
              activeOpacity={0.7}
            >
              <AppText variant="body" color={Colors.text}>
                {sub}
              </AppText>
              <ChevronRight size={16} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  categoriesList: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  categoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    ...Colors.shadow.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  categoryImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
  },
  categoryText: {
    gap: Spacing.xs,
  },
  subcategoriesList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
  },
});
