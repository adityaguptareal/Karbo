import { useState, useEffect } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { dashboardService } from "@/services/dashboardService";
import { transactionService } from "@/services/transactionService";
import { authService } from "@/services/authService";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Download,
  Leaf,
  TreePine,
  Car,
  Factory,
  Lightbulb,
  TrendingUp,
  Award,
  Users,
  Loader2,
  AlertCircle,
  Share2,
  FileCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Documents Verification", href: "/company/documents", icon: FileCheck },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

interface ImpactData {
  totalPurchases: number;
  purchasedCredits: number;
  totalSpent: number;
  treesEquivalent: number;
  carsRemoved: number;
  homesEnergy: number;
  farmersSupported: number;
}

const CompanyImpactReport = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getCompanyDashboard();
      
      if (response.data) {
        const { totalPurchases, purchasedCredits, totalSpent } = response.data;

        // Calculate environmental equivalents
        const treesEquivalent = Math.round(purchasedCredits * 50); // 1 credit = ~50 trees
        const carsRemoved = Math.round(purchasedCredits / 4.6); // 1 car = ~4.6 tons CO2/year
        const homesEnergy = Math.round(purchasedCredits / 7.5); // 1 home = ~7.5 tons CO2/year
        
        // For farmers supported, we'll fetch from transactions
        let farmersSupported = 0;
        try {
          const transactionResponse = await transactionService.getCompanyTransactions({ limit: 100 });
          if (transactionResponse.transactions) {
            const uniqueFarmers = new Set(
              transactionResponse.transactions.map((t: any) => t.farmerId?._id)
            );
            farmersSupported = uniqueFarmers.size;
          }
        } catch (err) {
          console.error('Error fetching farmers:', err);
        }

        setImpactData({
          totalPurchases,
          purchasedCredits,
          totalSpent,
          treesEquivalent,
          carsRemoved,
          homesEnergy,
          farmersSupported,
        });
      }
    } catch (err: any) {
      console.error('Impact data error:', err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Failed to load impact data';
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

  const handleDownloadReport = () => {
    toast({
      title: "Generating Report",
      description: "Your sustainability report is being prepared for download.",
    });
    // TODO: Implement PDF generation
  };

  const handleShareReport = () => {
    toast({
      title: "Share Report",
      description: "Share functionality coming soon!",
    });
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading impact report...</p>
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
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Report</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchImpactData}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const impactMetrics = [
    {
      icon: TreePine,
      label: "Trees Planted",
      value: impactData?.treesEquivalent.toLocaleString() || "0",
      description: "Equivalent environmental impact",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: Car,
      label: "Cars Removed",
      value: impactData?.carsRemoved.toLocaleString() || "0",
      description: "From roads annually",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: Lightbulb,
      label: "Homes Powered",
      value: impactData?.homesEnergy.toLocaleString() || "0",
      description: "Annual energy equivalent",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      icon: Users,
      label: "Farmers Supported",
      value: impactData?.farmersSupported.toLocaleString() || "0",
      description: "Sustainable livelihood created",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Environmental Impact Report
            </h1>
            <p className="text-muted-foreground">
              Track your contribution to a sustainable future
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShareReport}>
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleDownloadReport}
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Main Impact Card */}
        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                  <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Total CO₂ Offset</h2>
                  <p className="text-muted-foreground">Your carbon neutrality contribution</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white px-4 py-2 text-lg">
                Verified
              </Badge>
            </div>
            
            <div className="text-center py-8">
              <p className="text-6xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {impactData?.purchasedCredits || 0}
              </p>
              <p className="text-2xl text-muted-foreground">tons of CO₂</p>
              <p className="text-sm text-muted-foreground mt-4">
                From {impactData?.totalPurchases || 0} verified transactions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((metric) => (
            <Card key={metric.label} className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm font-medium text-foreground mb-1">
                  {metric.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investment Breakdown */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Investment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Total Investment</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{impactData?.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Credits Purchased</span>
                  <span className="text-lg font-bold">
                    {impactData?.purchasedCredits || 0} tons
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Average Price/Credit</span>
                  <span className="text-lg font-bold">
                    ₹{impactData?.purchasedCredits 
                      ? ((impactData.totalSpent || 0) / impactData.purchasedCredits).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Transactions</span>
                  <span className="text-lg font-bold">
                    {impactData?.totalPurchases || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Sustainability Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Carbon Neutral Contributor</p>
                  <p className="text-xs text-muted-foreground">Offset {impactData?.purchasedCredits}+ tons CO₂</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Community Supporter</p>
                  <p className="text-xs text-muted-foreground">Supporting {impactData?.farmersSupported} farmers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Factory className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sustainable Business</p>
                  <p className="text-xs text-muted-foreground">ESG compliance active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {impactData && impactData.purchasedCredits === 0 && (
          <Card className="border border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Leaf className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Impact Journey</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Purchase carbon credits to offset your emissions and support sustainable farming practices.
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

        {/* Comparison Info */}
        <Card className="border border-border bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Understanding Your Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-background rounded-lg">
                <p className="font-medium text-foreground mb-2">🌳 Trees Planted</p>
                <p className="text-muted-foreground">
                  One carbon credit offsets approximately 50 trees' annual carbon absorption capacity.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="font-medium text-foreground mb-2">🚗 Cars Removed</p>
                <p className="text-muted-foreground">
                  Average car produces ~4.6 tons of CO₂ per year. Your credits equal removing cars from roads.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="font-medium text-foreground mb-2">⚡ Homes Powered</p>
                <p className="text-muted-foreground">
                  Average home produces ~7.5 tons of CO₂ annually from energy consumption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanyImpactReport;
