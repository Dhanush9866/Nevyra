import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/FloatingDock";
import { Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AddProductForm from "@/components/AddProductForm";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  subCategory: string;
  stockQuantity: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  soldCount: number;
  images: string[];
  additionalSpecifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const getProductStatus = (product: Product) => {
  if (!product.inStock || product.stockQuantity === 0) {
    return "Out of Stock";
  } else if (product.stockQuantity <= 10) {
    return "Low Stock";
  } else {
    return "Active";
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-700";
    case "Out of Stock":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [token, setToken] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      loadProducts(storedToken);
    } else {
      toast({
        title: "Authentication Required",
        description: "Please login to access products",
        variant: "destructive",
      });
    }
  }, []);

  const loadProducts = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await adminAPI.products.getAll(authToken);
      if (response.success) {
        setProducts(response.data);
      } else {
        throw new Error(response.message || 'Failed to load products');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = () => {
    if (token) {
      loadProducts(token);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await adminAPI.products.delete(productId, token);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        loadProducts(token);
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <FloatingDock />
        <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FloatingDock />
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Products</h1>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
          
          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          No products found. Add your first product to get started.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const status = getProductStatus(product);
                        return (
                          <tr key={product.id} className="hover:bg-muted/50 transition-smooth">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                              {product.id.slice(-8)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                              {product.title}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                              {product.category}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                              ₹{product.price.toLocaleString()}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                              {product.stockQuantity}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColor(status)}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onProductAdded={handleProductAdded}
          token={token}
        />
      )}
    </>
  );
};

export default Products; 