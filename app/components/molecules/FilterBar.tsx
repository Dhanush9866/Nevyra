import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ChevronDown, SlidersHorizontal, Zap } from 'lucide-react-native';
import AppText from '../atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const FILTERS = [
  { id: 'sort', label: 'Sort', icon: ChevronDown },
  { id: 'filter', label: 'Filter', icon: SlidersHorizontal },
  { id: '5g', label: '5G', icon: Zap },
  { id: 'new', label: 'New Launches' },
  { id: 'brand', label: 'Brand', icon: ChevronDown },
  { id: 'price', label: 'Price', icon: ChevronDown },
];

interface FilterBarProps {
  activeSort?: string;
  activeFilters?: string[];
  onSelectSort?: (id: string) => void;
  onToggleFilter?: (id: string) => void;
}

export default function FilterBar({
  activeSort,
  activeFilters = [],
  onSelectSort,
  onToggleFilter
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => {
          const isActive = activeSort === filter.id || activeFilters.includes(filter.id);

          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => {
                if (filter.id === 'sort' || filter.id === 'brand' || filter.id === 'price') {
                  onSelectSort?.(filter.id);
                } else {
                  onToggleFilter?.(filter.id);
                }
              }}
            >
              <AppText
                variant="caption"
                weight="medium"
                style={[styles.label, isActive && styles.activeLabel]}
              >
                {filter.label}
              </AppText>
              {filter.icon && (
                <filter.icon
                  size={14}
                  color={isActive ? Colors.primary : Colors.text}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 4,
  },
  activeChip: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10', // 10% opacity
  },
  label: {
    color: Colors.text,
  },
  activeLabel: {
    color: Colors.primary,
  },
});
