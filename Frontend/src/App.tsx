import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompanyPurchases from "./components/company/CompanyPurchases";

// Pages
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import Marketplace from "./pages/Marketplace";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerUpload from "./pages/farmer/FarmerUpload";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import CompanyImpactReport from "./components/company/CompanyImpactReport";
import CompanySettings from "./components/company/CompanySettings";
import CompanyMarketplace from "./components/company/CompanyMarketplace";
import CompanyCheckout from "./components/company/CompanyCheckout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Farmer Dashboard Routes */}
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/upload" element={<FarmerUpload />} />
          <Route path="/farmer/credits" element={<FarmerDashboard />} />
          <Route path="/farmer/wallet" element={<FarmerDashboard />} />
          <Route path="/farmer/documents" element={<FarmerDashboard />} />
          <Route path="/farmer/settings" element={<FarmerDashboard />} />
          
          {/* Company Dashboard Routes */}
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/marketplace" element={<CompanyMarketplace />} />
          <Route path="/company/purchases" element={<CompanyPurchases />} />
          <Route path="/company/impact" element={<CompanyImpactReport />} />
          <Route path="/company/settings" element={<CompanySettings />} />
          <Route path="/company/checkout/:listingId" element={<CompanyCheckout />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verification" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
