import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardService } from "@/services/dashboardService";
import { authService } from "@/services/authService";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  Leaf,
  DollarSign,
  Package,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

interface DashboardData {
  totalPurchases: number;
  purchasedCredits: number;
  totalSpent: number;
}

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getCompanyDashboard();
      
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Failed to load dashboard data';
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

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
        userName={currentUser?.name || "Company User"}
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
        userName={currentUser?.name || "Company User"}
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Total Purchases",
      value: dashboardData?.totalPurchases || 0,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "Carbon credit transactions",
    },
    {
      title: "Carbon Credits Owned",
      value: `${dashboardData?.purchasedCredits || 0}`,
      icon: Leaf,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      description: "Total credits purchased",
    },
    {
      title: "Total Investment",
      value: `₹${(dashboardData?.totalSpent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: "Amount spent on credits",
    },
    {
      title: "CO₂ Offset",
      value: `${dashboardData?.purchasedCredits || 0} tons`,
      icon: Activity,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      description: "Environmental impact",
    },
  ];

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
              Company Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your sustainability overview.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate('/company/marketplace')}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Browse Marketplace
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-start gap-2"
                onClick={() => navigate('/company/marketplace')}
              >
                <ShoppingCart className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Browse Credits</p>
                  <p className="text-xs text-muted-foreground">
                    Explore verified carbon credits
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-start gap-2"
                onClick={() => navigate('/company/purchases')}
              >
                <FileText className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">View Purchases</p>
                  <p className="text-xs text-muted-foreground">
                    See transaction history
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-start gap-2"
                onClick={() => navigate('/company/impact')}
              >
                <BarChart3 className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Impact Report</p>
                  <p className="text-xs text-muted-foreground">
                    View sustainability metrics
                  </p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Impact Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ Offset</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {dashboardData?.purchasedCredits || 0} tons
                  </p>
                </div>
                <Activity className="w-12 h-12 text-emerald-600 dark:text-emerald-400 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your carbon offset is equivalent to planting approximately{" "}
                <span className="font-semibold text-foreground">
                  {((dashboardData?.purchasedCredits || 0) * 50).toLocaleString()}
                </span>{" "}
                trees or removing{" "}
                <span className="font-semibold text-foreground">
                  {Math.round((dashboardData?.purchasedCredits || 0) / 4.6)}
                </span>{" "}
                cars from the road for a year.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Purchase Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Transactions</span>
                  <span className="font-semibold">{dashboardData?.totalPurchases || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average per Transaction</span>
                  <span className="font-semibold">
                    ₹{dashboardData?.totalPurchases 
                      ? ((dashboardData.totalSpent || 0) / dashboardData.totalPurchases).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Credits per Transaction</span>
                  <span className="font-semibold">
                    {dashboardData?.totalPurchases
                      ? Math.round((dashboardData.purchasedCredits || 0) / dashboardData.totalPurchases)
                      : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Data Message */}
        {dashboardData?.totalPurchases === 0 && (
          <Card className="border border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Purchases Yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start making an impact by purchasing verified carbon credits from sustainable farms.
              </p>
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate('/company/marketplace')}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
