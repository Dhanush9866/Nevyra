import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  DollarSign, 
  CreditCard,
  Users,
  Star,
  Tags,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Products', href: '/products', icon: Package },
  { title: 'Orders', href: '/orders', icon: ShoppingCart },
  { title: 'Inventory', href: '/inventory', icon: Warehouse },
  { title: 'Earnings', href: '/earnings', icon: DollarSign },
  { title: 'Payouts', href: '/payouts', icon: CreditCard },
  { title: 'Customers', href: '/customers', icon: Users },
  { title: 'Reviews', href: '/reviews', icon: Star },
  { title: 'Offers', href: '/offers', icon: Tags },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const bottomNavItems = [
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Help & Support', href: '/support', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { seller, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo & Store Info */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Store className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0 animate-fade-in">
            <h2 className="text-sm font-semibold text-sidebar-foreground truncate">
              {seller?.storeName || 'Seller Dashboard'}
            </h2>
            <p className="text-xs text-sidebar-muted truncate">{seller?.email}</p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "sidebar-item",
                  isActive(item.href) && "sidebar-item-active"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate animate-fade-in">{item.title}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "sidebar-item",
                  isActive(item.href) && "sidebar-item-active"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate animate-fade-in">{item.title}</span>
                )}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className="sidebar-item w-full text-left text-destructive/80 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="truncate animate-fade-in">Logout</span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
