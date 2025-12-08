// src/pages/farmer/FarmerDashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FarmerProfile,
  Farmland,
  FarmerDashboardStats,
  farmerApi,
} from "@/services/farmerApi";
import {
  FileText,
  Settings,
  Sprout,
  LayoutDashboard,
  Upload,
  Leaf,
  Wallet,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Farmlands", href: "/farmer/my-farmlands", icon: Sprout },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

// Prevent crash if backend returns unexpected status
const normalizeStatus = (s: string | null | undefined) =>
  (s || "pending") as any;

export const FarmerDashboard = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [stats, setStats] = useState<FarmerDashboardStats | null>(null);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // NEW — farmerApi returns RAW values, not {success, data} !
        const profile = await farmerApi.getProfile();
        const dashboardStats = await farmerApi.getDashboardStats();
        const myFarmlands = await farmerApi.getMyFarmlands();

        setProfile(profile || null);
        setStats(dashboardStats || null);

        // Ensure ALWAYS an array
        setFarmlands(Array.isArray(myFarmlands) ? myFarmlands : []);
      } catch (error: any) {
        console.error("Dashboard load error:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Safe calculations — prevent reduce() crash
  const safeFarmlands = Array.isArray(farmlands) ? farmlands : [];

  const totalFarmlands = stats?.totalFarmlands ?? safeFarmlands.length;
  const approvedFarmlands = stats?.approvedFarmlands ?? 0;
  const pendingFarmlands = stats?.pendingFarmlands ?? 0;

  const totalArea = safeFarmlands.reduce(
    (sum, f) => sum + Number(f.area || 0),
    0
  );

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} userType="farmer">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      userType="farmer"
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome back, {(profile?.name || "Farmer").split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here’s an overview of your carbon credit activity.
          </p>
        </div>

        {/* Account Status */}
        {normalizeStatus(profile?.status) === "pending" && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex gap-3">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="font-medium text-foreground">Account under review</p>
              <p className="text-sm text-muted-foreground">
                Our team is verifying your details. You’ll be notified once
                approved.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Farmlands"
            value={String(totalFarmlands)}
            subtitle="Registered farms"
            icon={Leaf}
            variant="primary"
          />

          <StatsCard
            title="Approved Farmlands"
            value={String(approvedFarmlands)}
            subtitle="Verified & active"
            icon={CheckCircle}
            trend={{
              value:
                totalFarmlands > 0
                  ? Math.round((approvedFarmlands / totalFarmlands) * 100)
                  : 0,
              isPositive: true,
            }}
          />

          <StatsCard
            title="Pending Verification"
            value={String(pendingFarmlands)}
            subtitle="Under review"
            icon={Clock}
            variant="accent"
          />

          <StatsCard
            title="Total Area"
            value={`${(totalArea * 0.404686).toFixed(2)} ha`}
            subtitle="Hectares registered"
            icon={TrendingUp}
            variant="secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Farmland Section */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-foreground">
                Your Farmlands
              </h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/farmer/farmlands">View all</Link>
              </Button>
            </div>

            {safeFarmlands.length === 0 ? (
              <div className="text-center py-12">
                <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="font-medium text-foreground mb-2">
                  No farmlands registered yet
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Start by uploading your first farmland documentation.
                </p>
                <Button asChild>
                  <Link to="/farmer/upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload documents
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {safeFarmlands.slice(0, 3).map((farm) => (
                    <div
                      key={farm._id}
                      className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg"
                    >
                      {farm.landImages?.[0] ? (
                        <img
                          src={farm.landImages[0]}
                          alt={farm.landName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Leaf className="w-8 h-8 text-primary" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {farm.landName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {farm.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{(Number(farm.area) * 0.404686).toFixed(2)} ha</span>
                          <span>•</span>
                          <span>{farm.landType}</span>
                        </div>
                      </div>

                      <StatusBadge status={normalizeStatus(farm.status)} />
                    </div>
                  ))}
                </div>

                {safeFarmlands.length > 3 && (
                  <Button variant="ghost" className="w-full mt-4" asChild>
                    <Link to="/farmer/farmlands">
                      View all {safeFarmlands.length} farmlands
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                )}

                {/* Verification Breakdown */}
                {totalFarmlands > 0 && (
                  <div className="border-t border-border pt-6 mt-6">
                    <h3 className="font-medium text-foreground mb-4">
                      Verification status
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            Approved
                          </span>
                          <span className="font-medium text-foreground">
                            {approvedFarmlands} of {totalFarmlands}
                          </span>
                        </div>
                        <Progress
                          value={
                            (approvedFarmlands /
                              Math.max(totalFarmlands, 1)) *
                            100
                          }
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Pending</span>
                          <span className="font-medium text-foreground">
                            {pendingFarmlands} of {totalFarmlands}
                          </span>
                        </div>
                        <Progress
                          value={
                            (pendingFarmlands /
                              Math.max(totalFarmlands, 1)) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Account info
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge
                    status={normalizeStatus(profile?.status)}
                  />
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground">
                    {profile?.email || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="text-foreground capitalize">
                    {profile?.role || "farmer"}
                  </span>
                </div>
              </div>
            </div>



            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Need help?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact support if you have questions about verification,
                farmlands, or marketplace listings.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
