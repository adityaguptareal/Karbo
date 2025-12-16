import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  BarChart,
  Settings,
  Database,
  Server,
  Activity,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Verifications", href: "/admin/verification", icon: FileCheck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Farmlands", href: "/admin/farmlands", icon: MapPin },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart },
  { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
  { label: "API Features", href: "/admin/api-features", icon: Database },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface DashboardStats {
  totalFarmers: number;
  totalCompanies: number;
  pendingUsers: number;
  pendingFarmlands: number;
  totalRevenue: number;
  systemHealth: string;
  activeNodes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFarmers: 0,
    totalCompanies: 0,
    pendingUsers: 0,
    pendingFarmlands: 0,
    totalRevenue: 0,
    systemHealth: "99.9%",
    activeNodes: 8
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const result = await adminAPI.getDashboardStats();
      //console.log("This is my Data:", result.data);
      if (result.data) {
        setStats({
          totalFarmers: result.data.totalFarmers || 0,
          totalCompanies: result.data.totalCompanies || 0,
          pendingUsers: result.data.pendingUsers || 0,
          pendingFarmlands: result.data.pendingFarmlands || 0,
          totalRevenue: result.data.revenue || 0,
          systemHealth: "99.9%",
          activeNodes: 8
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard stats",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const apiFeatures = [
    { name: "Carbon Credit Verification", status: "active", endpoint: "/api/v1/verify", latency: "45ms" },
    { name: "User Authentication", status: "active", endpoint: "/api/v1/auth", latency: "120ms" },
    { name: "Marketplace Transactions", status: "active", endpoint: "/api/v1/market", latency: "85ms" },
    { name: "IoT Data Ingestion", status: "warning", endpoint: "/api/v1/iot/ingest", latency: "350ms" },
    { name: "Report Generation", status: "inactive", endpoint: "/api/v1/reports", latency: "-" },
  ];

  return (
    <DashboardLayout
      navItems={adminNavItems}
      userType="admin"
      >
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin Overview</h1>
          <p className="text-muted-foreground mt-2">Monitor system health, verifications, and revenue.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFarmers}</div>
              <p className="text-xs text-muted-foreground">Registered Farmers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">Registered Companies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingUsers + stats.pendingFarmlands}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingUsers} Users, {stats.pendingFarmlands} Farmlands</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ {stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Total Platform Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* API Features Mapping Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>API Features Map</CardTitle>
              <CardDescription>
                Overview of mapped API endpoints and their current operational status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${feature.status === 'active' ? 'bg-green-500/10 text-green-500' :
                        feature.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{feature.endpoint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">Latency</p>
                        <p className="text-xs text-muted-foreground">{feature.latency}</p>
                      </div>
                      <Badge variant={
                        feature.status === 'active' ? 'default' :
                          feature.status === 'warning' ? 'secondary' :
                            'destructive'
                      }>
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/verification'}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Review Pending Verifications
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/users'}>
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                View Error Logs
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Backup Database
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
