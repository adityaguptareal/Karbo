import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Upload,
  Leaf,
  Wallet,
  FileText,
  Settings,
  Store,
  Calendar,
  IndianRupee,
  MapPin,
  TrendingUp,
  CheckCircle,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Store },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Credits", href: "/farmer/credits", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const BASE_URL = "https://karbo.onrender.com";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  status?: string;
}

interface Farmland {
  _id: string;
  landName: string;
  location: string;
  area: number;
  landType: string;
  cultivationMethod: string;
}

interface FarmerListing {
  _id: string;
  farmlandId: string;
  totalCredits: number;
  pricePerCredit: number;
  description: string;
  status?: string;
  createdAt?: string;
  farmland?: Farmland;
}

const FarmerMarketplace = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [listings, setListings] = useState<FarmerListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<FarmerListing | null>(
    null
  );

  const [form, setForm] = useState({
    farmlandId: "",
    totalCredits: "",
    pricePerCredit: "",
    description: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authHeaders: HeadersInit = token ? { Authorization: token } : {};

  // --- Initial data load ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [profileRes, farmlandsRes, listingsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/profile/me`, {
            headers: authHeaders,
          }),
          fetch(`${BASE_URL}/api/v1/farmland/my`, {
            headers: authHeaders,
          }),
          fetch(`${BASE_URL}/api/v1/farmer-marketplace-listing/my`, {
            headers: authHeaders,
          }),
        ]);

        if (profileRes.ok) {
          const json = await profileRes.json();
          setProfile(json.data ?? json.user ?? json);
        } else {
          console.error("Profile error", await safeJson(profileRes));
        }

        if (farmlandsRes.ok) {
          const json = await farmlandsRes.json();
          setFarmlands(json.data ?? json.farmlands ?? json);
        } else {
          console.error("Farmlands error", await safeJson(farmlandsRes));
        }

        if (listingsRes.ok) {
          const json = await listingsRes.json();
          setListings(json.data ?? json.listings ?? json);
        } else {
          console.error("Listings error", await safeJson(listingsRes));
        }
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Error",
          description:
            err?.message || "Failed to load marketplace data from server.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper to avoid crash if response body not JSON
  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  // --- Derived stats ---
  const totalListings = listings.length;
  const totalCreditsListed = listings.reduce(
    (sum, l) => sum + (l.totalCredits || 0),
    0
  );
  const avgPrice =
    totalListings === 0
      ? 0
      : listings.reduce((sum, l) => sum + (l.pricePerCredit || 0), 0) /
        totalListings;

  // --- Form helpers ---
  const openCreateDialog = () => {
    setEditingListing(null);
    setForm({
      farmlandId: "",
      totalCredits: "",
      pricePerCredit: "",
      description: "",
    });
    setFormDialogOpen(true);
  };

  const openEditDialog = (listing: FarmerListing) => {
    setEditingListing(listing);
    setForm({
      farmlandId: listing.farmlandId,
      totalCredits: String(listing.totalCredits ?? ""),
      pricePerCredit: String(listing.pricePerCredit ?? ""),
      description: listing.description ?? "",
    });
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.farmlandId || !form.totalCredits || !form.pricePerCredit) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const body = {
      farmlandId: form.farmlandId,
      totalCredits: Number(form.totalCredits),
      pricePerCredit: Number(form.pricePerCredit),
      description: form.description,
    };

    try {
      const isEdit = !!editingListing;
      const url = isEdit
        ? `${BASE_URL}/api/v1/farmer-marketplace-listing/update/${editingListing!._id}`
        : `${BASE_URL}/api/v1/farmer-marketplace-listing/create`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await safeJson(res);

      if (!res.ok) {
        throw new Error(json?.message || json?.msg || "Request failed");
      }

      toast({
        title: isEdit ? "Listing updated" : "Listing created",
        description: "Your marketplace listing has been saved.",
      });

      // Refresh listings
      const listingsRes = await fetch(
        `${BASE_URL}/api/v1/farmer-marketplace-listing/my`,
        { headers: authHeaders }
      );
      if (listingsRes.ok) {
        const listJson = await listingsRes.json();
        setListings(listJson.data ?? listJson.listings ?? listJson);
      }

      setFormDialogOpen(false);
      setEditingListing(null);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err?.message ||
          "Something went wrong while saving your marketplace listing.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteListing = async (listing: FarmerListing) => {
    const confirm = window.confirm(
      `Delete listing for farmland? This action cannot be undone.`
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/farmer-marketplace-listing/delete/${listing._id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const json = await safeJson(res);
      if (!res.ok) {
        throw new Error(json?.message || json?.msg || "Failed to delete");
      }

      toast({
        title: "Listing deleted",
        description: "The marketplace listing was removed.",
      });

      setListings((prev) => prev.filter((l) => l._id !== listing._id));
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err?.message || "Something went wrong while deleting the listing.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "sold_out":
        return "bg-primary/10 text-primary border-primary/20";
      case "inactive":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getFarmlandName = (listing: FarmerListing) => {
    if (listing.farmland?.landName) return listing.farmland.landName;
    const f = farmlands.find((x) => x._id === listing.farmlandId);
    return f?.landName || "Farmland";
  };

  const getFarmlandLocation = (listing: FarmerListing) => {
    if (listing.farmland?.location) return listing.farmland.location;
    const f = farmlands.find((x) => x._id === listing.farmlandId);
    return f?.location || "—";
  };

  return (
    <DashboardLayout
      navItems={navItems}
      userType="farmer"
      userName={profile?.name || (isLoading ? "Loading..." : "Farmer")}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Farmer Marketplace Listings
          </h1>
          <p className="text-muted-foreground">
            Manage the carbon credit listings companies will see and purchase
            from.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Listings</p>
              <Store className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {totalListings}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Total Credits Listed
              </p>
              <Leaf className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {totalCreditsListed}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Average Price</p>
              <IndianRupee className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              ₹{avgPrice.toFixed(0)}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">My Farmlands</p>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {farmlands.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg text-foreground">
                My Marketplace Listings
              </h2>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                New Listing
              </Button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                  Loading listings...
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No listings yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create a listing to make your carbon credits available to
                    companies.
                  </p>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Listing
                  </Button>
                </div>
              ) : (
                listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {getFarmlandName(listing)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{getFarmlandLocation(listing)}</span>
                        </div>
                      </div>
                      <Badge className={getStatusBadgeClass(listing.status)}>
                        {listing.status || "active"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {listing.description || "No description provided."}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          Credits listed:
                        </span>
                        <span className="font-semibold text-foreground">
                          {listing.totalCredits}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          Price / credit:
                        </span>
                        <span className="font-semibold text-foreground">
                          ₹{listing.pricePerCredit}
                        </span>
                      </div>
                      {listing.createdAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <span className="font-semibold text-foreground">
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-center"
                        onClick={() => openEditDialog(listing)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-center text-destructive border-destructive/40"
                        onClick={() => handleDeleteListing(listing)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Info / help panel */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">
                How listings work
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • Choose one of your verified farmlands and specify how many
                  credits you want to list.
                </li>
                <li>
                  • Set a price per credit. Companies will see this in their
                  marketplace view.
                </li>
                <li>
                  • You can edit or delete listings anytime until they are sold
                  out.
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Need help?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you are not seeing your farmlands or listings, make sure your
                account is verified or contact support.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Create / Edit listing dialog */}
        <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingListing ? "Edit Listing" : "Create Listing"}
              </DialogTitle>
              <DialogDescription>
                {editingListing
                  ? "Update your existing marketplace listing."
                  : "Create a new listing for one of your farmlands."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Farmland *</Label>
                  <Select
                    value={form.farmlandId}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, farmlandId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select farmland" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmlands.map((f) => (
                        <SelectItem key={f._id} value={f._id}>
                          {f.landName} — {f.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {farmlands.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      You don&apos;t have any farmlands yet. Add one from the
                      dashboard first.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalCredits">Total Credits *</Label>
                    <Input
                      id="totalCredits"
                      type="number"
                      min={1}
                      value={form.totalCredits}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          totalCredits: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerCredit">
                      Price per Credit (₹) *
                    </Label>
                    <Input
                      id="pricePerCredit"
                      type="number"
                      min={1}
                      value={form.pricePerCredit}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          pricePerCredit: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your farming practices, certification, soil quality, etc."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {editingListing ? "Save Changes" : "Create Listing"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FarmerMarketplace;
