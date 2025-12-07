import { useState, useEffect } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { authService } from "@/services/authService";
import { companyService } from "@/services/companyService";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Upload,
  FileCheck,
  AlertCircle,
  Loader2,
  Lock,
  Bell,
  CreditCard,
  LogOut,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  companyDocuments?: string[];
  rejectionReason?: string;
  walletBalance?: number;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CompanySettings = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });


  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/profile/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.user) {
        const profileData = response.data.user;
        setProfile(profileData);
        setProfileForm({
          name: profileData.name || "",
          email: profileData.email || "",
        });
      }
    } catch (error: any) {
      console.error('Fetch profile error:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_BASE_URL}/profile/update`,
        {
          name: profileForm.name,
          // Only sending name since that's the only editable field
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      // Update localStorage user data
      const updatedUser = { ...currentUser, name: profileForm.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: "Success",
        description: response.data.msg || "Profile updated successfully",
      });

      fetchProfile();
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.msg || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleDocumentUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select documents to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingDocs(true);
      
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('documents', file);
      });

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/company/documents/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast({
        title: "Success",
        description: "Documents uploaded successfully. Waiting for admin verification.",
      });

      setSelectedFiles([]);
      fetchProfile();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.msg || "Failed to upload documents",
        variant: "destructive"
      });
    } finally {
      setUploadingDocs(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_BASE_URL}/profile/change-password`,  // Using your endpoint
        {
          oldPassword: passwordForm.currentPassword,  // Changed to match your backend field name
          newPassword: passwordForm.newPassword,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      toast({
        title: "Success",
        description: response.data.msg || "Password changed successfully",
      });
      
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };


  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  const getStatusBadge = () => {
    switch (profile?.status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Verified</Badge>;
      case 'pending_verification':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Pending Verification</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
        userName={currentUser?.name || "Company User"}
      >
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
      userName={currentUser?.name || "Company User"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Verification Status Banner */}
        {profile?.status === 'pending_verification' && (
          <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">Verification Pending</p>
                <p className="text-sm text-muted-foreground">
                  Your documents are under review. You'll be notified once verified.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {profile?.status === 'rejected' && profile.rejectionReason && (
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">Verification Rejected</p>
                <p className="text-sm text-muted-foreground">
                  Reason: {profile.rejectionReason}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card className="border border-border">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'documents'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Documents</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'security'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'notifications'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>
                  
                  <Separator className="my-4" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="border border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Company Profile</CardTitle>
                      <CardDescription>Update your company information</CardDescription>
                    </div>
                    {getStatusBadge()}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Company Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          className="pl-10"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={profile?.role || "company"}
                        disabled
                        className="capitalize"
                      />
                      <p className="text-xs text-muted-foreground">Role cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Wallet Balance</Label>
                      <Input
                        value={`₹${(profile?.walletBalance || 0).toFixed(2)}`}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">View-only field</p>
                    </div>

                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}


            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Company Documents</CardTitle>
                  <CardDescription>Upload verification documents for your company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    <div className="flex flex-col items-center text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Accepted: Registration certificate, GST certificate, etc. (PDF, JPG, PNG)
                      </p>
                      <input
                        type="file"
                        id="doc-upload"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label htmlFor="doc-upload">
                        <Button variant="outline" type="button" asChild>
                          <span>Select Files</span>
                        </Button>
                      </label>
                      
                      {selectedFiles.length > 0 && (
                        <div className="mt-4 w-full">
                          <p className="text-sm font-medium mb-2">Selected Files:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {selectedFiles.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                          <Button
                            onClick={handleDocumentUpload}
                            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                            disabled={uploadingDocs}
                          >
                            {uploadingDocs ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Documents
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  {profile?.companyDocuments && profile.companyDocuments.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                      <div className="space-y-2">
                        {profile.companyDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileCheck className="w-5 h-5 text-emerald-600" />
                              <span className="text-sm">Document {index + 1}</span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Notification preferences coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanySettings;
