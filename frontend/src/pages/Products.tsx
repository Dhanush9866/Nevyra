import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductSidebar } from "@/components/ProductSidebar";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";

// Mock product data - 10 products per category
const mockProducts = [
  // Medical & Pharmacy Products
  {
    id: 1,
    title: "Organic Face Serum",
    price: 45,
    originalPrice: 59,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "medical",
    subcategory: "skincare",
    inStock: true,
    isNew: true,
    popularity: 92
  },
  {
    id: 2,
    title: "Vitamin C Tablets",
    price: 25,
    rating: 4.5,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "medical",
    subcategory: "supplements",
    inStock: true,
    isNew: false,
    popularity: 88
  },
  {
    id: 3,
    title: "Hair Growth Shampoo",
    price: 32,
    originalPrice: 42,
    rating: 4.3,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "medical",
    subcategory: "haircare",
    inStock: true,
    isNew: false,
    popularity: 76
  },
  {
    id: 4,
    title: "Anti-Aging Cream",
    price: 65,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "medical",
    subcategory: "skincare",
    inStock: true,
    isNew: true,
    popularity: 95
  },
  {
    id: 5,
    title: "Multivitamin Pack",
    price: 38,
    rating: 4.4,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "medical",
    subcategory: "supplements",
    inStock: false,
    isNew: false,
    popularity: 82
  },
  {
    id: 6,
    title: "Moisturizing Lotion",
    price: 28,
    originalPrice: 35,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "medical",
    subcategory: "skincare",
    inStock: true,
    isNew: false,
    popularity: 71
  },
  {
    id: 7,
    title: "Protein Powder",
    price: 55,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "medical",
    subcategory: "supplements",
    inStock: true,
    isNew: true,
    popularity: 89
  },
  {
    id: 8,
    title: "Sunscreen SPF 50",
    price: 22,
    rating: 4.5,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "medical",
    subcategory: "skincare",
    inStock: true,
    isNew: false,
    popularity: 85
  },
  {
    id: 9,
    title: "Eye Drops",
    price: 15,
    rating: 4.2,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "medical",
    subcategory: "healthcare",
    inStock: true,
    isNew: false,
    popularity: 65
  },
  {
    id: 10,
    title: "Pain Relief Gel",
    price: 18,
    originalPrice: 24,
    rating: 4.4,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "medical",
    subcategory: "healthcare",
    inStock: true,
    isNew: false,
    popularity: 73
  },

  // Groceries Products
  {
    id: 11,
    title: "Organic Honey",
    price: 18,
    rating: 4.8,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "groceries",
    subcategory: "organic",
    inStock: true,
    isNew: false,
    popularity: 89
  },
  {
    id: 12,
    title: "Olive Oil Extra Virgin",
    price: 24,
    originalPrice: 32,
    rating: 4.6,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "groceries",
    subcategory: "cooking",
    inStock: true,
    isNew: true,
    popularity: 86
  },
  {
    id: 13,
    title: "Brown Rice 5kg",
    price: 35,
    rating: 4.4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "groceries",
    subcategory: "grains",
    inStock: true,
    isNew: false,
    popularity: 78
  },
  {
    id: 14,
    title: "Fresh Apples 1kg",
    price: 12,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "groceries",
    subcategory: "fruits",
    inStock: true,
    isNew: false,
    popularity: 92
  },
  {
    id: 15,
    title: "Whole Wheat Bread",
    price: 8,
    originalPrice: 10,
    rating: 4.3,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "groceries",
    subcategory: "bakery",
    inStock: false,
    isNew: false,
    popularity: 71
  },
  {
    id: 16,
    title: "Greek Yogurt",
    price: 15,
    rating: 4.5,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "groceries",
    subcategory: "dairy",
    inStock: true,
    isNew: true,
    popularity: 83
  },
  {
    id: 17,
    title: "Green Tea Bags",
    price: 22,
    rating: 4.6,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "groceries",
    subcategory: "beverages",
    inStock: true,
    isNew: false,
    popularity: 87
  },
  {
    id: 18,
    title: "Quinoa 2kg",
    price: 45,
    originalPrice: 55,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "groceries",
    subcategory: "grains",
    inStock: true,
    isNew: true,
    popularity: 74
  },
  {
    id: 19,
    title: "Almond Milk",
    price: 18,
    rating: 4.4,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "groceries",
    subcategory: "dairy",
    inStock: true,
    isNew: false,
    popularity: 69
  },
  {
    id: 20,
    title: "Mixed Nuts 500g",
    price: 28,
    rating: 4.8,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "groceries",
    subcategory: "snacks",
    inStock: true,
    isNew: false,
    popularity: 91
  },

  // Fashion & Beauty Products
  {
    id: 21,
    title: "Men's Casual Shirt",
    price: 79,
    originalPrice: 99,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "fashion",
    subcategory: "menswear",
    inStock: true,
    isNew: false,
    popularity: 71
  },
  {
    id: 22,
    title: "Women's Summer Dress",
    price: 89,
    rating: 4.7,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "fashion",
    subcategory: "womenswear",
    inStock: true,
    isNew: true,
    popularity: 88
  },
  {
    id: 23,
    title: "Kids Cotton T-Shirt",
    price: 25,
    originalPrice: 35,
    rating: 4.4,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "fashion",
    subcategory: "kidswear",
    inStock: true,
    isNew: false,
    popularity: 76
  },
  {
    id: 24,
    title: "Running Shoes",
    price: 125,
    rating: 4.8,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "fashion",
    subcategory: "shoes",
    inStock: true,
    isNew: true,
    popularity: 95
  },
  {
    id: 25,
    title: "Leather Handbag",
    price: 156,
    originalPrice: 199,
    rating: 4.6,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "fashion",
    subcategory: "accessories",
    inStock: false,
    isNew: false,
    popularity: 82
  },
  {
    id: 26,
    title: "Sunglasses",
    price: 45,
    rating: 4.3,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "fashion",
    subcategory: "accessories",
    inStock: true,
    isNew: false,
    popularity: 67
  },
  {
    id: 27,
    title: "Denim Jeans",
    price: 95,
    rating: 4.5,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "fashion",
    subcategory: "menswear",
    inStock: true,
    isNew: true,
    popularity: 79
  },
  {
    id: 28,
    title: "Silk Scarf",
    price: 38,
    originalPrice: 48,
    rating: 4.7,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "fashion",
    subcategory: "accessories",
    inStock: true,
    isNew: false,
    popularity: 73
  },
  {
    id: 29,
    title: "Sports Bra",
    price: 32,
    rating: 4.4,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "fashion",
    subcategory: "womenswear",
    inStock: true,
    isNew: false,
    popularity: 68
  },
  {
    id: 30,
    title: "Formal Blazer",
    price: 189,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "fashion",
    subcategory: "menswear",
    inStock: true,
    isNew: true,
    popularity: 84
  },

  // Devices Products
  {
    id: 31,
    title: "Premium Wireless Headphones",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "devices",
    subcategory: "phones",
    inStock: true,
    isNew: false,
    popularity: 95
  },
  {
    id: 32,
    title: "Smart Fitness Watch",
    price: 249,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "devices",
    subcategory: "wearables",
    inStock: true,
    isNew: true,
    popularity: 88
  },
  {
    id: 33,
    title: "Gaming Laptop",
    price: 1299,
    originalPrice: 1499,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "devices",
    subcategory: "laptops",
    inStock: true,
    isNew: true,
    popularity: 92
  },
  {
    id: 34,
    title: "4K Smart TV 55\"",
    price: 899,
    rating: 4.5,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "devices",
    subcategory: "tvs",
    inStock: false,
    isNew: false,
    popularity: 86
  },
  {
    id: 35,
    title: "Wireless Charging Pad",
    price: 59,
    originalPrice: 79,
    rating: 4.4,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "devices",
    subcategory: "accessories",
    inStock: true,
    isNew: false,
    popularity: 76
  },
  {
    id: 36,
    title: "Bluetooth Speaker",
    price: 89,
    rating: 4.6,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "devices",
    subcategory: "audio",
    inStock: true,
    isNew: true,
    popularity: 83
  },
  {
    id: 37,
    title: "Tablet 10.5\"",
    price: 549,
    originalPrice: 649,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "devices",
    subcategory: "tablets",
    inStock: true,
    isNew: false,
    popularity: 79
  },
  {
    id: 38,
    title: "Drone Camera",
    price: 799,
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "devices",
    subcategory: "cameras",
    inStock: true,
    isNew: true,
    popularity: 91
  },
  {
    id: 39,
    title: "Power Bank 20000mAh",
    price: 45,
    rating: 4.3,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "devices",
    subcategory: "accessories",
    inStock: true,
    isNew: false,
    popularity: 72
  },
  {
    id: 40,
    title: "Smart Home Hub",
    price: 129,
    originalPrice: 159,
    rating: 4.5,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "devices",
    subcategory: "smart",
    inStock: true,
    isNew: false,
    popularity: 74
  },

  // Electrical Products
  {
    id: 41,
    title: "LED Table Lamp",
    price: 45,
    rating: 4.3,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "electrical",
    subcategory: "lighting",
    inStock: false,
    isNew: false,
    popularity: 65
  },
  {
    id: 42,
    title: "Solar Panel 300W",
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "electrical",
    subcategory: "solar",
    inStock: true,
    isNew: true,
    popularity: 87
  },
  {
    id: 43,
    title: "Ceiling Fan 52\"",
    price: 189,
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "electrical",
    subcategory: "fans",
    inStock: true,
    isNew: false,
    popularity: 79
  },
  {
    id: 44,
    title: "Smart Light Switch",
    price: 35,
    originalPrice: 45,
    rating: 4.4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "electrical",
    subcategory: "switches",
    inStock: true,
    isNew: true,
    popularity: 73
  },
  {
    id: 45,
    title: "Copper Wire 100m",
    price: 89,
    rating: 4.2,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "electrical",
    subcategory: "wiring",
    inStock: true,
    isNew: false,
    popularity: 58
  },
  {
    id: 46,
    title: "LED Strip Lights 5m",
    price: 28,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "electrical",
    subcategory: "lighting",
    inStock: true,
    isNew: true,
    popularity: 89
  },
  {
    id: 47,
    title: "Circuit Breaker 20A",
    price: 22,
    originalPrice: 28,
    rating: 4.3,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "electrical",
    subcategory: "safety",
    inStock: true,
    isNew: false,
    popularity: 61
  },
  {
    id: 48,
    title: "Extension Cord 10m",
    price: 35,
    rating: 4.4,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "electrical",
    subcategory: "accessories",
    inStock: false,
    isNew: false,
    popularity: 69
  },
  {
    id: 49,
    title: "Inverter 2000W",
    price: 345,
    originalPrice: 425,
    rating: 4.6,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "electrical",
    subcategory: "power",
    inStock: true,
    isNew: true,
    popularity: 82
  },
  {
    id: 50,
    title: "Motion Sensor Light",
    price: 55,
    rating: 4.5,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "electrical",
    subcategory: "lighting",
    inStock: true,
    isNew: false,
    popularity: 76
  },

  // Automotive Products
  {
    id: 51,
    title: "Car Engine Oil",
    price: 25,
    rating: 4.2,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "automotive",
    subcategory: "maintenance",
    inStock: true,
    isNew: false,
    popularity: 58
  },
  {
    id: 52,
    title: "Motorcycle Helmet",
    price: 89,
    originalPrice: 119,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "automotive",
    subcategory: "bike",
    inStock: true,
    isNew: true,
    popularity: 84
  },
  {
    id: 53,
    title: "Car Dashboard Camera",
    price: 129,
    rating: 4.5,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "automotive",
    subcategory: "car",
    inStock: true,
    isNew: true,
    popularity: 77
  },
  {
    id: 54,
    title: "Bike Chain Lubricant",
    price: 15,
    originalPrice: 20,
    rating: 4.3,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "automotive",
    subcategory: "maintenance",
    inStock: true,
    isNew: false,
    popularity: 63
  },
  {
    id: 55,
    title: "Car Seat Covers",
    price: 65,
    rating: 4.4,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "automotive",
    subcategory: "car",
    inStock: false,
    isNew: false,
    popularity: 71
  },
  {
    id: 56,
    title: "Bike Lock Heavy Duty",
    price: 45,
    originalPrice: 59,
    rating: 4.6,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "automotive",
    subcategory: "bike",
    inStock: true,
    isNew: false,
    popularity: 79
  },
  {
    id: 57,
    title: "Car Air Freshener",
    price: 8,
    rating: 4.1,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "automotive",
    subcategory: "car",
    inStock: true,
    isNew: false,
    popularity: 52
  },
  {
    id: 58,
    title: "Brake Pads Set",
    price: 85,
    rating: 4.5,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "automotive",
    subcategory: "maintenance",
    inStock: true,
    isNew: true,
    popularity: 73
  },
  {
    id: 59,
    title: "Car Phone Mount",
    price: 22,
    originalPrice: 32,
    rating: 4.4,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "automotive",
    subcategory: "car",
    inStock: true,
    isNew: false,
    popularity: 68
  },
  {
    id: 60,
    title: "Motorcycle Gloves",
    price: 35,
    rating: 4.3,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "automotive",
    subcategory: "bike",
    inStock: true,
    isNew: false,
    popularity: 65
  },

  // Sports Products
  {
    id: 61,
    title: "Cricket Bat",
    price: 129,
    originalPrice: 159,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "sports",
    subcategory: "cricket",
    inStock: true,
    isNew: false,
    popularity: 82
  },
  {
    id: 62,
    title: "Volleyball Official Size",
    price: 45,
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "sports",
    subcategory: "volleyball",
    inStock: true,
    isNew: true,
    popularity: 76
  },
  {
    id: 63,
    title: "Cricket Ball Leather",
    price: 25,
    originalPrice: 35,
    rating: 4.4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "sports",
    subcategory: "cricket",
    inStock: true,
    isNew: false,
    popularity: 69
  },
  {
    id: 64,
    title: "Volleyball Net",
    price: 55,
    rating: 4.3,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "sports",
    subcategory: "volleyball",
    inStock: false,
    isNew: false,
    popularity: 63
  },
  {
    id: 65,
    title: "Cricket Helmet",
    price: 85,
    originalPrice: 105,
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "sports",
    subcategory: "cricket",
    inStock: true,
    isNew: true,
    popularity: 84
  },
  {
    id: 66,
    title: "Knee Pads Sports",
    price: 32,
    rating: 4.4,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "sports",
    subcategory: "volleyball",
    inStock: true,
    isNew: false,
    popularity: 71
  },
  {
    id: 67,
    title: "Cricket Gloves",
    price: 48,
    originalPrice: 62,
    rating: 4.5,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "sports",
    subcategory: "cricket",
    inStock: true,
    isNew: false,
    popularity: 73
  },
  {
    id: 68,
    title: "Sports Water Bottle",
    price: 18,
    rating: 4.2,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "sports",
    subcategory: "accessories",
    inStock: true,
    isNew: false,
    popularity: 58
  },
  {
    id: 69,
    title: "Athletic Shorts",
    price: 35,
    rating: 4.6,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "sports",
    subcategory: "apparel",
    inStock: true,
    isNew: true,
    popularity: 79
  },
  {
    id: 70,
    title: "Sports Equipment Bag",
    price: 65,
    originalPrice: 85,
    rating: 4.4,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "sports",
    subcategory: "accessories",
    inStock: true,
    isNew: false,
    popularity: 67
  },

  // Home Interior Products
  {
    id: 71,
    title: "Ceramic Floor Tiles",
    price: 89,
    rating: 4.4,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "interior",
    subcategory: "tiles",
    inStock: true,
    isNew: true,
    popularity: 74
  },
  {
    id: 72,
    title: "Wooden Door Solid",
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "interior",
    subcategory: "doors",
    inStock: true,
    isNew: false,
    popularity: 82
  },
  {
    id: 73,
    title: "Wall Paint 4L White",
    price: 45,
    rating: 4.3,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "interior",
    subcategory: "paint",
    inStock: true,
    isNew: false,
    popularity: 68
  },
  {
    id: 74,
    title: "Blackout Curtains",
    price: 65,
    originalPrice: 85,
    rating: 4.7,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    category: "interior",
    subcategory: "curtains",
    inStock: false,
    isNew: true,
    popularity: 87
  },
  {
    id: 75,
    title: "False Ceiling Panel",
    price: 125,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    category: "interior",
    subcategory: "ceiling",
    inStock: true,
    isNew: false,
    popularity: 75
  },
  {
    id: 76,
    title: "Marble Floor Tiles",
    price: 189,
    originalPrice: 239,
    rating: 4.8,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    category: "interior",
    subcategory: "tiles",
    inStock: true,
    isNew: true,
    popularity: 91
  },
  {
    id: 77,
    title: "Interior Paint Brush Set",
    price: 28,
    rating: 4.2,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
    category: "interior",
    subcategory: "paint",
    inStock: true,
    isNew: false,
    popularity: 59
  },
  {
    id: 78,
    title: "Window Blinds",
    price: 89,
    originalPrice: 119,
    rating: 4.4,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
    category: "interior",
    subcategory: "curtains",
    inStock: true,
    isNew: false,
    popularity: 71
  },
  {
    id: 79,
    title: "Decorative Wall Tiles",
    price: 156,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    category: "interior",
    subcategory: "tiles",
    inStock: true,
    isNew: true,
    popularity: 83
  },
  {
    id: 80,
    title: "Room Divider Screen",
    price: 199,
    originalPrice: 249,
    rating: 4.5,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    category: "interior",
    subcategory: "decor",
    inStock: true,
    isNew: false,
    popularity: 77
  }
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const itemsPerPage = 12;

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    filtered = filtered.filter(product => product.rating >= minRating);

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, sortBy, priceRange, minRating, showInStockOnly, products]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
    setSearchParams(params);
  }, [selectedCategory, selectedSubcategory, setSearchParams]);

  const handleCategoryChange = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory || '');
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse Products</h1>
            <Breadcrumb 
              category={selectedCategory} 
              subcategory={selectedSubcategory} 
            />
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        <ProductFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          showInStockOnly={showInStockOnly}
          setShowInStockOnly={setShowInStockOnly}
          resultsCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <ProductSidebar
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategoryChange={handleCategoryChange}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Product Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard 
                    product={product} 
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('');
                  setPriceRange([0, 500]);
                  setMinRating(0);
                  setShowInStockOnly(false);
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}