import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { mockProducts } from '@/services/mockData';
import { Product } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [products] = useState<Product[]>(mockProducts);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
          <Link to="/products/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
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
            <option value="pending">Pending</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your search or filters, or add a new product to get started."
          action={
            <Link to="/products/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
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
                  <th>Approval</th>
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
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.sku}
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
                        {product.compareAtPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={product.stock === 0 ? 'text-destructive font-medium' : 
                        product.stock < 10 ? 'text-warning font-medium' : 'text-foreground'}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={product.status} />
                    </td>
                    <td>
                      <StatusBadge status={product.approvalStatus} />
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
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
    </div>
  );
};

export default Products;
