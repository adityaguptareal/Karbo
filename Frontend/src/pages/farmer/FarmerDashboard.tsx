import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Upload,
  Leaf,
  Wallet,
  FileText,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  profileAPI,
  farmlandAPI,
  type UserProfile,
  type Farmland,
} from "@/services/api";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Farmlands", href: "/farmer/farmlands", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const FarmerDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [farmlands, setFarmlands] = useState<Farmland[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, farmlandsData] = await Promise.all([
          profileAPI.getProfile(),
          farmlandAPI.getMyFarmlands(),
        ]);

        setProfile(profileData);
        setFarmlands(farmlandsData ?? []);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description:
            error?.message || "Failed to fetch dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalFarmlands = farmlands.length;
  const approvedFarmlands = farmlands.filter(
    (f) => f.status?.toLowerCase() === "approved"
  ).length;
  const pendingFarmlands = farmlands.filter(
    (f) => f.status?.toLowerCase() === "pending"
  ).length;

  // area is a string in API, so convert safely
  const totalArea = farmlands.reduce(
    (sum, f) => sum + Number(f.area || 0),
    0
  );

  if (isLoading) {
    return (
      <DashboardLayout navItems={navItems} userType="farmer" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const firstName =
    profile?.name && profile.name.trim().length > 0
      ? profile.name.split(" ")[0]
      : "Farmer";

  return (
    <DashboardLayout
      navItems={navItems}
      userType="farmer"
      userName={profile?.name || "Farmer"}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your farm&apos;s carbon credit activity
          </p>
        </div>

        {/* Account Status Alert */}
        {profile?.status?.toLowerCase() === "pending" && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">Account Under Review</p>
                <p className="text-sm text-muted-foreground">
                  Your account is being verified by our admin team. You&apos;ll be
                  notified once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Farmlands"
            value={totalFarmlands.toString()}
            subtitle="Registered farms"
            icon={Leaf}
            variant="primary"
          />
          <StatsCard
            title="Approved Farmlands"
            value={approvedFarmlands.toString()}
            subtitle="Verified and active"
            icon={CheckCircle}
            trend={{
              value: totalFarmlands
                ? Math.round((approvedFarmlands / totalFarmlands) * 100)
                : 0,
              isPositive: true,
            }}
          />
          <StatsCard
            title="Pending Verification"
            value={pendingFarmlands.toString()}
            subtitle="Under review"
            icon={Clock}
            variant="accent"
          />
          <StatsCard
            title="Total Area"
            value={`${totalArea}`}
            subtitle="Acres registered"
            icon={TrendingUp}
            variant="secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Farmlands Overview */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-foreground">
                Your Farmlands
              </h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/farmer/farmlands">View All</Link>
              </Button>
            </div>

            {farmlands.length === 0 ? (
              <div className="text-center py-12">
                <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-foreground font-medium mb-2">
                  No farmlands registered yet
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Start by uploading your first farmland documentation
                </p>
                <Button variant="default" asChild>
                  <Link to="/farmer/upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {farmlands.slice(0, 3).map((farmland) => (
                  <div
                    key={farmland._id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    {farmland.images && farmland.images.length > 0 ? (
                      <img
                        src={farmland.images[0]}
                        alt={farmland.landName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {farmland.landName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {farmland.location}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {farmland.area} acres
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {farmland.landType}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={farmland.status || "pending"} />
                  </div>
                ))}

                {farmlands.length > 3 && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/farmer/farmlands">
                      View all {farmlands.length} farmlands
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {/* Status Breakdown */}
            {totalFarmlands > 0 && (
              <div className="border-t border-border pt-6 mt-6">
                <h3 className="font-medium text-foreground mb-4">
                  Verification Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Approved</span>
                      <span className="font-medium text-foreground">
                        {approvedFarmlands} of {totalFarmlands}
                      </span>
                    </div>
                    <Progress
                      value={
                        totalFarmlands
                          ? (approvedFarmlands / totalFarmlands) * 100
                          : 0
                      }
                      className="h-2 bg-success/20"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium text-foreground">
                        {pendingFarmlands} of {totalFarmlands}
                      </span>
                    </div>
                    <Progress
                      value={
                        totalFarmlands
                          ? (pendingFarmlands / totalFarmlands) * 100
                          : 0
                      }
                      className="h-2 bg-warning/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Account Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full justify-start" asChild>
                  <Link to="/farmer/upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Farmland
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/farmer/farmlands">
                    <Leaf className="w-4 h-4 mr-2" />
                    View All Farmlands
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/farmer/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Account Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <StatusBadge status={profile?.status || "pending"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">{profile?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="text-foreground capitalize">
                    {profile?.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check our documentation or contact support for assistance with
                verification.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
