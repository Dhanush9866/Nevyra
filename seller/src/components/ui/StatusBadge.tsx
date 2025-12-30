import React from 'react';
import { cn } from '@/lib/utils';

type StatusVariant = 'success' | 'warning' | 'destructive' | 'info' | 'muted';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantMap: Record<string, StatusVariant> = {
  // Order statuses
  new: 'info',
  confirmed: 'info',
  packed: 'warning',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'destructive',
  returned: 'destructive',
  
  // Product statuses
  active: 'success',
  inactive: 'muted',
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
  
  // Payment statuses
  paid: 'success',
  failed: 'destructive',
  refunded: 'warning',
  
  // Payout statuses
  processing: 'warning',
  completed: 'success',
  
  // Generic
  true: 'success',
  false: 'muted',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, className }) => {
  const resolvedVariant = variant || variantMap[status.toLowerCase()] || 'muted';
  
  return (
    <span 
      className={cn(
        "status-badge",
        `status-badge-${resolvedVariant}`,
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
