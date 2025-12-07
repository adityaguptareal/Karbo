import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    Users,
    FileCheck,
    BarChart,
    Settings,
    Database,
    DollarSign,
    CheckCircle,
    Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const adminNavItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Verifications", href: "/admin/verification", icon: FileCheck },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart },
    { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
    { label: "API Features", href: "/admin/api-features", icon: Database },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

const payouts = [
    { id: 1, farmer: "John Doe", amount: 1200, month: "November 2023", status: "Pending", date: "2023-12-01" },
    { id: 2, farmer: "Mike Johnson", amount: 850, month: "November 2023", status: "Paid", date: "2023-12-01" },
    { id: 3, farmer: "Sarah Wilson", amount: 2100, month: "November 2023", status: "Pending", date: "2023-12-01" },
    { id: 4, farmer: "Green Valley Farm", amount: 3500, month: "October 2023", status: "Paid", date: "2023-11-01" },
];

export default function AdminPayouts() {
    return (
        <DashboardLayout
            navItems={adminNavItems}
            userType="admin"
            userName="System Admin"
        >
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Payout Management</h1>
                    <p className="text-muted-foreground mt-2">Manage monthly payouts to farmers.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Payouts</CardTitle>
                        <CardDescription>
                            Review and process pending payouts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Month</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date Generated</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payouts.map((payout) => (
                                    <TableRow key={payout.id}>
                                        <TableCell className="font-medium">{payout.farmer}</TableCell>
                                        <TableCell>{payout.month}</TableCell>
                                        <TableCell>${payout.amount.toLocaleString()}</TableCell>
                                        <TableCell>{payout.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={payout.status === 'Paid' ? 'default' : 'secondary'}>
                                                {payout.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {payout.status === 'Pending' && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Mark Paid
                                                </Button>
                                            )}
                                            {payout.status === 'Paid' && (
                                                <span className="text-muted-foreground text-sm flex items-center justify-end">
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Completed
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
