import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Star, Plus, X, Edit2, Trash2, Send } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Assuming react-query is set up
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import IconButton from '@/components/atoms/IconButton'; // Assuming existing component
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { apiService } from '@/services/api';
import { useAuth } from '@/store/AuthContext'; // Assuming AuthContext provides user info

const THEME_PURPLE = Colors.primary;
const THEME_YELLOW = '#FFC200';

export default function ProductReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Need user to identify own reviews

  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reviewsData, isLoading, refetch } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => apiService.getReviews(id as string),
    enabled: !!id,
  });

  const reviews = reviewsData?.data || [];

  // Check if user has already reviewed
  const userReview = reviews.find((r: any) => r.user?._id === user?.id || r.user?.id === user?.id);
  const hasReviewed = !!userReview;

  // Cleanup form when modal closes
  useEffect(() => {
    if (!modalVisible) {
      setEditingReview(null);
      setRating(5);
      setTitle('');
      setComment('');
    }
  }, [modalVisible]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setTitle(editingReview.title || '');
      setComment(editingReview.comment);
      setModalVisible(true);
    }
  }, [editingReview]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReview) {
        // Update Review
        await apiService.updateReview(editingReview._id || editingReview.id, {
          rating,
          title,
          comment
        });
        Alert.alert('Success', 'Review updated successfully');
      } else {
        // Create Review
        await apiService.submitReview(id as string, {
          rating,
          title,
          comment
        });
        Alert.alert('Success', 'Review submitted successfully');
      }
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['product', id] }); // Update product rating
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteReview(reviewId);
              Alert.alert('Success', 'Review deleted');
              queryClient.invalidateQueries({ queryKey: ['reviews', id] });
              queryClient.invalidateQueries({ queryKey: ['product', id] });
              refetch();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete review');
            }
          }
        }
      ]
    );
  };

  const renderStars = (currentRating: number, onRate?: (r: number) => void, size: number = 16) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!onRate}
            onPress={() => onRate && onRate(star)}
          >
            <Star
              size={size}
              fill={star <= currentRating ? THEME_YELLOW : 'transparent'}
              color={star <= currentRating ? THEME_YELLOW : '#ddd'}
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="h3" weight="bold" color={Colors.white}>
          Reviews & Ratings
        </AppText>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Summary Section */}
          <View style={styles.summaryCard}>
            <View style={styles.ratingBig}>
              <AppText variant="h1" weight="bold" style={{ fontSize: 48, color: Colors.text }}>
                {reviews.length > 0
                  ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </AppText>
              <View>
                {renderStars(
                  reviews.length > 0
                    ? Math.round(reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length)
                    : 0,
                  undefined,
                  20
                )}
                <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: 4 }}>
                  {reviews.length} Reviews
                </AppText>
              </View>
            </View>
          </View>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <View style={styles.emptyState}>
              <AppText variant="body" color={Colors.textSecondary}>No reviews yet. Be the first!</AppText>
            </View>
          ) : (
            reviews.map((review: any) => (
              <View key={review._id || review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <AppText variant="h4" weight="bold" color={Colors.primary}>
                        {review.user?.firstName?.charAt(0) || review.userName?.charAt(0) || 'U'}
                      </AppText>
                    </View>
                    <View>
                      <AppText variant="body" weight="bold">
                        {review.user?.firstName ? `${review.user.firstName} ${review.user.lastName || ''}` : (review.userName || 'User')}
                      </AppText>
                      <AppText variant="caption" color={Colors.textSecondary}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </AppText>
                    </View>
                  </View>

                  {/* Edit/Delete for own reviews */}
                  {((user?.id && (review.user?._id === user.id || review.user === user.id)) || review.isOwner) && (
                    <View style={styles.actions}>
                      <TouchableOpacity onPress={() => setEditingReview(review)} style={styles.actionButton}>
                        <Edit2 size={16} color={Colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(review._id || review.id)} style={styles.actionButton}>
                        <Trash2 size={16} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {renderStars(review.rating)}

                {review.title && (
                  <AppText variant="body" weight="bold" style={styles.reviewTitle}>
                    {review.title}
                  </AppText>
                )}

                <AppText variant="body" style={styles.reviewComment}>
                  {review.comment}
                </AppText>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Write a Review FAB (Only if not reviewed yet) */}
      {!hasReviewed && !isLoading && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color={Colors.white} />
          <AppText variant="h4" weight="bold" color={Colors.white} style={{ marginLeft: 8 }}>
            Write Review
          </AppText>
        </TouchableOpacity>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="h3" weight="bold">
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </AppText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingInput}>
              <AppText variant="body" weight="medium" style={{ marginBottom: 8 }}>Rating</AppText>
              {renderStars(rating, setRating, 32)}
            </View>

            <View style={styles.inputGroup}>
              <AppText variant="body" weight="medium" style={{ marginBottom: 4 }}>Title (Optional)</AppText>
              <TextInput
                style={styles.input}
                placeholder="Summary of your experience"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText variant="body" weight="medium" style={{ marginBottom: 4 }}>Review</AppText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us what you liked or disliked..."
                value={comment}
                onChangeText={setComment}
                multiline
                textAlignVertical="top"
              />
            </View>

            <Button
              title={isSubmitting ? 'Submitting...' : 'Submit Review'}
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Colors.shadow.sm,
  },
  ratingBig: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    ...Colors.shadow.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: 4,
  },
  reviewTitle: {
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  reviewComment: {
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  ratingInput: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 100,
  },
});
