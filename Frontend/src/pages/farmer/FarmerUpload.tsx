// src/pages/farmer/FarmerUpload.tsx
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { farmerApi } from "@/services/farmerApi";
import {
  Upload,
  LayoutDashboard,
  Leaf,
  Wallet,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

export default function FarmerUpload() {
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState({
    landName: "",
    location: "",
    area: "",
    landType: "",
    cultivationMethod: "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const handleCreate = async (e: any) => {
    e.preventDefault();

    if (!payload.landName || !payload.location || !payload.area) {
      toast({
        title: "Missing fields",
        description: "Land name, location & area are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await farmerApi.createFarmland(
        payload,
        documents,
        images
      );

      toast({
        title: "Success",
        description: "Farmland created successfully!",
      });

      setPayload({
        landName: "",
        location: "",
        area: "",
        landType: "",
        cultivationMethod: "",
      });
      setDocuments([]);
      setImages([]);

      console.log("Uploaded farmland:", res);
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);

      toast({
        title: "Upload failed",
        description:
          err?.response?.data?.message || "Backend server error (500).",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} userName="Farmer" userType="farmer">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Upload Farmland Documents</h1>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <Label>Land Name</Label>
            <Input
              value={payload.landName}
              onChange={(e) =>
                setPayload((p) => ({ ...p, landName: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              value={payload.location}
              onChange={(e) =>
                setPayload((p) => ({ ...p, location: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Area (in acres)</Label>
            <Input
              value={payload.area}
              type="number"
              onChange={(e) =>
                setPayload((p) => ({ ...p, area: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Land Type</Label>
            <Input
              value={payload.landType}
              onChange={(e) =>
                setPayload((p) => ({ ...p, landType: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Cultivation Method</Label>
            <Textarea
              rows={3}
              value={payload.cultivationMethod}
              onChange={(e) =>
                setPayload((p) => ({
                  ...p,
                  cultivationMethod: e.target.value,
                }))
              }
            />
          </div>

          {/* Documents */}
          <div>
            <Label>Documents (PDF / Certificates)</Label>
            <Input
              type="file"
              multiple
              accept="application/pdf,image/*"
              onChange={(e) =>
                setDocuments(Array.from(e.target.files ?? []))
              }
            />
          </div>

          {/* Images */}
          <div>
            <Label>Farmland Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Uploading..." : "Upload Farmland"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
