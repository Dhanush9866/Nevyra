import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Warehouse, 
  Megaphone, 
  Settings,
  Plus,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const dockItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", color: "from-purple-500 to-pink-500" },
  { id: "products", icon: Package, label: "Products", color: "from-blue-500 to-cyan-500" },
  { id: "orders", icon: ShoppingBag, label: "Orders", color: "from-green-500 to-emerald-500" },
  { id: "customers", icon: Users, label: "Customers", color: "from-orange-500 to-red-500" },
  { id: "analytics", icon: BarChart3, label: "Analytics", color: "from-violet-500 to-purple-500" },
  { id: "inventory", icon: Warehouse, label: "Inventory", color: "from-cyan-500 to-blue-500" },
  { id: "marketing", icon: Megaphone, label: "Marketing", color: "from-pink-500 to-rose-500" },
  { id: "settings", icon: Settings, label: "Settings", color: "from-gray-500 to-slate-500" },
];

export function FloatingDock() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="glass rounded-2xl p-4 backdrop-blur-xl border-0">
        <div className="flex items-center gap-2">
          {/* Quick Add Button */}
          <Button
            variant="floating"
            size="icon"
            className="rounded-xl bg-gradient-primary hover:scale-110 transition-bounce mr-2"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Dock Items */}
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <div key={item.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveItem(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "relative rounded-xl transition-all duration-300 hover:scale-110",
                    isActive 
                      ? "bg-gradient-primary text-primary-foreground shadow-lg scale-110" 
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </Button>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap animate-scale-in">
                    {item.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-2 border-transparent border-t-black/80" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Actions Button */}
          <Button
            variant="floating"
            size="icon"
            className="rounded-xl bg-gradient-coral hover:scale-110 transition-bounce ml-2"
          >
            <Zap className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}