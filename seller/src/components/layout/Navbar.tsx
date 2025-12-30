import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { seller } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-80">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground bg-background rounded border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{seller?.name}</p>
            <p className="text-xs text-muted-foreground">Seller</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {seller?.name?.charAt(0).toUpperCase() || 'S'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
