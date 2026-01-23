import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'newest', label: 'Newest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Ratings' },
];

const PRICE_RANGES = [
  { id: '0-500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { id: '2000-above', label: '₹2000 & Above', min: 2000, max: 100000 },
];

const RATINGS = [
  { id: '4', label: '4★ & above' },
  { id: '3', label: '3★ & above' },
  { id: '2', label: '2★ & above' },
];

export default function FilterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedSort, setSelectedSort] = useState(params.sort as string || 'popularity');
  const [selectedPrice, setSelectedPrice] = useState(params.priceRange as string || '');
  const [selectedRating, setSelectedRating] = useState(params.rating as string || '');

  const handleApply = () => {
    router.back();
    router.setParams({
      sort: selectedSort,
      priceRange: selectedPrice,
      rating: selectedRating,
    });
  };

  const handleClear = () => {
    setSelectedSort('popularity');
    setSelectedPrice('');
    setSelectedRating('');
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <AppText variant="body" weight="bold" style={styles.sectionTitle}>{title}</AppText>
      <View style={styles.optionsContainer}>{children}</View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Filter & Sort',
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleClear} style={{ padding: 8 }}>
              <AppText variant="body" color={Colors.primary} weight="semibold">Clear All</AppText>
            </TouchableOpacity>
          )
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Section title="Sort By">
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, selectedSort === option.id && styles.selectedOption]}
                onPress={() => setSelectedSort(option.id)}
              >
                <AppText variant="body" color={selectedSort === option.id ? Colors.primary : Colors.text}>
                  {option.label}
                </AppText>
                {selectedSort === option.id && <Check size={18} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
          </Section>

          <Section title="Price Range">
            <View style={styles.chipContainer}>
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[styles.chip, selectedPrice === range.id && styles.selectedChip]}
                  onPress={() => setSelectedPrice(selectedPrice === range.id ? '' : range.id)}
                >
                  <AppText variant="caption" color={selectedPrice === range.id ? Colors.white : Colors.textSecondary}>
                    {range.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          <Section title="Customer Ratings">
            <View style={styles.chipContainer}>
              {RATINGS.map((rating) => (
                <TouchableOpacity
                  key={rating.id}
                  style={[styles.chip, selectedRating === rating.id && styles.selectedChip]}
                  onPress={() => setSelectedRating(selectedRating === rating.id ? '' : rating.id)}
                >
                  <AppText variant="caption" color={selectedRating === rating.id ? Colors.white : Colors.textSecondary}>
                    {rating.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </Section>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Apply Filters" onPress={handleApply} fullWidth />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  optionsContainer: {
    gap: Spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  selectedOption: {
    // borderBottomColor: Colors.primary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
