// src/pages/farmer/FarmerMarketplace.tsx
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Store,
  MapPin,
  Calendar,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Trash2,
  Plus,
  Upload,
  LayoutDashboard,
  Leaf,
  Wallet,
  FileText,
  Settings,
  Sprout
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { farmerApi, Farmland, FarmerListing } from "@/services/farmerApi";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Farmlands", href: "/farmer/my-farmlands", icon: Sprout },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

// Safe array util
const safeArray = <T,>(val: any): T[] =>
  Array.isArray(val) ? val : Array.isArray(val?.data) ? val.data : [];

type StatusFilter = "all" | "active" | "sold" | "expired";

export default function FarmerMarketplace() {
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [myListings, setMyListings] = useState<FarmerListing[]>([]);
  const [marketListings, setMarketListings] = useState<FarmerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    farmlandId: "",
    totalCredits: "",
    pricePerCredit: "",
    description: "",
  });

  // Load marketplace data
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const farms = await farmerApi.getMyFarmlands();
        const mine = await farmerApi.getMyListings();
        const market = await farmerApi.getMarketplaceListings();

        setFarmlands(safeArray<Farmland>(farms));
        setMyListings(safeArray<FarmerListing>(mine));
        setMarketListings(safeArray<FarmerListing>(market));
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not load marketplace.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Create new listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();

    const { farmlandId, totalCredits, pricePerCredit, description } = form;
    if (!farmlandId || !totalCredits || !pricePerCredit) {
      toast({
        title: "Missing fields",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);

      const newListing = await farmerApi.createListing({
        farmlandId,
        totalCredits: Number(totalCredits),
        pricePerCredit: Number(pricePerCredit),
        description,
      });

      setMyListings((prev) => [newListing, ...prev]);

      toast({ title: "Listing created" });

      setForm({
        farmlandId: "",
        totalCredits: "",
        pricePerCredit: "",
        description: "",
      });
    } catch (err: any) {
      toast({
        title: "Failed to create listing",
        description: err?.response?.data?.message || "Try again later.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  // Delete listing
  const handleDeleteListing = async (id: string) => {
    if (!confirm("Delete this listing?")) return;

    try {
      await farmerApi.deleteListing(id);
      setMyListings((prev) => prev.filter((l) => l._id !== id));
      toast({ title: "Listing deleted" });
    } catch (err: any) {
      toast({
        title: "Failed to delete listing",
        description: err?.response?.data?.message || "Try again.",
        variant: "destructive",
      });
    }
  };

  // Filter listings
  const filteredMyListings = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return safeArray<FarmerListing>(myListings).filter((l) => {
      const statusOK = statusFilter === "all" || l.status === statusFilter;
      const farm = farmlands.find((f) => f._id === l.farmlandId);
      const text =
        `${farm?.landName ?? ""} ${farm?.location ?? ""} ${l.description ?? ""}`.toLowerCase();
      const matches = !q || text.includes(q);
      return statusOK && matches;
    });
  }, [myListings, farmlands, statusFilter, searchQuery]);

  // Stats
  const activeCount = myListings.filter((l) => l.status === "active").length;
  const totalCredits = myListings.reduce(
    (s, l) => s + (l.totalCredits || 0),
    0
  );
  const avgPrice =
    myListings.length > 0
      ? Math.round(
        myListings.reduce((s, l) => s + (l.pricePerCredit || 0), 0) /
        myListings.length
      )
      : 0;

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case "sold":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            <TrendingUp className="w-3 h-3 mr-1" /> Sold
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            <XCircle className="w-3 h-3 mr-1" /> Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} userType="farmer">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} userType="farmer">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Farmer Marketplace</h1>
          <p className="text-muted-foreground">
            List your verified carbon credits for buyers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Active listings</p>
            <p className="text-3xl font-bold">{activeCount}</p>
          </div>
          <div className="bg-card border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Total credits</p>
            <p className="text-3xl font-bold">{totalCredits}</p>
          </div>
          <div className="bg-card border p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Avg price</p>
            <p className="text-3xl font-bold">₹{avgPrice}</p>
          </div>
        </div>

        {/* Create Listing */}
        <div className="bg-card border p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Store className="w-5 h-5" /> Create New Listing
          </h2>
          <form onSubmit={handleCreateListing} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Farmland</Label>
              <Select
                value={form.farmlandId}
                onValueChange={(val) => setForm({ ...form, farmlandId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a farm..." />
                </SelectTrigger>
                <SelectContent>
                  {farmlands.map((f) => (
                    <SelectItem key={f._id} value={f._id}>
                      {f.landName} ({f.area} acres)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Total Credits to Sell</Label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={form.totalCredits}
                onChange={(e) => setForm({ ...form, totalCredits: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Price per Credit (₹)</Label>
              <Input
                type="number"
                placeholder="e.g. 500"
                value={form.pricePerCredit}
                onChange={(e) => setForm({ ...form, pricePerCredit: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your sustainable practices..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={creating} className="w-full md:w-auto">
                {creating ? "Creating..." : <><Plus className="w-4 h-4 mr-2" /> Create Listing</>}
              </Button>
            </div>
          </form>
        </div>

        {/* Listings List */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold">Your Listings</h2>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val as StatusFilter)}
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredMyListings.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No listings found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMyListings.map((listing) => {
                const farm = farmlands.find((f) => f._id === listing.farmlandId);
                return (
                  <div
                    key={listing._id}
                    className="bg-card border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {farm?.landName || "Unknown Farm"}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {farm?.location || "Unknown"}
                          </p>
                        </div>
                        {statusBadge(listing.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Credits
                          </p>
                          <p className="font-medium text-lg">{listing.totalCredits}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Price/Credit
                          </p>
                          <p className="font-medium text-lg">₹{listing.pricePerCredit}</p>
                        </div>
                        {listing.totalValue && (
                          <div className="col-span-2 border-t pt-2 mt-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              Total Value
                            </p>
                            <p className="font-bold text-xl text-primary">
                              ₹{listing.totalValue.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {listing.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {listing.description}
                        </p>
                      )}

                      <div className="space-y-2 pt-2 border-t mt-2">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {new Date(listing.createdAt).toLocaleDateString()}
                          </span>
                          {listing.validFrom && (
                            <span className="flex items-center gap-1">
                              Valid: {new Date(listing.validFrom).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {listing.status === 'sold' && (
                          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Sold to: {listing.soldTo || "Buyer"}
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                            onClick={() => handleDeleteListing(listing._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
