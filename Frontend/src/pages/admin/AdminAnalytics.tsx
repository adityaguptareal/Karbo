import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    Users,
    FileCheck,
    BarChart,
    Settings,
    Database,
    TrendingUp,
    DollarSign,
    Leaf,
    MapPin
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    AreaChart,
    Area
} from "recharts";

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

const userGrowthData = [
    { month: "Jan", farmers: 10, companies: 2 },
    { month: "Feb", farmers: 25, companies: 5 },
    { month: "Mar", farmers: 45, companies: 8 },
    { month: "Apr", farmers: 80, companies: 12 },
    { month: "May", farmers: 120, companies: 18 },
    { month: "Jun", farmers: 180, companies: 25 },
];

const revenueData = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 12000 },
    { month: "Mar", revenue: 25000 },
    { month: "Apr", revenue: 45000 },
    { month: "May", revenue: 60000 },
    { month: "Jun", revenue: 85000 },
];

const creditsData = [
    { month: "Jan", credits: 100 },
    { month: "Feb", credits: 300 },
    { month: "Mar", credits: 600 },
    { month: "Apr", credits: 1200 },
    { month: "May", credits: 2000 },
    { month: "Jun", credits: 3500 },
];

export default function AdminAnalytics() {
    return (
        <DashboardLayout
            navItems={adminNavItems}
            userType="admin"
            >
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Platform Analytics</h1>
                    <p className="text-muted-foreground mt-2">Detailed insights into platform performance.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                User Growth
                            </CardTitle>
                            <CardDescription>New farmers and companies registration trend</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="farmers" stroke="#22c55e" strokeWidth={2} name="Farmers" />
                                        <Line type="monotone" dataKey="companies" stroke="#3b82f6" strokeWidth={2} name="Companies" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Revenue Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                               
                                Revenue Growth
                            </CardTitle>
                            <CardDescription>Total platform revenue over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="revenue" fill="#22c55e" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Carbon Credits Traded */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-primary" />
                                Carbon Credits Traded
                            </CardTitle>
                            <CardDescription>Volume of carbon credits sold on the marketplace</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={creditsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="credits" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} name="Credits" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
