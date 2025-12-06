import { DashboardLayout } from "../layout/DashboardLayout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { companies } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  BarChart3,
  Settings,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  User,
  Save,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "company/marketplace", icon: ShoppingBag },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const currentCompany = companies[1]; // c2 - Green Manufacturing Co.

const CompanySettings = () => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form states
  const [companyInfo, setCompanyInfo] = useState({
    name: currentCompany.name,
    industry: currentCompany.industry,
    email: "contact@greenmanufacturing.com",
    phone: "+91 98765 43210",
    address: "123 Industrial Area, Mumbai, Maharashtra 400001",
    website: "www.greenmanufacturing.com",
    description: "Leading sustainable manufacturer committed to reducing carbon footprint and supporting eco-friendly practices.",
  });

  const [notifications, setNotifications] = useState({
    emailNewCredits: true,
    emailPurchaseConfirm: true,
    emailReports: true,
    smsAlerts: false,
    marketingEmails: true,
  });

  const [preferences, setPreferences] = useState({
    autoRenewGoals: true,
    monthlyReports: true,
    publicProfile: false,
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
      userName={currentCompany.name}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800">
            <AlertCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-emerald-700 dark:text-emerald-300">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Profile
            </CardTitle>
            <CardDescription>
              Update your company information and public profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyInfo.name}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={companyInfo.industry}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, industry: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={companyInfo.phone}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                value={companyInfo.website}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, website: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                value={companyInfo.address}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, address: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={companyInfo.description}
                onChange={(e) =>
                  setCompanyInfo({ ...companyInfo, description: e.target.value })
                }
                placeholder="Tell us about your company and sustainability goals..."
              />
            </div>

            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Billing & Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Billing & Payment
            </CardTitle>
            <CardDescription>
              Manage your payment methods and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Saved Payment Methods */}
            <div>
              <h3 className="font-semibold mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4532</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/26
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Default
                    </span>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4">
                Add Payment Method
              </Button>
            </div>

            <Separator />

            {/* Billing Details */}
            <div>
              <h3 className="font-semibold mb-4">Billing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billing-name">Billing Contact Name</Label>
                  <Input id="billing-name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Billing Email</Label>
                  <Input
                    id="billing-email"
                    type="email"
                    defaultValue="billing@greenmanufacturing.com"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="tax-id">Tax ID / GST Number</Label>
                <Input id="tax-id" placeholder="Enter GST Number" />
              </div>
            </div>

            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Billing Info
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what updates you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-new-credits">New Credits Available</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new carbon credits match your preferences
                  </p>
                </div>
                <Switch
                  id="email-new-credits"
                  checked={notifications.emailNewCredits}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNewCredits: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-purchase">Purchase Confirmations</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive confirmation emails for successful purchases
                  </p>
                </div>
                <Switch
                  id="email-purchase"
                  checked={notifications.emailPurchaseConfirm}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      emailPurchaseConfirm: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-reports">Monthly Impact Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Get monthly summaries of your carbon offset impact
                  </p>
                </div>
                <Switch
                  id="email-reports"
                  checked={notifications.emailReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailReports: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-alerts">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text messages for important updates
                  </p>
                </div>
                <Switch
                  id="sms-alerts"
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, smsAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and sustainability tips
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      marketingEmails: checked,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Sustainability Preferences
            </CardTitle>
            <CardDescription>
              Customize your carbon offset goals and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-renew">Auto-Renew Annual Goals</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically set new carbon offset goals each year
                  </p>
                </div>
                <Switch
                  id="auto-renew"
                  checked={preferences.autoRenewGoals}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, autoRenewGoals: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="monthly-reports">Generate Monthly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create downloadable impact reports monthly
                  </p>
                </div>
                <Switch
                  id="monthly-reports"
                  checked={preferences.monthlyReports}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, monthlyReports: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-profile">Public Impact Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your carbon offset achievements visible to others
                  </p>
                </div>
                <Switch
                  id="public-profile"
                  checked={preferences.publicProfile}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, publicProfile: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>

            <Button onClick={handleSave}>Update Password</Button>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your company account and all data
                </p>
              </div>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanySettings;
