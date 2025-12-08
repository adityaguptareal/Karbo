// src/pages/farmer/FarmerSettings.tsx
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Upload,
  Leaf,
  Wallet,
  FileText,
  Settings,
  User,
  Building,
  Lock,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Save,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { farmerApi, FarmerProfile } from "@/services/farmerApi";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const FarmerSettings = () => {
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Mobile specific state
  const [activeMobileView, setActiveMobileView] = useState<"menu" | "profile" | "banking" | "security">("menu");

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    upiId: "",
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      bankName: "",
    },
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const p = await farmerApi.getProfile();
        setProfile(p);
        setFormData({
          name: p.name || "",
          email: p.email || "",
          phone: p.phone || "",
          address: p.address || "",
          city: p.city || "",
          state: p.state || "",
          pincode: p.pincode || "",
          upiId: p.upiId || "",
          bankDetails: {
            accountNumber: p.bankDetails?.accountNumber || "",
            ifscCode: p.bankDetails?.ifscCode || "",
            accountHolderName: p.bankDetails?.accountHolderName || "",
            bankName: p.bankDetails?.bankName || "",
          },
        });
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section?: string) => {
    const { name, value } = e.target;
    if (section === "bankDetails") {
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const updated = await farmerApi.updateProfile(formData);
      setProfile(updated);
      toast({
        title: "Success",
        description: "Settings saved successfully.",
      });
      if (isMobile) setActiveMobileView("menu");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingPassword(true);
      await farmerApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Success",
        description: "Password updated.",
      });
      if (isMobile) setActiveMobileView("menu");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <DashboardLayout navItems={navItems} userType="farmer">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-8 w-8 bg-primary/20 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- MOBILE LAYOUT ---
  if (isMobile) {
    const MobileHeader = ({ title, onBack }: { title: string; onBack?: () => void }) => (
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
    );

    const MobileMenuItem = ({ icon: Icon, label, onClick, subLabel }: any) => (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 bg-card border-b border-border last:border-0 active:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">{label}</p>
            {subLabel && <p className="text-xs text-muted-foreground">{subLabel}</p>}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
      </button>
    );

    const MobileInput = ({ label, ...props }: any) => (
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">{label}</Label>
        <Input className="h-12 bg-card border-transparent focus:border-primary focus:ring-0 rounded-xl px-4 text-base shadow-sm" {...props} />
      </div>
    );

    return (
      <DashboardLayout navItems={navItems} userType="farmer">
        <div className="min-h-screen bg-muted/30 pb-20">
          {activeMobileView === "menu" && (
            <>
              <MobileHeader title="Settings" />
              <div className="mt-4 space-y-6 px-4">
                <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-card">
                  <MobileMenuItem
                    icon={User}
                    label="Personal Information"
                    subLabel="Name, Email, Address"
                    onClick={() => setActiveMobileView("profile")}
                  />
                  <MobileMenuItem
                    icon={Building}
                    label="Bank Details"
                    subLabel="Account, IFSC, UPI"
                    onClick={() => setActiveMobileView("banking")}
                  />
                  <MobileMenuItem
                    icon={Lock}
                    label="Security"
                    subLabel="Change Password"
                    onClick={() => setActiveMobileView("security")}
                  />
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">App Version 1.0.2</p>
                </div>
              </div>
            </>
          )}

          {activeMobileView === "profile" && (
            <div className="flex flex-col min-h-screen bg-background">
              <MobileHeader title="Personal Info" onBack={() => setActiveMobileView("menu")} />
              <div className="flex-1 p-5 space-y-6">
                <MobileInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
                <MobileInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <MobileInput label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                <Separator className="my-2" />
                <MobileInput label="Address" name="address" value={formData.address} onChange={handleInputChange} />
                <div className="grid grid-cols-2 gap-4">
                  <MobileInput label="City" name="city" value={formData.city} onChange={handleInputChange} />
                  <MobileInput label="State" name="state" value={formData.state} onChange={handleInputChange} />
                </div>
                <MobileInput label="Pincode" name="pincode" type="number" value={formData.pincode} onChange={handleInputChange} />
              </div>
              <div className="p-4 border-t bg-background sticky bottom-0">
                <Button className="w-full h-12 text-base rounded-xl shadow-lg" onClick={handleProfileSave} disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}

          {activeMobileView === "banking" && (
            <div className="flex flex-col min-h-screen bg-background">
              <MobileHeader title="Bank Details" onBack={() => setActiveMobileView("menu")} />
              <div className="flex-1 p-5 space-y-6">
                <MobileInput label="Account Holder" name="accountHolderName" value={formData.bankDetails.accountHolderName} onChange={(e: any) => handleInputChange(e, "bankDetails")} />
                <MobileInput label="Bank Name" name="bankName" value={formData.bankDetails.bankName} onChange={(e: any) => handleInputChange(e, "bankDetails")} />
                <MobileInput label="Account Number" name="accountNumber" type="number" value={formData.bankDetails.accountNumber} onChange={(e: any) => handleInputChange(e, "bankDetails")} />
                <MobileInput label="IFSC Code" name="ifscCode" value={formData.bankDetails.ifscCode} onChange={(e: any) => handleInputChange(e, "bankDetails")} className="uppercase" />
                <Separator className="my-2" />
                <MobileInput label="UPI ID" name="upiId" value={formData.upiId} onChange={handleInputChange} placeholder="user@upi" />
              </div>
              <div className="p-4 border-t bg-background sticky bottom-0">
                <Button className="w-full h-12 text-base rounded-xl shadow-lg" onClick={handleProfileSave} disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </div>
          )}

          {activeMobileView === "security" && (
            <div className="flex flex-col min-h-screen bg-background">
              <MobileHeader title="Security" onBack={() => setActiveMobileView("menu")} />
              <div className="flex-1 p-5 space-y-6">
                <MobileInput label="Current Password" type="password" value={passwordData.oldPassword} onChange={(e: any) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
                <MobileInput label="New Password" type="password" value={passwordData.newPassword} onChange={(e: any) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                <MobileInput label="Confirm Password" type="password" value={passwordData.confirmPassword} onChange={(e: any) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
              </div>
              <div className="p-4 border-t bg-background sticky bottom-0">
                <Button className="w-full h-12 text-base rounded-xl shadow-lg" onClick={handlePasswordSave} disabled={savingPassword}>
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // --- DESKTOP LAYOUT ---
  return (
    <DashboardLayout navItems={navItems} userType="farmer">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and details.</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Profile</TabsTrigger>
            <TabsTrigger value="banking" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Banking</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Basic identification details.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91..." />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <Label>Address</Label>
                      <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Street address" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input name="city" value={formData.city} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input name="state" value={formData.state} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Pincode</Label>
                      <Input name="pincode" value={formData.pincode} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={savingProfile} className="min-w-[120px]">
                      {savingProfile ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Financial Details</CardTitle>
                    <CardDescription>For receiving payments.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Account Holder</Label>
                      <Input name="accountHolderName" value={formData.bankDetails.accountHolderName} onChange={(e) => handleInputChange(e, "bankDetails")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input name="bankName" value={formData.bankDetails.bankName} onChange={(e) => handleInputChange(e, "bankDetails")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input name="accountNumber" value={formData.bankDetails.accountNumber} onChange={(e) => handleInputChange(e, "bankDetails")} />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC Code</Label>
                      <Input name="ifscCode" value={formData.bankDetails.ifscCode} onChange={(e) => handleInputChange(e, "bankDetails")} className="uppercase" />
                    </div>
                    <div className="space-y-2">
                      <Label>UPI ID</Label>
                      <Input name="upiId" value={formData.upiId} onChange={handleInputChange} placeholder="user@upi" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={savingProfile} className="min-w-[120px]">
                      {savingProfile ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Details</>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/60 shadow-sm max-w-2xl">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security</CardTitle>
                    <CardDescription>Update your password.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={savingPassword} className="min-w-[120px]">
                      {savingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FarmerSettings;
