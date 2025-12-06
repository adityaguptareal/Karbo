// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  LayoutDashboard,
  FileCheck,
  Users,
  BarChart3,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { adminAPI } from "@/services/api";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Verification", href: "/admin/verification", icon: FileCheck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Farmland {
  _id: string;
  landName: string;
  location: string;
  area: number;
  landType: string;
  cultivationMethod: string;
  status: string;
  farmer: {
    name: string;
    email: string;
  };
  documents: string[];
  images: string[];
  submittedAt: string;
}

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingFarmlands, setPendingFarmlands] = useState<Farmland[]>([]);
  const [selectedFarmland, setSelectedFarmland] = useState<Farmland | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | 'view'>('view');
  const [itemType, setItemType] = useState<'user' | 'farmland'>('user');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResult, farmlandsResult] = await Promise.all([
        adminAPI.getPendingUsers(),
        adminAPI.getPendingFarmlands()
      ]);

      if (usersResult.success) {
        setPendingUsers(usersResult.data || []);
      }

      if (farmlandsResult.success) {
        setPendingFarmlands(farmlandsResult.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFarmland = async (farmland: Farmland) => {
    try {
      const result = await adminAPI.getFarmlandDetails(farmland._id);
      if (result.success) {
        setSelectedFarmland(result.data);
        setItemType('farmland');
        setDialogType('view');
        setDialogOpen(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch farmland details",
        variant: "destructive"
      });
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const result = await adminAPI.approveUser(userId);
      if (result.success) {
        toast({
          title: "User approved",
          description: "User has been successfully approved"
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive"
      });
    }
  };

  const handleRejectUser = async () => {
    if (!selectedUser || !rejectReason) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await adminAPI.rejectUser(selectedUser._id, rejectReason);
      if (result.success) {
        toast({
          title: "User rejected",
          description: "User has been rejected"
        });
        setDialogOpen(false);
        setRejectReason("");
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive"
      });
    }
  };

  const handleApproveFarmland = async (farmlandId: string) => {
    try {
      const result = await adminAPI.approveFarmland(farmlandId);
      if (result.success) {
        toast({
          title: "Farmland approved",
          description: "Farmland has been successfully approved"
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve farmland",
        variant: "destructive"
      });
    }
  };

  const handleRejectFarmland = async (farmlandId: string) => {
    try {
      const result = await adminAPI.rejectFarmland(farmlandId);
      if (result.success) {
        toast({
          title: "Farmland rejected",
          description: "Farmland has been rejected"
        });
        setDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject farmland",
        variant: "destructive"
      });
    }
  };

  const openRejectDialog = (user: User) => {
    setSelectedUser(user);
    setItemType('user');
    setDialogType('reject');
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-warning/10 text-warning border-warning/20",
      approved: "bg-success/10 text-success border-success/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20"
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (isLoading) {
    return (
      <DashboardLayout navItems={navItems} userType="admin" userName="Admin User">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} userType="admin" userName="Admin User">
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending Users</p>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{pendingUsers.length}</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending Farmlands</p>
              <FileCheck className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{pendingFarmlands.length}</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Pending</p>
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {pendingUsers.length + pendingFarmlands.length}
            </p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Action Required</p>
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {pendingUsers.length + pendingFarmlands.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Users */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg text-foreground mb-6">Pending User Verifications</h2>
            
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="text-muted-foreground">No pending user verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user._id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {user.role}
                        </Badge>
                        <Badge className={getStatusBadge(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveUser(user._id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openRejectDialog(user)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Farmlands */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg text-foreground mb-6">Pending Farmland Verifications</h2>
            
            {pendingFarmlands.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="text-muted-foreground">No pending farmland verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingFarmlands.map((farmland) => (
                  <div key={farmland._id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{farmland.landName}</p>
                      <p className="text-sm text-muted-foreground">{farmland.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {farmland.area} acres
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {farmland.landType}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewFarmland(farmland)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveFarmland(farmland._id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectFarmland(farmland._id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialog for viewing/rejecting */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogType === 'view' && 'Farmland Details'}
                {dialogType === 'reject' && `Reject ${itemType === 'user' ? 'User' : 'Farmland'}`}
              </DialogTitle>
              <DialogDescription>
                {dialogType === 'view' && 'Review farmland information and documents'}
                {dialogType === 'reject' && 'Provide a reason for rejection'}
              </DialogDescription>
            </DialogHeader>

            {dialogType === 'view' && selectedFarmland && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Land Name</Label>
                    <p className="text-foreground">{selectedFarmland.landName}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p className="text-foreground">{selectedFarmland.location}</p>
                  </div>
                  <div>
                    <Label>Area</Label>
                    <p className="text-foreground">{selectedFarmland.area} acres</p>
                  </div>
                  <div>
                    <Label>Land Type</Label>
                    <p className="text-foreground">{selectedFarmland.landType}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Cultivation Method</Label>
                    <p className="text-foreground">{selectedFarmland.cultivationMethod}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Farmer</Label>
                    <p className="text-foreground">{selectedFarmland.farmer.name} ({selectedFarmland.farmer.email})</p>
                  </div>
                </div>

                {selectedFarmland.images && selectedFarmland.images.length > 0 && (
                  <div>
                    <Label>Farm Images</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {selectedFarmland.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Farm ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {dialogType === 'reject' && itemType === 'user' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Rejection Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              {dialogType === 'reject' && itemType === 'user' && (
                <Button variant="destructive" onClick={handleRejectUser}>
                  Confirm Rejection
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;