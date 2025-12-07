import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    DollarSign,
    Loader2,
    Filter,
    MapPin,
    Maximize
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export default function AdminFarmlands() {
    const navigate = useNavigate();
    const [farmlands, setFarmlands] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const debouncedSearch = useDebounce(search, 500);

    const fetchFarmlands = async () => {
        setIsLoading(true);
        try {
            const response = await adminAPI.getAllFarmlands(page, 10, debouncedSearch, statusFilter);
            if (response.farmlands) {
                setFarmlands(response.farmlands);
                setTotalPages(response.pagination?.pages || 1);
            }
        } catch (error) {
            console.error("Error fetching farmlands:", error);
            toast({
                title: "Error",
                description: "Failed to fetch farmlands",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmlands();
    }, [page, debouncedSearch, statusFilter]);

    const handleRowClick = (farmlandId: string) => {
        navigate(`/admin/farmlands/${farmlandId}`);
    };

    return (
        <DashboardLayout
            navItems={adminNavItems}
            userType="admin"
            >
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground">Farmland Management</h1>
                        <p className="text-muted-foreground mt-2">Manage all farmland listings and verifications.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>All Farmlands</CardTitle>
                                <CardDescription>
                                    A list of all registered farmlands with their verification status.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search farmlands..."
                                        className="pl-8 w-[250px]"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="verified">Verified</SelectItem>
                                        <SelectItem value="pending_verification">Pending</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                            <TableHead>Land Name</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Area</TableHead>
                                            <TableHead>Owner</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {farmlands.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    No farmlands found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            farmlands.map((farmland) => (
                                                <TableRow
                                                    key={farmland._id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => handleRowClick(farmland._id)}
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-green-600" />
                                                            <span className="font-medium">{farmland.landName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{farmland.location}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Maximize className="w-3 h-3" />
                                                            <span>{farmland.area} acres</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm">{farmland.farmerId?.name || 'N/A'}</span>
                                                            <span className="text-xs text-muted-foreground">{farmland.farmerId?.email || ''}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={
                                                            farmland.status === 'verified' ? 'default' :
                                                                farmland.status === 'pending_verification' ? 'secondary' :
                                                                    'destructive'
                                                        }>
                                                            {farmland.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{new Date(farmland.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleRowClick(farmland._id)}>
                                                                    View Details
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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
