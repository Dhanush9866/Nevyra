import React, { useState } from 'react';
import { Search, Users, Mail, Phone, ShoppingBag } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockCustomers } from '@/services/mockData';
import { Customer } from '@/types';
import { format } from 'date-fns';

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-description">
          View customer information and order history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/10">
            <ShoppingBag className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <ShoppingBag className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(avgOrderValue)}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description="Customers will appear here once they place orders."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Last Order</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{customer.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="font-medium text-foreground">
                      {customer.totalOrders}
                    </td>
                    <td className="font-medium text-success">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="text-muted-foreground">
                      {customer.lastOrderDate 
                        ? format(new Date(customer.lastOrderDate), 'MMM d, yyyy')
                        : '-'
                      }
                    </td>
                    <td className="text-muted-foreground">
                      {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
