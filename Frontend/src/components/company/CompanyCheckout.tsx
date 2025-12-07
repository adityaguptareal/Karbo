import { useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { companies } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  CreditCard as CreditCardIcon,
  Building2,
  CheckCircle,
  Download,
  ArrowLeft,
  ArrowRight,
  Leaf,
  Package,
  Trash2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const currentCompany = companies[1]; // c2 - Green Manufacturing Co.

const CompanyCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];
  
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'billing' | 'payment' | 'success'>('review');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Calculate totals
  const cartTotal = cart.reduce((sum: number, item: any) => sum + item.credit.pricePerCredit * item.quantity, 0);
  const cartCredits = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const platformFee = cartTotal * 0.05; // 5% platform fee
  const gst = (cartTotal + platformFee) * 0.18; // 18% GST
  const finalTotal = cartTotal + platformFee + gst;

  const [billingInfo, setBillingInfo] = useState({
    contactName: "John Doe",
    email: "billing@greenmanufacturing.com",
    companyName: currentCompany.name,
    gstNumber: "",
    address: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [selectedBank, setSelectedBank] = useState("");

  const handleCompletePayment = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setCheckoutStep('success');
      toast({
        title: "Purchase successful!",
        description: `${cartCredits} carbon credits purchased successfully.`,
      });
    }, 2000);
  };

  if (cart.length === 0 && checkoutStep !== 'success') {
    return (
      <DashboardLayout navItems={navItems} userType="company" userName={currentCompany.name}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some carbon credits to get started</p>
            <Button onClick={() => navigate('/company/marketplace')} className="bg-emerald-600 hover:bg-emerald-700">
              Browse Marketplace
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} userType="company" userName={currentCompany.name}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your carbon credit purchase
            </p>
          </div>
          {checkoutStep !== 'success' && (
            <Button variant="outline" onClick={() => navigate('/company/marketplace')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          )}
        </div>

        {/* Progress Steps */}
        {checkoutStep !== 'success' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ 
                    width: checkoutStep === 'review' ? '0%' : checkoutStep === 'billing' ? '50%' : '100%' 
                  }}
                />
              </div>

              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2 bg-background px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  checkoutStep === 'review' ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Review Order</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2 bg-background px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  checkoutStep === 'billing' ? 'bg-emerald-600 text-white' : checkoutStep === 'payment' ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Billing Details</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-2 bg-background px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  checkoutStep === 'payment' ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <CreditCardIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Review Order */}
            {checkoutStep === 'review' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Review Your Order
                </h2>

                <div className="space-y-4">
                  {cart.map((item: any) => (
                    <div key={item.credit.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <img 
                        src={item.credit.image} 
                        alt={item.credit.farmName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.credit.farmName}</h3>
                        <p className="text-sm text-muted-foreground">{item.credit.farmerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.credit.practiceType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.credit.location}, {item.credit.country}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="font-semibold text-lg">₹{(item.credit.pricePerCredit * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">₹{item.credit.pricePerCredit}/credit</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    size="lg" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setCheckoutStep('billing')}
                  >
                    Continue to Billing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Billing Details */}
            {checkoutStep === 'billing' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Billing Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Contact Name *</Label>
                      <Input 
                        id="contact-name" 
                        value={billingInfo.contactName}
                        onChange={(e) => setBillingInfo({...billingInfo, contactName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input 
                      id="company-name"
                      value={billingInfo.companyName}
                      onChange={(e) => setBillingInfo({...billingInfo, companyName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gst-number">GST Number *</Label>
                    <Input 
                      id="gst-number" 
                      placeholder="Enter GST Number"
                      value={billingInfo.gstNumber}
                      onChange={(e) => setBillingInfo({...billingInfo, gstNumber: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Billing Address *</Label>
                    <Input 
                      id="address" 
                      placeholder="Enter complete address"
                      value={billingInfo.address}
                      onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCheckoutStep('review')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setCheckoutStep('payment')}
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {checkoutStep === 'payment' && (
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                Payment Method
                </h2>

                <div className="space-y-3">
                {/* Credit/Debit Card */}
                <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'card' 
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-border hover:border-primary'
                    }`}
                    onClick={() => setSelectedPaymentMethod('card')}
                >
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                        <CreditCardIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'card' 
                        ? 'border-emerald-600' 
                        : 'border-muted-foreground'
                    }`}>
                        {selectedPaymentMethod === 'card' && (
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                        )}
                    </div>
                    </div>

                    {/* Card Input Fields - Only show when selected */}
                    {selectedPaymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                        </div>
                        </div>
                    </div>
                    )}
                </div>

                {/* UPI Payment */}
                <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'upi' 
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-border hover:border-primary'
                    }`}
                    onClick={() => setSelectedPaymentMethod('upi')}
                >
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold">
                        UPI
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">UPI Payment</p>
                        <p className="text-sm text-muted-foreground">Pay via Google Pay, PhonePe, Paytm</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'upi' 
                        ? 'border-emerald-600' 
                        : 'border-muted-foreground'
                    }`}>
                        {selectedPaymentMethod === 'upi' && (
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                        )}
                    </div>
                    </div>

                    {/* UPI Input - Only show when selected */}
                    {selectedPaymentMethod === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="space-y-2">
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input id="upi-id" placeholder="yourname@upi" />
                        </div>
                    </div>
                    )}
                </div>

                {/* Net Banking */}
                <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'netbanking' 
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-border hover:border-primary'
                    }`}
                    onClick={() => setSelectedPaymentMethod('netbanking')}
                >
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-400 rounded-lg flex items-center justify-center text-white font-bold">
                        NB
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Net Banking</p>
                        <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'netbanking' 
                        ? 'border-emerald-600' 
                        : 'border-muted-foreground'
                    }`}>
                        {selectedPaymentMethod === 'netbanking' && (
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                        )}
                    </div>
                    </div>

                    {/* Bank Selection - Only show when selected */}
                    {selectedPaymentMethod === 'netbanking' && (
  <div className="mt-4 pt-4 border-t border-border">
    <div className="space-y-2">
      <Label htmlFor="bank">Select Bank</Label>
      <Select value={selectedBank} onValueChange={setSelectedBank}>
        <SelectTrigger id="bank">
          <SelectValue placeholder="Choose your bank" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sbi">State Bank of India</SelectItem>
          <SelectItem value="hdfc">HDFC Bank</SelectItem>
          <SelectItem value="icici">ICICI Bank</SelectItem>
          <SelectItem value="axis">Axis Bank</SelectItem>
          <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
)}
                </div>
                </div>

                <div className="mt-6 flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={() => setCheckoutStep('billing')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleCompletePayment}
                    disabled={processingPayment}
                    size="lg"
                >
                    {processingPayment ? "Processing Payment..." : `Pay ₹${finalTotal.toFixed(2)}`}
                </Button>
                </div>
            </div>
            )}


            {/* Step 4: Success */}
            {checkoutStep === 'success' && (
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your carbon credits have been purchased successfully
                  </p>

                  <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-muted-foreground mb-3">Transaction Details</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Transaction ID</span>
                        <span className="font-mono font-semibold">#TXN{Date.now().toString().slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credits Purchased</span>
                        <span className="font-semibold">{cartCredits} credits</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CO₂ Offset</span>
                        <span className="font-semibold">{cartCredits} tons</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Amount Paid</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg" variant="outline">
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </Button>
                    <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" size="lg">
                      <Download className="w-4 h-4" />
                      Download Compliance Report
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate('/company/purchases')}
                    >
                      View Purchases
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => navigate('/company/marketplace')}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {checkoutStep !== 'success' && (
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  {cart.slice(0, 3).map((item: any) => (
                    <div key={item.credit.id} className="flex gap-3">
                      <img 
                        src={item.credit.image} 
                        alt={item.credit.farmName}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.credit.farmName}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.credit.pricePerCredit * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{cart.length - 3} more items
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹{finalTotal.toFixed(2)}</span>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Environmental Impact</p>
                      <p className="text-xs text-muted-foreground">
                        You'll offset <strong>{cartCredits} tons</strong> of CO₂, equivalent to planting <strong>{cartCredits * 50}</strong> trees
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyCheckout;
