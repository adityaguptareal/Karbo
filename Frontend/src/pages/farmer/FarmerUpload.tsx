// src/pages/farmer/FarmerUpload.tsx
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Upload as UploadIcon,
  Leaf,
  Wallet,
  FileText,
  Settings,
  Store,
  Image as ImageIcon,
  FileUp,
} from "lucide-react";
import {
  farmlandAPI,
  profileAPI,
  type CreateFarmlandPayload,
  type UserProfile,
} from "@/services/api";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Store },
  { label: "Upload Documents", href: "/farmer/upload", icon: UploadIcon },
  { label: "My Farmlands", href: "/farmer/farmlands", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const FarmerUpload = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    landName: "",
    location: "",
    area: "",
    landType: "",
    cultivationMethod: "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  // Load profile for header name (optional but nice)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileAPI.getProfile();
        setProfile(data);
      } catch {
        // silent – dashboard already handles auth errors
      }
    };
    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setDocuments(Array.from(files));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImages(Array.from(files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.landName || !form.location || !form.area) {
      toast({
        title: "Missing details",
        description: "Please fill in land name, location and area.",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateFarmlandPayload = {
      landName: form.landName,
      location: form.location,
      area: form.area,
      landType: form.landType,
      cultivationMethod: form.cultivationMethod,
      documents,
      images,
    };

    try {
      setIsSubmitting(true);
      const created = await farmlandAPI.createFarmland(payload);

      toast({
        title: "Farmland submitted",
        description: `“${created.landName}” has been submitted for verification.`,
      });

      // Reset form
      setForm({
        landName: "",
        location: "",
        area: "",
        landType: "",
        cultivationMethod: "",
      });
      setDocuments([]);
      setImages([]);
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.message || "Could not submit farmland.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      userType="farmer"
      userName={profile?.name || "Farmer"}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Upload Farmland Documents
          </h1>
          <p className="text-muted-foreground">
            Submit details of your farmland so our team can verify and issue
            carbon credits.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* Left: farmland details */}
          <div className="lg:col-span-2 space-y-6 bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-2">
              Farmland Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landName">Land Name *</Label>
                <Input
                  id="landName"
                  name="landName"
                  placeholder="Bhavani Organic Farm"
                  value={form.landName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Village, District, State"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (in acres) *</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  min={0.1}
                  step={0.1}
                  placeholder="5"
                  value={form.area}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Land Type</Label>
                <Select
                  value={form.landType}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, landType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select land type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cropland">Cropland</SelectItem>
                    <SelectItem value="orchard">Orchard</SelectItem>
                    <SelectItem value="pasture">Pasture</SelectItem>
                    <SelectItem value="mixed">Mixed use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cultivationMethod">Cultivation Method</Label>
              <Textarea
                id="cultivationMethod"
                name="cultivationMethod"
                placeholder="Describe your current practices – e.g. organic, no-till, crop rotation…"
                rows={4}
                value={form.cultivationMethod}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                This helps us understand how your practices generate carbon
                credits.
              </p>
            </div>
          </div>

          {/* Right: file uploads */}
          <div className="space-y-6">
            {/* Documents */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <FileUp className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Land Ownership Documents
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload PDFs or images of land records, ownership proof, or
                tenancy agreements.
              </p>

              <Input
                id="documents"
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleDocsChange}
              />

              {documents.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected {documents.length} file
                  {documents.length > 1 ? "s" : ""}.
                </p>
              )}
            </div>

            {/* Images */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Farmland Photos
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Clear photos of your fields, boundary, and any sustainable
                practices in action.
              </p>

              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
              />

              {images.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected {images.length} image
                  {images.length > 1 ? "s" : ""}.
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default FarmerUpload;
