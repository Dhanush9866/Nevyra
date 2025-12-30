import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils';

export const SellerLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Sidebar - Mobile */}
      <div 
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-40 transform transition-transform duration-300",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar isCollapsed={false} onToggle={toggleMobileSidebar} />
      </div>

      {/* Main Content */}
      <div 
        className={cn(
          "transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <Navbar onMenuClick={toggleMobileSidebar} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
