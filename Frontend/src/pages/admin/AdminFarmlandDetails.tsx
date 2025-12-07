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
    Calendar,
    DollarSign,
    Loader2,
    MapPin,
    Maximize,
    FileText,
    Download,
    Image as ImageIcon,
    CheckCircle,
    XCircle
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
    { label: "Farmlands", href: "/admin/farmlands", icon: MapPin },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart },
    { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
    { label: "API Features", href: "/admin/api-features", icon: Database },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminFarmlandDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [farmland, setFarmland] = useState<any>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchFarmlandDetails = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const result = await adminAPI.getFarmlandDetails(id);
            setFarmland(result.farmland);
        } catch (error) {
            console.error("Error fetching farmland details:", error);
            toast({
                title: "Error",
                description: "Failed to fetch farmland details",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmlandDetails();
    }, [id]);

    const handleApprove = async () => {
        if (!id) return;
        setIsProcessing(true);
        try {
            await adminAPI.approveFarmland(id);
            toast({
                title: "Success",
                description: "Farmland approved successfully"
            });
            fetchFarmlandDetails();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve farmland",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!id || !rejectionReason.trim()) {
            toast({
                title: "Error",
                description: "Please provide a rejection reason",
                variant: "destructive"
            });
            return;
        }
        setIsProcessing(true);
        try {
            await adminAPI.rejectFarmland(id, rejectionReason);
            toast({
                title: "Success",
                description: "Farmland rejected successfully"
            });
            setIsRejectDialogOpen(false);
            setRejectionReason("");
            fetchFarmlandDetails();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject farmland",
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

    if (!farmland) {
        return (
            <DashboardLayout navItems={adminNavItems} userType="admin" >
                <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-muted-foreground">
                    <MapPin className="w-12 h-12 mb-4 opacity-50" />
                    <p>Farmland not found</p>
                    <Button variant="link" onClick={() => navigate("/admin/farmlands")}>
                        Back to Farmlands
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
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/farmlands")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-foreground">
                            {farmland.landName}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{farmland.location}</span>
                            <span>•</span>
                            <span>Added {new Date(farmland.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <Badge variant={
                            farmland.status === 'verified' ? 'default' :
                                farmland.status === 'pending_verification' ? 'secondary' :
                                    'destructive'
                        } className="text-sm px-3 py-1">
                            {farmland.status}
                        </Badge>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleApprove}
                                disabled={isProcessing || farmland.status === 'verified'}
                                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                {farmland.status === 'verified' ? 'Approved' : 'Approve'}
                            </Button>
                            <Button
                                onClick={() => setIsRejectDialogOpen(true)}
                                disabled={isProcessing || farmland.status === 'rejected'}
                                variant="destructive"
                                className="disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                {farmland.status === 'rejected' ? 'Rejected' : 'Reject'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Farmland Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Land Name</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-medium">{farmland.landName}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{farmland.location}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Area</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Maximize className="w-4 h-4 text-muted-foreground" />
                                        <span>{farmland.area} acres</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Land Type</label>
                                    <div className="mt-1">
                                        <span>{farmland.landType || 'N/A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Cultivation Method</label>
                                    <div className="mt-1">
                                        <span>{farmland.cultivationMethod || 'N/A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div className="mt-1">
                                        <Badge variant={
                                            farmland.status === 'verified' ? 'default' :
                                                farmland.status === 'pending_verification' ? 'secondary' :
                                                    'destructive'
                                        }>
                                            {farmland.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Owner Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Owner Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span>{farmland.farmerId?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span>{farmland.farmerId?.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                                        <div className="mt-1 capitalize">
                                            <span>{farmland.farmerId?.role || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                        <div className="mt-1">
                                            <Badge variant={
                                                farmland.farmerId?.status === 'verified' ? 'default' :
                                                    farmland.farmerId?.status === 'pending_verification' ? 'secondary' :
                                                        'destructive'
                                            }>
                                                {farmland.farmerId?.status || 'N/A'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Land Documents */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Land Documents</h3>
                                {farmland.landDocuments && farmland.landDocuments.length > 0 ? (
                                    <div className="space-y-2">
                                        {farmland.landDocuments.map((doc: string, idx: number) => (
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

                            <Separator />

                            {/* Land Images */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Land Images</h3>
                                {farmland.landImages && farmland.landImages.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {farmland.landImages.map((img: string, idx: number) => (
                                            <a
                                                key={idx}
                                                href={img}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative aspect-video rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Land image ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No images uploaded</p>
                                )}
                            </div>

                            {farmland.rejectionReason && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="text-lg font-medium mb-2 text-destructive">Rejection Reason</h3>
                                        <p className="text-sm text-muted-foreground">{farmland.rejectionReason}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Side Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Total Area</div>
                                <div className="text-2xl font-bold mt-1">{farmland.area} acres</div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Images</div>
                                <div className="text-2xl font-bold mt-1">{farmland.landImages?.length || 0}</div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Documents</div>
                                <div className="text-2xl font-bold mt-1">{farmland.landDocuments?.length || 0}</div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-sm text-muted-foreground">Created</div>
                                <div className="text-sm font-medium mt-1">
                                    {new Date(farmland.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <XCircle className="w-5 h-5" />
                            Reject Farmland
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject this farmland? Please provide a reason for rejection.
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
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isProcessing || !rejectionReason.trim()}
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
