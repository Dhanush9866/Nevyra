import React, { useState } from 'react';
import { 
  Search, 
  AlertTriangle,
  Package,
  Edit,
  Warehouse
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockInventory } from '@/services/mockData';
import { InventoryItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const { toast } = useToast();

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = item.stock > 0 && item.stock <= item.lowStockThreshold;
    } else if (stockFilter === 'out') {
      matchesStock = item.stock === 0;
    } else if (stockFilter === 'in') {
      matchesStock = item.stock > item.lowStockThreshold;
    }
    
    return matchesSearch && matchesStock;
  });

  const handleUpdateStock = () => {
    if (selectedItem && newStock >= 0) {
      setInventory(prev => 
        prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, stock: newStock, lastUpdated: new Date().toISOString() }
            : item
        )
      );
      toast({
        title: 'Stock updated',
        description: `${selectedItem.productName} stock updated to ${newStock}`,
      });
      setSelectedItem(null);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock === 0) return 'Out of Stock';
    if (item.stock <= item.lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStockVariant = (item: InventoryItem): 'success' | 'warning' | 'destructive' => {
    if (item.stock === 0) return 'destructive';
    if (item.stock <= item.lowStockThreshold) return 'warning';
    return 'success';
  };

  const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold).length;
  const outOfStockCount = inventory.filter(i => i.stock === 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
        <p className="page-description">
          Monitor stock levels and manage inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/10">
            <Package className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold text-foreground">{inventory.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-warning/10">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-bold text-warning">{lowStockCount}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-destructive/10">
            <Warehouse className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
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
          <option value="all">All Stock Levels</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <EmptyState
          icon={Warehouse}
          title="No inventory items found"
          description="Add products to start tracking your inventory."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th className="w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium text-foreground line-clamp-1">
                          {item.productName}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted-foreground font-mono text-sm">
                      {item.sku}
                    </td>
                    <td>
                      <span className={`font-bold ${
                        item.stock === 0 ? 'text-destructive' : 
                        item.stock <= item.lowStockThreshold ? 'text-warning' : 
                        'text-foreground'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {item.lowStockThreshold}
                    </td>
                    <td>
                      <StatusBadge 
                        status={getStockStatus(item)} 
                        variant={getStockVariant(item)}
                      />
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          setSelectedItem(item);
                          setNewStock(item.stock);
                        }}
                        className="btn-secondary text-sm py-1.5 px-3"
                      >
                        <Edit className="w-3 h-3" />
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <img 
                  src={selectedItem.productImage} 
                  alt={selectedItem.productName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{selectedItem.productName}</p>
                  <p className="text-sm text-muted-foreground">SKU: {selectedItem.sku}</p>
                  <p className="text-sm text-muted-foreground">Current Stock: {selectedItem.stock}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStock}
                  className="btn-primary"
                >
                  Update Stock
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
