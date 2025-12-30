import React, { useState } from 'react';
import { Plus, Search, Tags, Percent, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockOffers } from '@/services/mockData';
import { Offer } from '@/types';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

const Offers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 0,
    startDate: '',
    endDate: '',
  });
  const { toast } = useToast();

  const filteredOffers = offers.filter(offer => 
    offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (offer.description && offer.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateOffer = () => {
    const offer: Offer = {
      id: `offer-${Date.now()}`,
      ...newOffer,
      isActive: true,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setOffers(prev => [offer, ...prev]);
    setIsCreateOpen(false);
    setNewOffer({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: '',
      endDate: '',
    });
    toast({
      title: 'Offer created',
      description: 'Your new offer has been created successfully.',
    });
  };

  const toggleOfferStatus = (id: string) => {
    setOffers(prev => 
      prev.map(offer => 
        offer.id === id ? { ...offer, isActive: !offer.isActive } : offer
      )
    );
  };

  const activeOffers = offers.filter(o => o.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Offers & Discounts</h1>
          <p className="page-description">
            Create and manage promotional offers
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="btn-primary self-start">
          <Plus className="w-4 h-4" />
          Create Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Tags className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Offers</p>
            <p className="text-2xl font-bold text-foreground">{offers.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/10">
            <Tags className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Offers</p>
            <p className="text-2xl font-bold text-success">{activeOffers}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-warning/10">
            <Percent className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Redemptions</p>
            <p className="text-2xl font-bold text-foreground">
              {offers.reduce((sum, o) => sum + o.usedCount, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search offers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No offers found"
          description="Create your first promotional offer to attract more customers."
          action={
            <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Create Offer
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  {offer.discountType === 'percentage' ? (
                    <Percent className="w-5 h-5 text-primary" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-primary" />
                  )}
                </div>
                <StatusBadge 
                  status={offer.isActive ? 'Active' : 'Inactive'} 
                  variant={offer.isActive ? 'success' : 'muted'}
                />
              </div>
              
              <h3 className="font-semibold text-foreground mb-1">{offer.name}</h3>
              {offer.description && (
                <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
              )}
              
              <div className="p-3 bg-muted/50 rounded-lg mb-4">
                <p className="text-2xl font-bold text-primary">
                  {offer.discountType === 'percentage' 
                    ? `${offer.discountValue}% OFF`
                    : `$${offer.discountValue} OFF`
                  }
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(offer.startDate), 'MMM d')} - {format(new Date(offer.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                {offer.usageLimit && (
                  <p className="text-muted-foreground">
                    Used: {offer.usedCount} / {offer.usageLimit}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <button 
                  onClick={() => toggleOfferStatus(offer.id)}
                  className="btn-secondary flex-1 text-sm py-2"
                >
                  {offer.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn-ghost p-2">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="btn-ghost p-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Offer Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Offer Name</label>
              <input
                value={newOffer.name}
                onChange={(e) => setNewOffer(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Summer Sale"
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <input
                value={newOffer.description}
                onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Discount Type</label>
                <select
                  value={newOffer.discountType}
                  onChange={(e) => setNewOffer(prev => ({ 
                    ...prev, 
                    discountType: e.target.value as 'percentage' | 'flat' 
                  }))}
                  className="input-field"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Discount Value</label>
                <input
                  type="number"
                  value={newOffer.discountValue}
                  onChange={(e) => setNewOffer(prev => ({ 
                    ...prev, 
                    discountValue: parseInt(e.target.value) || 0 
                  }))}
                  placeholder="10"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <input
                  type="date"
                  value={newOffer.startDate}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">End Date</label>
                <input
                  type="date"
                  value={newOffer.endDate}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsCreateOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleCreateOffer}
                disabled={!newOffer.name || !newOffer.discountValue || !newOffer.startDate || !newOffer.endDate}
                className="btn-primary"
              >
                Create Offer
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Offers;
