import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import React from "react";
import RequireAuth from "./components/RequireAuth";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";

import Analytics from "./pages/Analytics";
import Sellers from "./pages/Sellers";
import Payouts from "./pages/Payouts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<RequireAuth><Products /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/sellers" element={<RequireAuth><Sellers /></RequireAuth>} />
          <Route path="/payouts" element={<RequireAuth><Payouts /></RequireAuth>} />
          <Route path="/customers" element={<RequireAuth><Customers /></RequireAuth>} />
          <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
