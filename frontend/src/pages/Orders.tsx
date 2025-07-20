import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function Orders() {
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1308,
      items: [
        { name: "Premium Wireless Headphones", quantity: 1, price: 299 },
        { name: "Smart Watch Pro", quantity: 2, price: 449 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      status: "shipped",
      total: 159,
      items: [
        { name: "Wireless Charging Pad", quantity: 1, price: 59 },
        { name: "Phone Case Pro", quantity: 2, price: 50 }
      ]
    },
    {
      id: "ORD-003",
      date: "2024-01-22",
      status: "processing",
      total: 899,
      items: [
        { name: "Laptop Stand", quantity: 1, price: 129 },
        { name: "4K Monitor", quantity: 1, price: 770 }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-accent" />;
      case "processing":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: "default",
      shipped: "secondary", 
      processing: "outline"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="page-transition">
      <PageHeader 
        title="Order History" 
        subtitle="Track your purchases and order status"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-lg font-semibold mt-1">₹{order.total}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                  {order.status === "shipped" && (
                    <Button variant="outline" size="sm">
                      Track Package
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">No orders yet</h2>
              <p className="text-muted-foreground mb-8">
                When you place orders, they will appear here.
              </p>
              <Button className="btn-primary">
                Start Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}