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
import FarmerMarketplace from "./pages/farmer/FarmerMarketPlace";
import FarmerSettings from "./pages/farmer/FarmerSettings";
import FarmerUpload from "./pages/farmer/FarmerUpload";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVerification from "./pages/admin/AdminVerification";
import AdminVerificationDetails from "./pages/admin/AdminVerificationDetails";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPayouts from "./pages/admin/AdminPayouts";
import NotFound from "./pages/NotFound";
import CompanyImpactReport from "./components/company/CompanyImpactReport";
import CompanySettings from "./components/company/CompanySettings";
import CompanyMarketplace from "./components/company/CompanyMarketplace";
import CompanyCheckout from "./components/company/CompanyCheckout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminFarmlands from "./pages/admin/AdminFarmlands";
import AdminFarmlandDetails from "./pages/admin/AdminFarmlandDetails";
import OrderSuccess from "./components/company/OrderSuccess";
import CompanyDocuments from "./components/company/CompanyDocument";

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

          {/* Farmer Dashboard Routes - Protected */}
          <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/marketplace" element={<FarmerMarketplace />} />
            <Route path="/farmer/upload" element={<FarmerUpload />} />
            <Route path="/farmer/credits" element={<FarmerDashboard />} />
            <Route path="/farmer/wallet" element={<FarmerDashboard />} />
            <Route path="/farmer/documents" element={<FarmerDashboard />} />
            <Route path="/farmer/settings" element={<FarmerSettings />} />
          </Route>

          {/* Company Dashboard Routes - Protected */}
          <Route element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/marketplace" element={<CompanyMarketplace />} />
            <Route path="/company/purchases" element={<CompanyPurchases />} />
            <Route path="/company/impact" element={<CompanyImpactReport />} />
            <Route path="/company/settings" element={<CompanySettings />} />
            <Route path="/company/checkout/:listingId" element={<CompanyCheckout />} />
            <Route path="/company/order-success" element={<OrderSuccess />} />
            <Route path="/company/documents" element={<CompanyDocuments />} />
          </Route>

          {/* Admin Dashboard Routes - Protected */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/verification" element={<AdminVerification />} />
            <Route path="/admin/verification/:type/:id" element={<AdminVerificationDetails />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
            <Route path="/admin/farmlands" element={<AdminFarmlands />} />
            <Route path="/admin/farmlands/:id" element={<AdminFarmlandDetails />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/payouts" element={<AdminPayouts />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
            <Route path="/admin/api-features" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
