import { useState, useEffect } from "react";
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
    Clock,
    MapPin,
    Loader2,
    Search,
    TrendingUp,
    User,
    Building
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

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

export default function AdminPayouts() {
    const [payouts, setPayouts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ totalPayouts: 0, totalTransactions: 0 });
    const debouncedSearch = useDebounce(search, 500);

    const fetchPayouts = async () => {
        setIsLoading(true);
        try {
            const response = await adminAPI.getAllPayouts(page, 10, debouncedSearch);
            if (response.wallets) {
                setPayouts(response.wallets);
                setTotalPages(response.pagination?.pages || 1);
                setStats(response.stats || { totalPayouts: 0, totalTransactions: 0 });
            }
        } catch (error) {
            console.error("Error fetching payouts:", error);
            toast({
                title: "Error",
                description: "Failed to fetch payouts",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, [page, debouncedSearch]);

    return (
        <DashboardLayout
            navItems={adminNavItems}
            userType="admin"
            >
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Payout Management</h1>
                    <p className="text-muted-foreground mt-2">Track farmer earnings and company purchases.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats.totalPayouts.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total amount paid to farmers</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                            <p className="text-xs text-muted-foreground">Number of payout transactions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payouts Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Payout Transactions</CardTitle>
                                <CardDescription>
                                    Complete history of farmer earnings from carbon credit sales.
                                </CardDescription>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by farmer name..."
                                    className="pl-8 w-[250px]"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Farmer</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payouts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    No payout transactions found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            payouts.map((payout) => (
                                                <TableRow key={payout._id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-muted-foreground" />
                                                            <div>
                                                                <div className="font-medium">{payout.farmerId?.name || 'N/A'}</div>
                                                                <div className="text-xs text-muted-foreground">{payout.farmerId?.email || ''}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Building className="w-4 h-4 text-muted-foreground" />
                                                            <div>
                                                                <div className="text-sm">{payout.transactionId?.companyId?.name || 'N/A'}</div>
                                                                <div className="text-xs text-muted-foreground">{payout.transactionId?.companyId?.email || ''}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-semibold text-green-600">₹{payout.amount.toLocaleString()}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={payout.type === 'credit' ? 'default' : 'secondary'}>
                                                            {payout.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(payout.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {payout.description || 'Carbon credit sale'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Completed
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <div className="text-sm text-muted-foreground">
                                        Page {page} of {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
