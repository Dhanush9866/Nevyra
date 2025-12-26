# Carousel Categories Update Summary

## ✅ ALL 4 CAROUSEL ROWS NOW HAVE COMBINED CATEGORY TITLES

Each `HomeProductCarousel` row now combines 2 categories with a merged title, ready for API integration.

---

## Carousel Row Configuration

### **Row 2 Carousel**
- **Title**: "Home Interior & Electrical Deals"
- **Categories**: Home Interior + Electrical
- **Variable**: `row2Title`
- **Products**: `row2Products` (currently mock data)
- **TODO**: Fetch products from both categories via API

### **Row 4 Carousel**
- **Title**: "Devices & Automotive Deals"
- **Categories**: Devices + Automotive
- **Variable**: `row4Title`
- **Products**: `row4Products` (currently mock data)
- **TODO**: Fetch products from both categories via API

### **Row 6 Carousel**
- **Title**: "Fashion, Beauty & Personal Care Deals"
- **Categories**: Fashion & Beauty + Medical & Pharmacy
- **Variable**: `row6Title`
- **Products**: `row6Products` (currently mock data)
- **TODO**: Fetch products from both categories via API

### **Row 8 Carousel**
- **Title**: "Groceries & Sports Essentials"
- **Categories**: Groceries + Sports
- **Variable**: `row8Title`
- **Products**: `row8Products` (currently mock data)
- **TODO**: Fetch products from both categories via API

---

## Implementation in Index.tsx

```tsx
// Row 2
const row2Title = "Home Interior & Electrical Deals";
<HomeProductCarousel title={row2Title} products={row2Products} />

// Row 4
const row4Title = "Devices & Automotive Deals";
<HomeProductCarousel title={row4Title} products={row4Products} />

// Row 6
const row6Title = "Fashion, Beauty & Personal Care Deals";
<HomeProductCarousel title={row6Title} products={row6Products} />

// Row 8
const row8Title = "Groceries & Sports Essentials";
<HomeProductCarousel title={row8Title} products={row8Products} />
```

---

## Next Steps: API Integration

To fetch real products from the database for each carousel:

```tsx
// Example for Row 2
useEffect(() => {
  const fetchRow2Products = async () => {
    const [homeInteriorProducts, electricalProducts] = await Promise.all([
      apiService.getProducts({ category: "Home Interior", limit: 6 }),
      apiService.getProducts({ category: "Electrical", limit: 6 })
    ]);
    
    const combined = [
      ...homeInteriorProducts.data,
      ...electricalProducts.data
    ];
    
    setRow2Products(combined);
  };
  
  fetchRow2Products();
}, []);
```

Apply similar logic for all 4 carousel rows to fetch products from their respective category pairs.

---

## Category Combinations Rationale

1. **Home Interior & Electrical** - Complementary home improvement categories
2. **Devices & Automotive** - Tech and vehicle accessories
3. **Fashion, Beauty & Personal Care** - Complete style and grooming
4. **Groceries & Sports** - Daily essentials and fitness

---

Generated: 2025-12-26
Status: ✅ READY FOR API INTEGRATION
