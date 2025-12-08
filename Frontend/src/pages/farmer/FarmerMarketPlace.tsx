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
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { farmerApi, Farmland, FarmerListing } from "@/services/farmerApi";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Store },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
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

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Listing */}
          <div className="bg-card p-6 border rounded-xl space-y-4">
            <h2 className="font-semibold text-lg">Create listing</h2>

            {farmlands.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add farmland first.
              </p>
            ) : (
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <Label>Farmland</Label>
                  <Select
                    value={form.farmlandId}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, farmlandId: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select farmland" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmlands.map((f) => (
                        <SelectItem value={f._id} key={f._id}>
                          {f.landName} — {f.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total credits</Label>
                    <Input
                      value={form.totalCredits}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          totalCredits: e.target.value,
                        }))
                      }
                      type="number"
                    />
                  </div>
                  <div>
                    <Label>Price per credit (₹)</Label>
                    <Input
                      value={form.pricePerCredit}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          pricePerCredit: e.target.value,
                        }))
                      }
                      type="number"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    rows={3}
                  />
                </div>

                <Button className="w-full" disabled={creating}>
                  {creating ? "Creating..." : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      List Credits
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* My Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card p-6 border rounded-xl">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">My Listings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your listed credits.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search…"
                    className="w-56"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Listing list */}
              {filteredMyListings.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No listings found.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredMyListings.map((l) => {
                    const farm = farmlands.find((f) => f._id === l.farmlandId);
                    return (
                      <div
                        key={l._id}
                        className="flex justify-between p-4 border rounded-lg bg-muted/40"
                      >
                        <div className="space-y-1 max-w-[70%]">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {farm?.landName || "Farmland"}
                            </p>
                            {statusBadge(l.status)}
                          </div>
                          <p className="flex items-center text-xs text-muted-foreground gap-1">
                            <MapPin className="w-3 h-3" />
                            {farm?.location}
                          </p>

                          {l.description && (
                            <p className="text-xs line-clamp-2">
                              {l.description}
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground flex gap-2">
                            <span>{l.totalCredits} credits</span> •{" "}
                            <span>₹{l.pricePerCredit}/credit</span> •{" "}
                            <span>
                              <Calendar className="w-3 h-3 inline" />{" "}
                              {new Date(l.createdAt).toLocaleDateString()}
                            </span>
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteListing(l._id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Global Marketplace */}
            <div className="bg-card p-6 border rounded-xl">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">Global Marketplace</h2>
                <Badge variant="outline">Public Listings</Badge>
              </div>

              {marketListings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No public listings yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {marketListings.map((l) => (
                    <div
                      key={l._id}
                      className="flex justify-between py-2 border-b last:border-b-0 text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          {l.farmland?.landName || "Farmland"}
                        </p>
                        <p className="text-xs text-muted-foreground flex gap-1">
                          <MapPin className="w-3 h-3" />
                          {l.farmland?.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <p>{l.totalCredits} credits</p>
                        <p className="flex items-center gap-1 justify-end">
                          <IndianRupee className="w-3 h-3" />
                          {l.pricePerCredit}/credit
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
