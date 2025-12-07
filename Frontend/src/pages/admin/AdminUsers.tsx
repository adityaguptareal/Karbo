import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    Users,
    FileCheck,
    BarChart,
    Settings,
    Database,
    Search,
    MoreVertical,
    Shield,
    UserCheck,
    UserX,
    DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const adminNavItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Verifications", href: "/admin/verification", icon: FileCheck },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart },
    { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
    { label: "API Features", href: "/admin/api-features", icon: Database },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Farmer", status: "Active", joined: "2023-10-15" },
    { id: 2, name: "Acme Corp", email: "contact@acme.com", role: "Company", status: "Active", joined: "2023-11-02" },
    { id: 3, name: "Jane Smith", email: "jane@example.com", role: "Farmer", status: "Pending", joined: "2023-12-01" },
    { id: 4, name: "Global Tech", email: "info@globaltech.com", role: "Company", status: "Suspended", joined: "2023-09-20" },
    { id: 5, name: "Mike Johnson", email: "mike@example.com", role: "Farmer", status: "Active", joined: "2023-11-15" },
];

export default function AdminUsers() {
    return (
        <DashboardLayout
            navItems={adminNavItems}
            userType="admin"
            userName="System Admin"
        >
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground">User Management</h1>
                        <p className="text-muted-foreground mt-2">Manage user accounts and permissions.</p>
                    </div>
                    <Button>
                        <Shield className="w-4 h-4 mr-2" />
                        Add Admin User
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>All Users</CardTitle>
                                <CardDescription>
                                    A list of all registered users including farmers and companies.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search users..."
                                        className="pl-8 w-[250px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                user.role === 'Farmer' ? 'border-green-500 text-green-500' : 'border-blue-500 text-blue-500'
                                            }>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                user.status === 'Active' ? 'default' :
                                                    user.status === 'Pending' ? 'secondary' :
                                                        'destructive'
                                            }>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.joined}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status !== 'Active' && (
                                                        <DropdownMenuItem className="text-green-600">
                                                            <UserCheck className="w-4 h-4 mr-2" />
                                                            Activate User
                                                        </DropdownMenuItem>
                                                    )}
                                                    {user.status !== 'Suspended' && (
                                                        <DropdownMenuItem className="text-red-600">
                                                            <UserX className="w-4 h-4 mr-2" />
                                                            Suspend User
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
