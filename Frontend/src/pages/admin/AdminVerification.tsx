import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileCheck,
    BarChart,
    Settings,
    Database,
    CheckCircle,
    XCircle,
    Eye,
    FileText,
    DollarSign,
    User,
    Building,
    Tractor,
    Loader2,
    MapPin,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const adminNavItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Verifications", href: "/admin/verification", icon: FileCheck },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart },
    { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
    { label: "API Features", href: "/admin/api-features", icon: Database },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminVerification() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [allItems, setAllItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [filterType, setFilterType] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Stats
    const [stats, setStats] = useState({
        farmlands: 0,
        farmers: 0,
        companies: 0
    });

    // Rejection State
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [itemToReject, setItemToReject] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, farmlandsRes] = await Promise.all([
                adminAPI.getPendingUsers(),
                adminAPI.getPendingFarmlands()
            ]);

            const users = usersRes.users || usersRes.data || (Array.isArray(usersRes) ? usersRes : []);
            const farms = farmlandsRes.farmlands || farmlandsRes.data || (Array.isArray(farmlandsRes) ? farmlandsRes : []);

            const farmers = users.filter((u: any) => u.role === 'farmer').map((u: any) => ({ ...u, type: 'farmer' }));
            const companies = users.filter((u: any) => u.role === 'company').map((u: any) => ({ ...u, type: 'company' }));
            const farmlands = farms.map((f: any) => ({ ...f, type: 'farmland' }));

            setStats({
                farmlands: farmlands.length,
                farmers: farmers.length,
                companies: companies.length
            });

            const combined = [...farmlands, ...farmers, ...companies];
            // Sort by date descending (newest first)
            combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setAllItems(combined);
            setFilteredItems(combined);

        } catch (error) {
            console.error("Error fetching verification data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch pending requests",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let result = allItems;

        // Apply type filter
        if (filterType !== "all") {
            result = result.filter(item => item.type === filterType);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => {
                const name = item.name?.toLowerCase() || item.landName?.toLowerCase() || "";
                const email = item.email?.toLowerCase() || "";
                const ownerName = item.farmerId?.name?.toLowerCase() || "";

                return name.includes(query) || email.includes(query) || ownerName.includes(query);
            });
        }

        setFilteredItems(result);
        setCurrentPage(1); // Reset to first page on filter change
    }, [filterType, searchQuery, allItems]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleApprove = async (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        try {
            if (item.type === 'farmland') {
                await adminAPI.approveFarmland(item._id);
                toast({ title: "Success", description: "Farmland approved successfully" });
            } else {
                await adminAPI.approveUser(item._id);
                toast({ title: "Success", description: "User approved successfully" });
            }
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to approve request", variant: "destructive" });
        }
    };

    const handleRejectClick = (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        setItemToReject(item);
        setRejectionReason("");
        setIsRejectDialogOpen(true);
    };

    const confirmReject = async () => {
        if (!itemToReject) return;
        if (!rejectionReason.trim()) {
            toast({ title: "Error", description: "Please provide a reason for rejection", variant: "destructive" });
            return;
        }

        setIsRejecting(true);
        try {
            if (itemToReject.type === 'farmland') {
                await adminAPI.rejectFarmland(itemToReject._id, rejectionReason);
                toast({ title: "Success", description: "Farmland rejected successfully" });
            } else {
                await adminAPI.rejectUser(itemToReject._id, rejectionReason);
                toast({ title: "Success", description: "User rejected successfully" });
            }
            setIsRejectDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to reject request", variant: "destructive" });
        } finally {
            setIsRejecting(false);
        }
    };

    const renderItemCard = (item: any) => {
        let icon, title, subtitle, details;

        if (item.type === 'farmland') {
            icon = <Tractor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
            title = item.landName;
            subtitle = (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {item.farmerId?.name || "Unknown Owner"}</span>
                    <span>•</span>
                    <span>{item.area} Acres</span>
                    <span>•</span>
                    <span>{item.landType || "Unknown Type"}</span>
                </div>
            );
            details = (
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {item.location}
                </div>
            );
        } else if (item.type === 'farmer') {
            icon = <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            title = item.name;
            subtitle = (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {item.email}</span>
                </div>
            );
        } else {
            icon = <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
            title = item.name;
            subtitle = (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {item.email}</span>
                </div>
            );
        }

        return (
            <Card
                key={item._id}
                className="mb-2 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/verification/${item.type}/${item._id}`)}
            >
                <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.type === 'farmland' ? 'bg-emerald-100 dark:bg-emerald-900/20' :
                                item.type === 'farmer' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                    'bg-purple-100 dark:bg-purple-900/20'
                            }`}>
                            {icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm">{title}</h3>
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 uppercase">
                                    {item.type}
                                </Badge>
                            </div>
                            {subtitle}
                            {details}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-[10px] text-muted-foreground mr-2 hidden sm:block">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={(e) => handleApprove(e, item)}>
                            <CheckCircle className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={(e) => handleRejectClick(e, item)}>
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <DashboardLayout
            navItems={adminNavItems}
            userType="admin"
            userName="System Admin"
        >
            <div className="space-y-4 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-foreground">Verifications</h1>
                        <p className="text-sm text-muted-foreground">Manage pending requests.</p>
                    </div>

                    {/* Compact Stats */}
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5 shadow-sm">
                            <Tractor className="w-4 h-4 text-emerald-600" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Farmlands</span>
                                <span className="text-sm font-bold leading-none">{stats.farmlands}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5 shadow-sm">
                            <User className="w-4 h-4 text-blue-600" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Farmers</span>
                                <span className="text-sm font-bold leading-none">{stats.farmers}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5 shadow-sm">
                            <Building className="w-4 h-4 text-purple-600" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Companies</span>
                                <span className="text-sm font-bold leading-none">{stats.companies}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and List Section */}
                <div className="flex flex-col gap-3 flex-1 min-h-0 bg-card border rounded-xl p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-2 border-b">
                        <h2 className="text-lg font-semibold">Pending Requests ({filteredItems.length})</h2>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 h-9 text-sm"
                                />
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[140px] h-9 text-sm">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="farmland">Farmlands</SelectItem>
                                    <SelectItem value="farmer">Farmers</SelectItem>
                                    <SelectItem value="company">Companies</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto pr-2">
                        {isLoading ? (
                            <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
                        ) : paginatedItems.length > 0 ? (
                            <div className="space-y-2">
                                {paginatedItems.map(renderItemCard)}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                                <FileCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No pending requests found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2 border-t mt-auto">
                            <div className="text-xs text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Reject Request
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject this request? This action cannot be undone.
                            Please provide a reason for the rejection.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="reason" className="mb-2 block">Rejection Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="Enter reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isRejecting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmReject} disabled={isRejecting || !rejectionReason.trim()}>
                            {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
