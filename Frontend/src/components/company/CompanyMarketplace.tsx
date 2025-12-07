import { useState, useMemo } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { CreditCard } from "../shared/CreditCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { carbonCredits, CarbonCredit, companies } from "@/data/mockData";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  credit: CarbonCredit;
  quantity: number;
}

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const currentCompany = companies[1]; // c2 - Green Manufacturing Co.

const CompanyMarketplace = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const practices = [...new Set(carbonCredits.map(c => c.practiceType))];
  //@ts-ignore
  const countries = [...new Set(carbonCredits.map(c => c.country))];

  const filteredCredits = useMemo(() => {
    let filtered = carbonCredits.filter(credit => {
      const matchesSearch = 
        credit.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credit.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credit.practiceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credit.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = credit.pricePerCredit >= priceRange[0] && credit.pricePerCredit <= priceRange[1];
      const matchesPractice = selectedPractices.length === 0 || selectedPractices.includes(credit.practiceType);
      //@ts-ignore
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(credit.country);
      
      return matchesSearch && matchesPrice && matchesPractice && matchesCountry;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricePerCredit - b.pricePerCredit);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricePerCredit - a.pricePerCredit);
        break;
      case 'credits':
        filtered.sort((a, b) => b.credits - a.credits);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, priceRange, selectedPractices, selectedCountries, sortBy]);

  const addToCart = (credit: CarbonCredit) => {
    setCart(prev => {
      const existing = prev.find(item => item.credit.id === credit.id);
      if (existing) {
        return prev.map(item =>
          item.credit.id === credit.id
            ? { ...item, quantity: Math.min(item.quantity + 1, credit.credits) }
            : item
        );
      }
      return [...prev, { credit, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${credit.farmName} credit added to your cart.`,
    });
  };

  const removeFromCart = (creditId: string) => {
    setCart(prev => prev.filter(item => item.credit.id !== creditId));
  };

  const updateQuantity = (creditId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(creditId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.credit.id === creditId
          ? { ...item, quantity: Math.min(quantity, item.credit.credits) }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.credit.pricePerCredit * item.quantity, 0);
  const cartCredits = cart.reduce((sum, item) => sum + item.quantity, 0);

  const togglePractice = (practice: string) => {
    setSelectedPractices(prev =>
      prev.includes(practice)
        ? prev.filter(p => p !== practice)
        : [...prev, practice]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 50]);
    setSelectedPractices([]);
    setSelectedCountries([]);
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedPractices.length > 0 || selectedCountries.length > 0 || priceRange[0] > 0 || priceRange[1] < 50;

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
      userName={currentCompany.name}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Carbon Credit Marketplace
            </h1>
            <p className="text-muted-foreground">
              Browse {carbonCredits.length} verified credits from sustainable farms worldwide
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
                    <div key={item.credit.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <img 
                        src={item.credit.image} 
                        alt={item.credit.farmName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.credit.farmName}</p>
                        <p className="text-sm text-muted-foreground">₹{item.credit.pricePerCredit}/credit</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.credit.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.credit.id, item.quantity + 1)}
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
                          onClick={() => removeFromCart(item.credit.id)}
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
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                      Proceed to Checkout
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
                    placeholder="Farm, farmer, practice..."
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

              {/* Practice Types */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">Practice Type</label>
                <div className="flex flex-wrap gap-2">
                  {practices.map(practice => (
                    <Badge
                      key={practice}
                      variant={selectedPractices.includes(practice) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePractice(practice)}
                    >
                      {practice}
                      {selectedPractices.includes(practice) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Location</label>
                <div className="flex flex-wrap gap-2">
                  {countries.map(country => (
                    <Badge
                      key={country}
                      variant={selectedCountries.includes(country) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCountry(country)}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {country}
                      {selectedCountries.includes(country) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Credits Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredCredits.length} of {carbonCredits.length} credits
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
                    <SelectItem value="credits">Most Credits</SelectItem>
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

            {/* Credits */}
            {filteredCredits.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No credits found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredCredits.map(credit => (
                  <CreditCard 
                    key={credit.id} 
                    credit={credit} 
                    viewMode={viewMode}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyMarketplace;