import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    Users,
    FileCheck,
    BarChart,
    Settings,
    Database,
    ArrowLeft,
    Mail,
    User,
    Building,
    Calendar,
    Shield,
    UserCheck,
    UserX,
    DollarSign,
    Loader2,
    MapPin,
    Phone,
    FileText,
    Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

export default function AdminUserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchUserDetails = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const result = await adminAPI.getUserDetails(id);
            setUser(result.user);
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast({
                title: "Error",
                description: "Failed to fetch user details",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const handleToggleBlock = async () => {
        if (!id) return;
        setIsProcessing(true);
        try {
            const response = await adminAPI.toggleBlockUser(id);
            toast({
                title: "Success",
                description: response.msg
            });
            setUser((prev: any) => ({ ...prev, isBlocked: response.user.isBlocked }));
            setIsBlockDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update user status",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout navItems={adminNavItems} userType="admin" >
                <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!user) {
        return (
            <DashboardLayout navItems={adminNavItems} userType="admin" >
                <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-muted-foreground">
                    <Users className="w-12 h-12 mb-4 opacity-50" />
                    <p>User not found</p>
                    <Button variant="link" onClick={() => navigate("/admin/users")}>
                        Back to Users
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout navItems={adminNavItems} userType="admin" >
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-foreground">
                            {user.name}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Badge variant="outline" className="uppercase">
                                {user.role}
                            </Badge>
                            <span>•</span>
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button
                            variant={user.isBlocked ? "default" : "destructive"}
                            onClick={() => setIsBlockDialogOpen(true)}
                            className={user.isBlocked ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                            {user.isBlocked ? (
                                <>
                                    <UserCheck className="w-4 h-4 mr-2" /> Unblock User
                                </>
                            ) : (
                                <>
                                    <UserX className="w-4 h-4 mr-2" /> Block User
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                                    <div className="flex items-center gap-2 mt-1 capitalize">
                                        {user.role === 'farmer' ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                                        <span>{user.role}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                                    <div className="mt-1">
                                        <Badge variant={
                                            user.status === 'verified' ? 'default' :
                                                user.status === 'pending_verification' ? 'secondary' :
                                                    'destructive'
                                        }>
                                            {user.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                    <div className="mt-1">
                                        {user.isBlocked ? (
                                            <Badge variant="destructive">Blocked</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Additional Info based on role */}
                            {user.role === 'company' && user.companyDocuments && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Company Documents</h3>
                                    {user.companyDocuments.length > 0 ? (
                                        <div className="space-y-2">
                                            {user.companyDocuments.map((doc: string, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-primary" />
                                                        <span className="text-sm font-medium">Document {idx + 1}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={doc} target="_blank" rel="noopener noreferrer">
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No documents uploaded</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats or Side Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Wallet Balance</div>
                                <div className="text-2xl font-bold mt-1">₹{user.walletBalance || 0}</div>
                            </div>

                            {user.role === 'farmer' && (
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-sm text-muted-foreground">Farmlands</div>
                                    <div className="text-2xl font-bold mt-1">{user.farmlandIds?.length || 0}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Block/Unblock Dialog */}
            <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {user.isBlocked ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5 text-destructive" />}
                            {user.isBlocked ? "Unblock User" : "Block User"}
                        </DialogTitle>
                        <DialogDescription>
                            {user.isBlocked
                                ? "Are you sure you want to unblock this user? They will regain access to the platform."
                                : "Are you sure you want to block this user? They will lose access to their account immediately."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button
                            variant={user.isBlocked ? "default" : "destructive"}
                            onClick={handleToggleBlock}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
