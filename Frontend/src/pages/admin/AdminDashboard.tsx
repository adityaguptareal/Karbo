import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { platformStats, verificationRequests, farmers, companies, transactions } from "@/data/mockData";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  BarChart3,
  Settings,
  DollarSign,
  Leaf,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Verification", href: "/admin/verification", icon: FileCheck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminDashboard = () => {
  const pendingVerifications = verificationRequests.filter(v => v.status === 'pending');
  const underReviewVerifications = verificationRequests.filter(v => v.status === 'under_review');
  const recentTransactions = transactions.slice(0, 5);

  const priorityColors = {
    high: 'bg-destructive/10 text-destructive',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-muted text-muted-foreground',
  };

  return (
    <DashboardLayout navItems={navItems} userType="admin" userName="Admin User">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${(platformStats.totalTransactionValue / 1000).toFixed(0)}K`}
            subtitle="All time"
            icon={DollarSign}
            variant="primary"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Credits Traded"
            value={platformStats.totalCreditsTraded.toLocaleString()}
            subtitle="Total credits"
            icon={Leaf}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="Active Users"
            value={(platformStats.activeFarmers + platformStats.activeCompanies).toLocaleString()}
            subtitle={`${platformStats.activeFarmers} farmers, ${platformStats.activeCompanies} companies`}
            icon={Users}
            variant="secondary"
          />
          <StatsCard
            title="Pending Verifications"
            value={pendingVerifications.length + underReviewVerifications.length}
            subtitle="Needs attention"
            icon={Clock}
            variant="accent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Verification Queue */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Verification Queue</h2>
                <p className="text-sm text-muted-foreground">{pendingVerifications.length + underReviewVerifications.length} items need review</p>
              </div>
              <Button variant="default" asChild>
                <Link to="/admin/verification">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              {verificationRequests.slice(0, 4).map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{request.farmerName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[request.priority]}`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.documentType} • {request.submittedDate}</p>
                  </div>
                  <StatusBadge status={request.status} />
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {pendingVerifications.length === 0 && underReviewVerifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="w-12 h-12 text-success mb-4" />
                <p className="text-foreground font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground">No pending verifications</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* User Breakdown */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">User Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Farmers</span>
                  <span className="font-semibold text-foreground">{platformStats.activeFarmers}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(platformStats.activeFarmers / (platformStats.activeFarmers + platformStats.activeCompanies)) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Companies</span>
                  <span className="font-semibold text-foreground">{platformStats.activeCompanies}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full" 
                    style={{ width: `${(platformStats.activeCompanies / (platformStats.activeFarmers + platformStats.activeCompanies)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-warning/5 rounded-xl border border-warning/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-foreground">Alerts</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                  {pendingVerifications.filter(v => v.priority === 'high').length} high priority verifications
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  3 new user registrations today
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-foreground">Recent Transactions</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-mono text-muted-foreground">{transaction.id}</td>
                    <td className="py-3 px-4 text-sm capitalize text-foreground">{transaction.type}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{transaction.description}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">${transaction.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" size="lg" className="h-auto py-6" asChild>
            <Link to="/admin/verification" className="flex flex-col items-center gap-2">
              <FileCheck className="w-6 h-6" />
              <span>Review Verifications</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-6" asChild>
            <Link to="/admin/users" className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-6" asChild>
            <Link to="/admin/analytics" className="flex flex-col items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>View Analytics</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-6" asChild>
            <Link to="/admin/settings" className="flex flex-col items-center gap-2">
              <Settings className="w-6 h-6" />
              <span>Platform Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
