export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  brand: string;
  specifications?: { [key: string]: string };
  features?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: string[];
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet';
  name: string;
  icon: string;
  details?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'general';
  isRead: boolean;
  createdAt: string;
  image?: string;
}

export interface FilterOptions {
  priceRange?: [number, number];
  brands?: string[];
  rating?: number;
  discount?: number;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
}
