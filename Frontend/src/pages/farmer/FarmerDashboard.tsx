import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { farmers, transactions, verificationRequests } from "@/data/mockData";
import { LayoutDashboard, Upload, Leaf, Wallet, FileText, Settings, TrendingUp, DollarSign, Clock, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
const navItems = [{
  label: "Dashboard",
  href: "/farmer/dashboard",
  icon: LayoutDashboard
}, {
  label: "Upload Documents",
  href: "/farmer/upload",
  icon: Upload
}, {
  label: "My Credits",
  href: "/farmer/credits",
  icon: Leaf
}, {
  label: "Wallet",
  href: "/farmer/wallet",
  icon: Wallet
}, {
  label: "Documents",
  href: "/farmer/documents",
  icon: FileText
}, {
  label: "Settings",
  href: "/farmer/settings",
  icon: Settings
}];
const currentFarmer = farmers[0];
const FarmerDashboard = () => {
  const recentTransactions = transactions.slice(0, 4);
  const pendingVerifications = verificationRequests.filter(v => v.status === 'pending' || v.status === 'under_review');
  return <DashboardLayout navItems={navItems} userType="farmer" userName={currentFarmer.name}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome back, {currentFarmer.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your farm's carbon credit activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Credits" value={currentFarmer.totalCredits.toLocaleString()} subtitle="Lifetime earned" icon={Leaf} variant="primary" />
          <StatsCard title="Available Credits" value={currentFarmer.creditsAvailable.toLocaleString()} subtitle="Ready to sell" icon={TrendingUp} trend={{
          value: 8.5,
          isPositive: true
        }} />
          <StatsCard title="Credits Sold" value={currentFarmer.creditsSold.toLocaleString()} subtitle="Total sold" icon={DollarSign} variant="secondary" />
          <StatsCard title="Pending Verification" value={pendingVerifications.length} subtitle="Documents in review" icon={Clock} variant="accent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credits Overview */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-foreground">Credits Overview</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/farmer/credits">View All</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-primary/5 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Available for Sale</p>
                <p className="text-3xl font-bold text-primary">{currentFarmer.creditsAvailable}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">of {currentFarmer.totalCredits} total</span>
                    <span className="font-medium">{Math.round(currentFarmer.creditsAvailable / currentFarmer.totalCredits * 100)}%</span>
                  </div>
                  <Progress value={currentFarmer.creditsAvailable / currentFarmer.totalCredits * 100} className="h-2" />
                </div>
              </div>
              
              <div className="p-4 bg-secondary/5 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
                <p className="text-3xl font-bold text-secondary">
                  ${(currentFarmer.creditsAvailable * 19.5).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Based on avg. market price of  ₹195/credit
                </p>
              </div>
            </div>

            {/* Verification Status */}
            <div className="border-t border-border pt-6">
              <h3 className="font-medium text-foreground mb-4">Verification Queue</h3>
              {pendingVerifications.length > 0 ? <div className="space-y-3">
                  {pendingVerifications.slice(0, 2).map(verification => <div key={verification.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{verification.documentType}</p>
                          <p className="text-sm text-muted-foreground">Submitted {verification.submittedDate}</p>
                        </div>
                      </div>
                      <StatusBadge status={verification.status} />
                    </div>)}
                </div> : <div className="flex items-center gap-3 p-4 bg-success/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <p className="text-sm text-foreground">All documents verified!</p>
                </div>}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-foreground">Recent Activity</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/farmer/wallet">View All</Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentTransactions.map(transaction => <div key={transaction.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'sale' ? 'bg-success/10' : transaction.type === 'withdrawal' ? 'bg-accent/10' : 'bg-muted'}`}>
                    {transaction.type === 'sale' ? <ArrowUpRight className="w-5 h-5 text-success" /> : <ArrowDownRight className="w-5 h-5 text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${transaction.type === 'sale' ? 'text-success' : 'text-foreground'}`}>
                      {transaction.type === 'sale' ? '+' : '-'}${transaction.amount}
                    </p>
                    {transaction.credits && <p className="text-xs text-muted-foreground">{transaction.credits} credits</p>}
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="default" size="lg" className="h-auto py-6" asChild>
            <Link to="/farmer/upload" className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6" />
              <span>Upload Documents</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-6" asChild>
            <Link to="/farmer/credits" className="flex flex-col items-center gap-2">
              <Leaf className="w-6 h-6" />
              <span>View Credits</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-6" asChild>
            <Link to="/farmer/wallet" className="flex flex-col items-center gap-2">
              <Wallet className="w-6 h-6" />
              <span>Withdraw Earnings</span>
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>;
};
export default FarmerDashboard;