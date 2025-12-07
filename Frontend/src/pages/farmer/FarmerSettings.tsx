// src/pages/farmer/FarmerSettings.tsx
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  Upload,
  Leaf,
  Wallet,
  FileText,
  Settings,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { farmerApi, FarmerProfile } from "@/services/farmerApi";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const FarmerSettings = () => {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await farmerApi.getProfile();
        setProfile(p);
        setName(p.name);
        setEmail(p.email);
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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const updated = await farmerApi.updateProfile({ name, email });
      setProfile(updated);
      toast({
        title: "Profile updated",
        description: "Your name and email have been saved.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to update profile",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast({
        title: "Missing fields",
        description: "Enter both old and new password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingPassword(true);
      await farmerApi.changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      toast({
        title: "Password changed",
        description: "Your password has been updated.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to change password",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      userType="farmer"
      userName={profile?.name || "Farmer"}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Account settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile information and secure your account.
          </p>
        </div>

        {/* profile */}
        <form
          onSubmit={handleProfileSave}
          className="bg-card rounded-xl border border-border p-6 space-y-4"
        >
          <h2 className="font-semibold text-lg text-foreground">
            Profile details
          </h2>

          {loadingProfile ? (
            <p className="text-sm text-muted-foreground">Loading profile…</p>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save profile"}
              </Button>
            </>
          )}
        </form>

        {/* password */}
        <form
          onSubmit={handlePasswordSave}
          className="bg-card rounded-xl border border-border p-6 space-y-4"
        >
          <h2 className="font-semibold text-lg text-foreground">
            Change password
          </h2>

          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default FarmerSettings;
