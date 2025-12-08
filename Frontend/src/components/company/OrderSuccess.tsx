import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { authService } from "@/services/authService";
import { paymentService } from "@/services/paymentService";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  ArrowLeft,
  Leaf,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

interface CarbonListing {
  _id: string;
  totalCredits: number;
  pricePerCredit: number;
  totalValue: number;
  description: string;
  status: string;
  farmlandId: {
    landName: string;
    location: string;
    area: number;
  };
  farmerId: {
    name: string;
    email: string;
  };
}

interface OrderSuccessProps {
  listing: CarbonListing;
  paymentDetails: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
  };
}

const OrderSuccess = (listing, paymentDetails) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/company/purchases')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Purchases
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Successful! 🎉
          </h1>
          <p className="text-muted-foreground">
            Your carbon credit purchase has been completed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {listing.farmlandId.landName}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.farmlandId.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Valid for 1 year from purchase</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="font-medium">{listing.farmerId.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Land Area</span>
                    <span className="font-medium">{listing.farmlandId.area} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbon Credits</span>
                    <span className="font-medium">{listing.totalCredits} tons CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per Credit</span>
                    <span className="font-medium">₹{listing.pricePerCredit.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {listing.description && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Description</p>
                      <p className="text-sm text-muted-foreground">{listing.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-medium">{paymentDetails.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-medium">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    ₹{paymentDetails.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium">{paymentDetails.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {paymentDetails.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-primary sticky top-6">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Credits</span>
                    <span>{listing.totalCredits} tons</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-bold text-primary">
                      ₹{paymentDetails.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => navigate('/company/purchases')}
                >
                  View All Purchases
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure transaction powered by Razorpay</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderSuccess;
