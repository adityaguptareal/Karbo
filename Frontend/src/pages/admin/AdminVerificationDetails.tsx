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
    CheckCircle,
    XCircle,
    ArrowLeft,
    FileText,
    DollarSign,
    User,
    Building,
    Tractor,
    Loader2,
    MapPin,
    Calendar,
    Mail,
    Phone,
    Download,
    AlertTriangle
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

export default function AdminVerificationDetails() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    // Rejection State
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id || !type) return;
            setIsLoading(true);
            try {
                let result;
                if (type === 'farmland') {
                    result = await adminAPI.getFarmlandDetails(id);
                    setData(result.farmland);
                } else {
                    result = await adminAPI.getUserDetails(id);
                    setData(result.user);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch details",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [type, id]);

    const handleApprove = async () => {
        if (!id) return;
        try {
            if (type === 'farmland') {
                await adminAPI.approveFarmland(id);
                toast({ title: "Success", description: "Farmland approved successfully" });
            } else {
                await adminAPI.approveUser(id);
                toast({ title: "Success", description: "User approved successfully" });
            }
            navigate("/admin/verification");
        } catch (error) {
            toast({ title: "Error", description: "Failed to approve request", variant: "destructive" });
        }
    };

    const handleRejectClick = () => {
        setRejectionReason("");
        setIsRejectDialogOpen(true);
    };

    const confirmReject = async () => {
        if (!id) return;
        if (!rejectionReason.trim()) {
            toast({ title: "Error", description: "Please provide a reason for rejection", variant: "destructive" });
            return;
        }

        setIsRejecting(true);
        try {
            if (type === 'farmland') {
                await adminAPI.rejectFarmland(id, rejectionReason);
                toast({ title: "Success", description: "Farmland rejected successfully" });
            } else {
                await adminAPI.rejectUser(id, rejectionReason);
                toast({ title: "Success", description: "User rejected successfully" });
            }
            setIsRejectDialogOpen(false);
            navigate("/admin/verification");
        } catch (error) {
            toast({ title: "Error", description: "Failed to reject request", variant: "destructive" });
        } finally {
            setIsRejecting(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout navItems={adminNavItems} userType="admin" userName="System Admin">
                <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!data) {
        return (
            <DashboardLayout navItems={adminNavItems} userType="admin" userName="System Admin">
                <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-muted-foreground">
                    <FileCheck className="w-12 h-12 mb-4 opacity-50" />
                    <p>Details not found</p>
                    <Button variant="link" onClick={() => navigate("/admin/verification")}>
                        Back to List
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const isFarmland = type === 'farmland';

    return (
        <DashboardLayout navItems={adminNavItems} userType="admin" userName="System Admin">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/verification")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-foreground">
                            {isFarmland ? data.landName : data.name}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Badge variant="outline" className="uppercase">
                                {isFarmland ? 'Farmland' : data.role}
                            </Badge>
                            <span>•</span>
                            <span>Requested on {new Date(data.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleApprove}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button variant="destructive" onClick={handleRejectClick}>
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isFarmland ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Owner</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span>{data.farmerId?.name || "Unknown"}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Area</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Tractor className="w-4 h-4 text-muted-foreground" />
                                                <span>{data.area} Acres</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Land Type</label>
                                            <div className="mt-1">{data.landType || "N/A"}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Cultivation Method</label>
                                            <div className="mt-1">{data.cultivationMethod || "N/A"}</div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span>{data.location}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span>{data.email}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                                        <div className="flex items-center gap-2 mt-1 capitalize">
                                            {data.role === 'farmer' ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                                            <span>{data.role}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                                        <div className="mt-1">
                                            <Badge variant="secondary">{data.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents & Images */}
                    <div className="space-y-6">
                        {/* Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isFarmland && data.landImages && data.landImages.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {data.landImages.map((img: string, idx: number) => (
                                            <div key={idx} className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                                                <img src={img} alt={`Land ${idx + 1}`} className="object-cover w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground text-center py-8 bg-muted/10 rounded-lg border border-dashed">
                                        No images available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(isFarmland ? data.landDocuments : data.companyDocuments) &&
                                    (isFarmland ? data.landDocuments : data.companyDocuments).length > 0 ? (
                                    (isFarmland ? data.landDocuments : data.companyDocuments).map((doc: string, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-100 text-red-600 rounded">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="text-sm font-medium">Document {idx + 1}</div>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={doc} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground text-center py-8 bg-muted/10 rounded-lg border border-dashed">
                                        No documents uploaded
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
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
