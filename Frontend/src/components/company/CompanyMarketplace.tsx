import { useState, useMemo, useEffect } from "react";
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
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  ShoppingCart, 
  X,
  Leaf,
  MapPin,
  Trash2,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface CartItem {
  credit: any;
  quantity: number;
}

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const CompanyMarketplace = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Backend data states
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalListings, setTotalListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch listings from backend
  const fetchListings = async () => {
    try {
      setLoading(true);
      
      const filters = {
        search: searchQuery || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort: sortBy === 'newest' ? 'newest' : 
              sortBy === 'price-low' ? 'price_low' : 
              sortBy === 'price-high' ? 'price_high' : 'newest',
        page: currentPage,
        limit: 20
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

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchListings();
  }, [searchQuery, priceRange, sortBy, currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchListings();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addToCart = (credit: any) => {
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

  const cartTotal = cart.reduce((sum, item) => sum + item.credit.pricePerCredit * item.quantity, 0);
  const cartCredits = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 50]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || priceRange[0] > 0 || priceRange[1] < 50;

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
      userName={currentUser?.name || "Company User"}
    >
      <div className="space-y-6">
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
                  <Leaf className="w-16 h-16 text-muted-foreground mb-4" />
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
                        <div className="flex items-center gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.credit._id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.credit._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{(item.credit.pricePerCredit * item.quantity).toFixed(2)}
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
                      onClick={() => {
                        setCartOpen(false);
                        navigate(`/company/checkout/${listing._id}`, { state: { cart } });
                      }}
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
                <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search credits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50}
                  step={1}
                  className="mt-3"
                />
              </div>
            </div>
          </aside>

          {/* Credits Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {listings.length} of {totalListings} credits
              </p>
              <div className="flex items-center gap-4">
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
                <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No credits found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
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
