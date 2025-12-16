import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardLayout } from "../layout/DashboardLayout";
import { CreditCard } from "../shared/CreditCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { marketplaceService } from "@/services/marketplaceService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ShoppingCart,
  Trash2,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
  FileCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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
    landImages?: string[];
    landType?: string;
    cultivationMethod?: string;
  };
  farmerId: {
    name: string;
    email: string;
  };
}

interface CartItem {
  credit: CarbonListing;
  quantity: number;
}

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Documents Verification", href: "/company/documents", icon: FileCheck },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const CompanyMarketplace = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minArea, setMinArea] = useState<number | undefined>();
  const [maxArea, setMaxArea] = useState<number | undefined>();
  const [location, setLocation] = useState("");
  const [minCredits, setMinCredits] = useState<number | undefined>();
  const [maxCredits, setMaxCredits] = useState<number | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Verification state
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('loading');

  // Backend data states
  const [listings, setListings] = useState<CarbonListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalListings, setTotalListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch user verification status
  const fetchVerificationStatus = async () => {
    //console.log('🚀 Starting fetchVerificationStatus...'); // ✅ Add this
    try {
      const token = localStorage.getItem('token');
      //console.log('🔑 Token:', token ? 'exists' : 'missing'); // ✅ Add this

      const response = await axios.get(`${API_BASE_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      //console.log('📡 Response status:', response.status);

      const data = await response.data.user;
      //console.log('📦 Full response:', data);

      if (data) {
        const status = data.status || 'not_submitted';
        setIsVerified(status === 'verified');

        //console.log('✅ Setting state - Status:', status, 'IsVerified:', isVerified);
      }
    } catch (error) {
      console.error('❌ Error:', error); // ✅ Add this
      setVerificationStatus('not_submitted');
      setIsVerified(false);
    }
  };

  useEffect(() => {
    //console.log('🔄 Component mounted, fetching verification...'); // ✅ Add this
    fetchVerificationStatus();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
    fetchUserName();
  }, []);


  // Fetch listings from backend
  const fetchListings = async () => {
    try {
      setLoading(true);

      const filters = {
        search: searchQuery || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minArea,
        maxArea,
        location: location || undefined,
        minCredits,
        maxCredits,
        sort:
          sortBy === "newest"
            ? "newest"
            : sortBy === "price-low"
              ? "price_low"
              : sortBy === "price-high"
                ? "price_high"
                : "newest",
        page: currentPage,
        limit: 20,
      };

      const response = await marketplaceService.getListings(filters);

      setListings(response.listings || []);
      setTotalListings(response.total || 0);
      setTotalPages(response.pages || 1);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to fetch listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [
    searchQuery,
    priceRange,
    sortBy,
    currentPage,
    minArea,
    maxArea,
    location,
    minCredits,
    maxCredits,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchListings();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ UPDATED: Check verification before adding to cart
  const addToCart = (credit: CarbonListing) => {
    // Check if user is verified
    if (!isVerified) {
      setShowVerificationDialog(true);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.credit._id === credit._id);
      if (existing) {
        return prev.map(item =>
          item.credit._id === credit._id
            ? { ...item, quantity: Math.min(item.quantity + 1, credit.totalCredits) }
            : item
        );
      }
      return [...prev, { credit, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${credit.farmlandId?.landName || 'Credit'} added to your cart.`,
    });
  };

  const removeFromCart = (creditId: string) => {
    setCart(prev => prev.filter(item => item.credit._id !== creditId));
  };

  const updateQuantity = (creditId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(creditId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.credit._id === creditId
          ? { ...item, quantity: Math.min(quantity, item.credit.totalCredits) }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.credit.totalValue, 0);
  const cartCredits = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 1000]);
    setSortBy("newest");
    setCurrentPage(1);
    setMinArea(undefined);
    setMaxArea(undefined);
    setLocation("");
    setMinCredits(undefined);
    setMaxCredits(undefined);
  };

  const hasActiveFilters =
    searchQuery ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000 ||
    minArea ||
    maxArea ||
    location ||
    minCredits ||
    maxCredits;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before checkout",
        variant: "destructive"
      });
      return;
    }

    const firstItem = cart[0].credit;
    setCartOpen(false);
    navigate(`/company/checkout/${firstItem._id}`, { state: { cart } });
  };

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
    >
      <div className="space-y-6">
        {/* Verification Alert Banner */}
        {!isVerified && verificationStatus !== 'loading' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Account Verification Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  {verificationStatus === 'not_submitted' &&
                    "You need to verify your company to purchase carbon credits. Please submit your documents."}
                  {verificationStatus === 'pending_verification' && // ✅ Changed from 'pending'
                    "Your verification is pending approval. You'll be able to purchase once verified."}
                  {verificationStatus === 'rejected' &&
                    "Your verification was rejected. Please resubmit with correct documents."}
                </p>
                {verificationStatus !== 'pending_verification' && ( // ✅ Changed from 'pending'
                  <Button
                    size="sm"
                    onClick={() => navigate('/company/documents')}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Account Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Carbon Credit Marketplace
            </h1>
            <p className="text-muted-foreground">
              Browse {totalListings} verified credits from sustainable farms worldwide
            </p>
          </div>

          {/* Cart Button */}
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="relative bg-emerald-600 hover:bg-emerald-700">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({cartCredits})
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-secondary-foreground rounded-full text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart
                </SheetTitle>
              </SheetHeader>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Browse the marketplace to add credits</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.credit._id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.credit.farmlandId?.landName || 'Carbon Credit'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.credit.pricePerCredit}/credit
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{(item.credit.totalValue).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFromCart(item.credit._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Total Credits</span>
                      <span className="font-medium">{cartCredits}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-muted-foreground">Total CO₂ Offset</span>
                      <span className="font-medium">{cartCredits} tons</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold mb-6">
                      <span>Total</span>
                      <span className="text-emerald-600 dark:text-emerald-400">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Verification Dialog */}
        <AlertDialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                Account Verification Required
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 pt-2">
                <p>
                  You need to verify your company account before purchasing carbon credits.
                </p>
                <p className="font-medium">
                  {verificationStatus === 'not_submitted' &&
                    "Please submit your company documents to start the verification process."}
                  {verificationStatus === 'pending' &&
                    "Your verification is currently being reviewed by our team."}
                  {verificationStatus === 'rejected' &&
                    "Your previous verification was rejected. Please resubmit with correct documents."}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {verificationStatus !== 'pending' && (
                <AlertDialogAction
                  onClick={() => {
                    setShowVerificationDialog(false);
                    navigate('/company/settings');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Go to Settings
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search farmland or farmer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Price Range (₹/credit): {priceRange[0]} - {priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={10}
                  className="mt-3"
                />
              </div>

              {/* Area filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Land Area (acres)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minArea ?? ""}
                    onChange={(e) =>
                      setMinArea(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxArea ?? ""}
                    onChange={(e) =>
                      setMaxArea(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>

              {/* Credits filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Available Credits
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minCredits ?? ""}
                    onChange={(e) =>
                      setMinCredits(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxCredits ?? ""}
                    onChange={(e) =>
                      setMaxCredits(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>

              {/* Location filter */}
              <div className="mb-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Location (state / city)
                </label>
                <Input
                  placeholder="e.g. Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* Credits Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="grid md:flex items-center justify-between mb-6">
              <p className="ml-5 mb-2 text-muted-foreground">
                Showing {listings.length} of {totalListings} credits
              </p>
              <div className="flex ml-4 items-center gap-16">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading listings...</span>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No credits found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "space-y-4"
                }>
                  {listings.map(credit => (
                    <CreditCard
                      key={credit._id}
                      credit={credit}
                      viewMode={viewMode}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyMarketplace;
