import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { sellerAPI } from '@/lib/api';
import { Product } from '@/types';
import { toast } from 'sonner';
import { EmptyState } from '@/components/ui/EmptyState';

const Inventory: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  
  // Update Stock State
  const [editingStock, setEditingStock] = useState<{ id: string, title: string, currentStock: string } | null>(null);
  const [newStockQuantity, setNewStockQuantity] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes] = await Promise.all([
        sellerAPI.inventory.stats(),
        sellerAPI.products.list()
      ]);
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (productsRes.data.success) {
        setProducts(productsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
     if (!editingStock) return;
     
     const qty = parseInt(newStockQuantity);
     if (isNaN(qty) || qty < 0) {
        toast.error("Please enter a valid stock quantity");
        return;
     }

     setUpdating(true);
     try {
        await sellerAPI.products.update(editingStock.id, { 
            stockQuantity: qty,
            inStock: qty > 0 
        });
        toast.success("Stock updated successfully");
        setEditingStock(null);
        fetchData(); // Refresh stats and list
     } catch (error) {
        console.error("Update stock error", error);
        toast.error("Failed to update stock");
     } finally {
        setUpdating(false);
     }
  };

  const openUpdateDialog = (product: Product) => {
     setEditingStock({ 
        id: product.id, 
        title: product.title, 
        currentStock: String(product.stockQuantity) 
     });
     setNewStockQuantity(String(product.stockQuantity));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = stockFilter === 'all' 
      ? true 
      : stockFilter === 'in_stock' 
        ? product.inStock && product.stockQuantity > 0
        : stockFilter === 'out_of_stock'
          ? !product.inStock || product.stockQuantity === 0
          : stockFilter === 'low_stock'
            ? product.stockQuantity > 0 && product.stockQuantity <= (product.lowStockThreshold || 5)
            : true;
            
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (val: number) => 
     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6 animate-fade-in p-6">
       <div className="page-header mb-0">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-description">Track stock levels and manage product inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">Total Products</p>
                 <h3 className="text-3xl font-bold text-foreground">{stats.totalProducts}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                 <Package className="w-6 h-6 text-primary" />
              </div>
           </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">In Stock</p>
                 <h3 className="text-3xl font-bold text-foreground">{stats.inStock}</h3>
                 <p className="text-xs text-muted-foreground mt-1">{stats.lowStock} Low Stock</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                 <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
           </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">Out of Stock</p>
                 <h3 className="text-3xl font-bold text-foreground">{stats.outOfStock}</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                 <XCircle className="w-6 h-6 text-red-500" />
              </div>
           </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Items</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-muted-foreground">Loading inventory...</div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                   <th className="w-16">Image</th>
                   <th>Product Name</th>
                   <th>Category</th>
                   <th>Price</th>
                   <th>Stock</th>
                   <th>Status</th>
                   <th className="w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                   const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= (product.lowStockThreshold || 5);
                   const isOutOfStock = product.stockQuantity === 0;

                   return (
                  <tr key={product.id}>
                    <td>
                       <img 
                         src={product.images[0] || 'https://placehold.co/50'} 
                         alt="" 
                         className="w-10 h-10 rounded-md object-cover border border-border" 
                       />
                    </td>
                    <td className="font-medium text-foreground">{product.title}</td>
                    <td className="text-muted-foreground">{product.category}</td>
                    <td className="font-medium">{formatCurrency(product.price)}</td>
                    <td>
                       <div className="flex items-center gap-2">
                         <span className="font-mono">{product.stockQuantity}</span>
                         {isLowStock && <span className="text-xs text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">Low</span>}
                       </div>
                    </td>
                    <td>
                       {isOutOfStock ? (
                          <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                             <XCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                       ) : (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                             <CheckCircle className="w-3.5 h-3.5" /> In Stock
                          </span>
                       )}
                    </td>
                    <td className="text-right">
                       <button 
                         className="btn-secondary text-xs py-1 px-3"
                         onClick={() => openUpdateDialog(product)}
                       >
                          Update
                       </button>
                    </td>
                  </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Update Dialog */}
      {editingStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
           <div className="bg-background rounded-lg shadow-lg w-full max-w-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold">Update Stock</h3>
              <p className="text-sm text-muted-foreground">Adjust stock quantity for <b>{editingStock.title}</b></p>
              
              <div className="space-y-2">
                 <label className="text-sm font-medium">Quantity</label>
                 <input 
                    type="number"
                    className="input-field"
                    value={newStockQuantity}
                    onChange={(e) => setNewStockQuantity(e.target.value)}
                    min="0"
                 />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                 <button 
                    className="btn-secondary"
                    onClick={() => setEditingStock(null)}
                 >
                    Cancel
                 </button>
                 <button 
                    className="btn-primary"
                    onClick={handleUpdateStock}
                    disabled={updating}
                 >
                    {updating ? 'Saving...' : 'Save Changes'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
