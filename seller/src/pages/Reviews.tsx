import React, { useState } from 'react';
import { Search, Star, MessageSquare, Filter } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockReviews } from '@/services/mockData';
import { Review } from '@/types';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

const Reviews: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const handleSubmitReply = () => {
    if (selectedReview && replyText.trim()) {
      setReviews(prev => 
        prev.map(r => 
          r.id === selectedReview.id 
            ? { ...r, sellerReply: replyText, sellerReplyDate: new Date().toISOString() }
            : r
        )
      );
      toast({
        title: 'Reply submitted',
        description: 'Your reply has been posted.',
      });
      setSelectedReview(null);
      setReplyText('');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-warning fill-warning' : 'text-muted'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Reviews & Ratings</h1>
        <p className="page-description">
          Manage customer reviews and respond to feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-foreground">{averageRating.toFixed(1)}</p>
            <div className="flex justify-center mt-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {reviews.length} reviews
            </p>
          </div>
        </div>
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="font-medium text-foreground mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-foreground">{rating}</span>
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warning rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews found"
          description="Customer reviews will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start gap-4">
                <img 
                  src={review.productImage} 
                  alt={review.productName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{review.productName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          by {review.customerName}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  {review.title && (
                    <p className="font-medium text-foreground mt-3">{review.title}</p>
                  )}
                  <p className="text-muted-foreground mt-2">{review.comment}</p>
                  
                  {review.sellerReply ? (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Seller Reply • {format(new Date(review.sellerReplyDate!), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-foreground">{review.sellerReply}</p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedReview(review);
                        setReplyText('');
                      }}
                      className="btn-secondary text-sm mt-4"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm text-muted-foreground">
                    by {selectedReview.customerName}
                  </span>
                </div>
                <p className="text-sm text-foreground">{selectedReview.comment}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a professional and helpful reply..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                  className="btn-primary"
                >
                  Submit Reply
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;
