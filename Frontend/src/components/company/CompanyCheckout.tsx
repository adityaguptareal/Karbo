import { useState, useEffect } from "react";
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
  FileCheck,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'your_razorpay_key';

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Documents Verification", href: "/company/documents", icon: FileCheck},
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

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

const CompanyCheckout = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [listing, setListing] = useState<CarbonListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    fetchListingDetails();

    return () => {
      document.body.removeChild(script);
    };
  }, [listingId]);

  const fetchListingDetails = async () => {
    try {
        setLoading(true);
        setError(null);

        console.log('🔍 Looking for listingId:', listingId); // Debug log

        const token = localStorage.getItem('token');
        
        const response = await axios.get(
        `${API_BASE_URL}/marketplace/listings`,
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
        );

        console.log('📦 All listings:', response.data.listings); // Debug log

        if (response.data.listings) {
        const foundListing = response.data.listings.find(
            (listing: any) => listing._id === listingId
        );

        console.log('✅ Found listing:', foundListing); // Debug log

        if (foundListing) {
            setListing(foundListing);
        } else {
            console.error('❌ Listing not found. Available IDs:', 
            response.data.listings.map((l: any) => l._id)
            );
            setError("Listing not found or no longer available");
        }
        }
    } catch (err: any) {
        console.error('Fetch listing error:', err);
        const errorMsg = err.response?.data?.msg || 'Failed to load listing details';
        setError(errorMsg);
        
        toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  };


  // const handlePayment = async () => {
  //   if (!listing) return;

  //   try {
  //     setProcessing(true);

  //     // Step 1: Create Razorpay order
  //     const orderData = await paymentService.createOrder(
  //       listing.totalValue,
  //       listing._id
  //     );

  //     if (!orderData.success || !orderData.order) {
  //       throw new Error('Failed to create payment order');
  //     }

  //     // Step 2: Initialize Razorpay checkout
  //     const options = {
  //       key: RAZORPAY_KEY,
  //       amount: orderData.order.amount,
  //       currency: orderData.order.currency,
  //       name: "Karbo - Carbon Credits",
  //       description: `Purchase ${listing.totalCredits} Carbon Credits`,
  //       order_id: orderData.order.id,
  //       handler: async function (response: any) {
  //         try {
  //           // Step 3: Verify payment on backend
  //           const verificationData = {
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_signature: response.razorpay_signature,
  //             listingId: listing._id
  //           };

  //           const verifyResult = await paymentService.verifyPayment(verificationData);

  //           if (verifyResult.success) {
  //             toast({
  //               title: "Payment Successful! 🎉",
  //               description: "Your carbon credits have been purchased successfully.",
  //             });

  //             // Redirect to purchases page
  //             setTimeout(() => {
  //               navigate('/company/purchases');
  //             }, 2000);
  //           } else {
  //             throw new Error('Payment verification failed');
  //           }
  //         } catch (error: any) {
  //           console.error('Verification error:', error);
  //           toast({
  //             title: "Verification Failed",
  //             description: error.response?.data?.message || "Please contact support",
  //             variant: "destructive"
  //           });
  //         } finally {
  //           setProcessing(false);
  //         }
  //       },
  //       prefill: {
  //         name: currentUser?.name || "",
  //         email: currentUser?.email || "",
  //       },
  //       theme: {
  //         color: "#10b981" // Emerald color
  //       },
  //       modal: {
  //         ondismiss: function() {
  //           setProcessing(false);
  //           toast({
  //             title: "Payment Cancelled",
  //             description: "You cancelled the payment process",
  //           });
  //         }
  //       }
  //     };

  //     const razorpay = new window.Razorpay(options);
  //     razorpay.open();

  //   } catch (error: any) {
  //     console.error('Payment error:', error);
  //     setProcessing(false);
      
  //     toast({
  //       title: "Payment Failed",
  //       description: error.response?.data?.message || "Failed to initiate payment",
  //       variant: "destructive"
  //     });
  //   }
  // };

  const handlePayment = async () => {
    const { data } = await axios.post(
      "http://localhost:3000/api/v1/payment/create-order",
      { amount: listing.totalValue, listingId: listing._id  }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    console.log(listing.totalValue, listing._id);
    console.log(listing);

    const order = data.order;
    const options = {
      key: "rzp_test_RlWT3nMgfVf39q",
      amount: order.amount,
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: order.id,
      //@ts-ignore
      handler: async function(response: any) {
        try {
          const verifyUrl = "http://localhost:3000/api/v1/payment/verify-payment";
          const verifyResponse = await axios.post(
            verifyUrl,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              listingId: listing._id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // If backend verification is successful:
          // (adjust according to your verify API response)
          if (verifyResponse.data.success) {
            // Redirect to OrderSuccess with real data
            console.log(listing);
            navigate("/company/order-success", {
              state: {
                listing,
                paymentDetails: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: listing.totalValue,
                  currency: "INR",
                  status: "SUCCESS",
                },
              },
            });
          } else {
            alert("Payment verification failed");
          }
        } catch (err) {
          alert("Payment Failed");
          console.log(err);
        }
      },

      theme:{
        color:"#cc3333ff"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Checkout</h3>
            <p className="text-muted-foreground mb-4">{error || "Listing not found"}</p>
            <Button onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Review and complete your carbon credit purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Details */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
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

            {/* Payment Method */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-muted-foreground">
                      Credit Card, Debit Card, UPI, Net Banking
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                    Secure
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-primary sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{listing.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="text-green-600">₹0.00</span>
                  </div>                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      ₹{(listing.totalValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                  onClick={handlePayment}
                  disabled={processing || listing.status !== 'active'}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment powered by Razorpay</span>
                </div>

                {/* Benefits */}
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">What you get:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Verified carbon credits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Digital certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>1 year validity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Impact report access</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyCheckout;
