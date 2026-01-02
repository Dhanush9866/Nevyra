import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Package
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { sellerAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Product } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductDialog } from '@/components/ProductDialog';

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.products.list();
      if (response.data.success) {
        // Map backend product to frontend Product interface
        const mappedProducts: Product[] = response.data.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: '', 
          category: p.category,
          subCategory: p.subCategory,
          price: p.price,
          stockQuantity: p.stockQuantity,
          images: p.images || [],
          inStock: p.inStock,
          rating: p.rating,
          reviews: p.reviews,
          soldCount: p.soldCount,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          attributes: p.attributes,
          additionalSpecifications: p.additionalSpecifications
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        await sellerAPI.products.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
    }
  };

  const handleAddProduct = () => {
    setSelectedProductId(undefined);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (id: string) => {
    setSelectedProductId(id);
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (product.inStock ? 'active' : 'inactive') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Products</h1>
          <p className="page-description">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </button>
          <button onClick={handleAddProduct} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-8">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your search or filters, or add a new product to get started."
          action={
            <button onClick={handleAddProduct} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          }
        />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input type="checkbox" className="rounded border-input" />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <input type="checkbox" className="rounded border-input" />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images[0] || 'https://placehold.co/100'} 
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {product.id.substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground">
                      {product.category}
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className={product.stockQuantity === 0 ? 'text-destructive font-medium' : 
                        product.stockQuantity < 10 ? 'text-warning font-medium' : 'text-foreground'}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={product.inStock ? 'active' : 'inactive'} />
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2" onClick={() => handleEditProduct(product.id)}>
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleEditProduct(product.id)}>
                            <Edit className="w-4 h-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">1</span> to{' '}
              <span className="font-medium text-foreground">{filteredProducts.length}</span> of{' '}
              <span className="font-medium text-foreground">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <button className="btn-secondary" disabled>Previous</button>
              <button className="btn-secondary" disabled>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Dialog */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        productId={selectedProductId}
        onSuccess={fetchProducts}
      />
    </div>
  );
};

export default Products;
