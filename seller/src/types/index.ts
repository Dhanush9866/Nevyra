// Seller Types
export interface Seller {
  id: string;
  email: string;
  name: string;
  storeName: string;
  storeLogo?: string;
  storeDescription?: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export type ProductStatus = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';

export interface ProductVariant {
  id: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  status: ProductStatus;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  variants?: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export type OrderStatus = 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CustomerAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: CustomerAddress;
  billingAddress: CustomerAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  variantName?: string;
  stock: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

// Earnings & Payout Types
export interface Earning {
  id: string;
  orderId: string;
  orderNumber: string;
  grossAmount: number;
  platformCommission: number;
  taxDeduction: number;
  netAmount: number;
  status: 'pending' | 'processed' | 'paid';
  createdAt: string;
}

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payoutDate: string;
  bankAccount: string;
  referenceNumber?: string;
  createdAt: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerId: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  sellerReply?: string;
  sellerReplyDate?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

// Offer & Discount Types
export type DiscountType = 'percentage' | 'flat';

export interface Offer {
  id: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  productIds?: string[];
  categoryIds?: string[];
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

// Analytics Types
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
  views: number;
  conversionRate: number;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  returnedOrders: number;
  walletBalance: number;
  salesGrowth: number;
  ordersGrowth: number;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}
