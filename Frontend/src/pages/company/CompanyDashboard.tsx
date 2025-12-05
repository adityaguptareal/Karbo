import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { CreditCard } from "@/components/shared/CreditCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { companies, carbonCredits, transactions } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  BarChart3,
  Settings,
  Leaf,
  Globe,
  DollarSign,
  TrendingUp,
  Download,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const currentCompany = companies[1];

const CompanyDashboard = () => {
  const recentCredits = carbonCredits.slice(0, 3);
  const recentPurchases = transactions.filter(t => t.type === 'purchase').slice(0, 3);
  
  // Sustainability goal progress (example)
  const sustainabilityGoal = 10000; // tons CO2
  const currentOffset = currentCompany.co2Offset;
  const goalProgress = (currentOffset / sustainabilityGoal) * 100;

  return (
    <DashboardLayout navItems={navItems} userType="company" userName={currentCompany.name}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Company Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your carbon offset progress and browse new credits
            </p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/marketplace">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="CO₂ Offset"
            value={`${(currentCompany.co2Offset / 1000).toFixed(1)}K`}
            subtitle="Tons offset"
            icon={Globe}
            variant="primary"
            trend={{ value: 15.3, isPositive: true }}
          />
          <StatsCard
            title="Credits Purchased"
            value={currentCompany.totalPurchased.toLocaleString()}
            subtitle="Total credits"
            icon={Leaf}
            variant="secondary"
          />
          <StatsCard
            title="Total Investment"
            value={`$${(currentCompany.totalSpent / 1000).toFixed(0)}K`}
            subtitle="In carbon credits"
            icon={DollarSign}
          />
          <StatsCard
            title="Trees Equivalent"
            value={(currentCompany.co2Offset * 50).toLocaleString()}
            subtitle="Trees planted equiv."
            icon={TrendingUp}
            variant="accent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sustainability Goal */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Sustainability Goal 2024</h2>
                <p className="text-sm text-muted-foreground">Annual carbon offset target</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl mb-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Progress</p>
                  <p className="text-4xl font-bold text-foreground">
                    {currentOffset.toLocaleString()}
                    <span className="text-lg font-normal text-muted-foreground"> / {sustainabilityGoal.toLocaleString()} tons</span>
                  </p>
                </div>
                <p className="text-2xl font-bold text-primary">{goalProgress.toFixed(0)}%</p>
              </div>
              <Progress value={goalProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-3">
                {sustainabilityGoal - currentOffset > 0 
                  ? `${(sustainabilityGoal - currentOffset).toLocaleString()} tons remaining to reach your goal`
                  : "Congratulations! You've reached your goal!"
                }
              </p>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{currentCompany.co2Offset}</p>
                <p className="text-sm text-muted-foreground">Tons CO₂ Offset</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{Math.round(currentCompany.co2Offset * 2.5)}</p>
                <p className="text-sm text-muted-foreground">Cars Off Road (equiv.)</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{Math.round(currentCompany.co2Offset * 50)}</p>
                <p className="text-sm text-muted-foreground">Trees Planted (equiv.)</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full justify-between" asChild>
                  <Link to="/marketplace">
                    Browse Credits
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/company/purchases">
                    View Purchases
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/company/impact">
                    Impact Report
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-success/10 rounded-xl border border-success/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Compliance Status</p>
                  <p className="text-sm text-success">On Track</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You're on track to meet your 2024 sustainability compliance requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Credits */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-lg text-foreground">Featured Credits</h2>
              <p className="text-sm text-muted-foreground">Hand-picked credits matching your sustainability goals</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/marketplace">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCredits.map(credit => (
              <CreditCard key={credit.id} credit={credit} viewMode="grid" />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
