// src/pages/farmer/FarmerUpload.tsx
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { farmerApi } from "@/services/farmerApi";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Upload,
  LayoutDashboard,
  Leaf,
  Wallet,
  FileText,
  Settings,
  MapPin,
  Ruler,
  Sprout,
  Image as ImageIcon,
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";


const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Farmlands", href: "/farmer/my-farmlands", icon: Sprout },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];


const CULTIVATION_METHODS = [
  { value: "Organic", label: "Organic Farming (1.5x Credits)" },
  { value: "Agroforestry", label: "Agroforestry (2.0x Credits)" },
  { value: "Regenerative", label: "Regenerative Agriculture (1.8x Credits)" },
  { value: "Sustainable", label: "Sustainable Farming (1.2x Credits)" },
  { value: "Traditional", label: "Traditional Farming (1.0x Credits)" },
];

export default function FarmerUpload() {
  const isMobile = useIsMobile();
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
  const [aadhaarCards, setAadhaarCards] = useState<File[]>([]);
  const [panCards, setPanCards] = useState<File[]>([]);

  const handleCreate = async (e: any) => {
    e.preventDefault();

    if (!payload.landName || !payload.location || !payload.area || !payload.cultivationMethod) {
      toast({
        title: "Missing fields",
        description: "All fields including cultivation method are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Convert hectares to acres for backend (1 ha = 2.47105 acres)
      const payloadInAcres = {
        ...payload,
        area: (Number(payload.area) * 2.47105).toString()
      };

      // Combine all documents into one array for submission
      const allDocuments = [
        ...documents,
        ...aadhaarCards,
        ...panCards
      ];

      await farmerApi.createFarmland(
        payloadInAcres,
        allDocuments,
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
      setAadhaarCards([]);
      setPanCards([]);

    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      toast({
        title: "Upload failed",
        description: err?.response?.data?.msg || err?.response?.data?.message || err?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- MOBILE LAYOUT ---
  if (isMobile) {
    return (
      <DashboardLayout navItems={navItems} userType="farmer">
        <div className="min-h-screen bg-background pb-20">
          {/* Mobile Header */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-3">
            <h1 className="font-semibold text-lg">Add New Farmland</h1>
          </div>

          <form onSubmit={handleCreate} className="p-5 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Land Name</Label>
                <div className="relative">
                  <Leaf className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-12 pl-9 bg-card border-border/50 focus:border-primary focus:ring-0 rounded-xl text-base shadow-sm"
                    placeholder="e.g. Green Valley Farm"
                    value={payload.landName}
                    onChange={(e) => setPayload(p => ({ ...p, landName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-12 pl-9 bg-card border-border/50 focus:border-primary focus:ring-0 rounded-xl text-base shadow-sm"
                    placeholder="Village, District"
                    value={payload.location}
                    onChange={(e) => setPayload(p => ({ ...p, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Area (Ha)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      className="h-12 pl-9 bg-card border-border/50 focus:border-primary focus:ring-0 rounded-xl text-base shadow-sm"
                      placeholder="0.00"
                      value={payload.area}
                      onChange={(e) => setPayload(p => ({ ...p, area: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Type</Label>
                  <Input
                    className="h-12 bg-card border-border/50 focus:border-primary focus:ring-0 rounded-xl text-base shadow-sm"
                    placeholder="e.g. Mixed Crop"
                    value={payload.landType}
                    onChange={(e) => setPayload(p => ({ ...p, landType: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Cultivation Method</Label>
                <Select
                  value={payload.cultivationMethod}
                  onValueChange={(val) => setPayload(p => ({ ...p, cultivationMethod: val }))}
                >
                  <SelectTrigger className="h-12 bg-card border-border/50 focus:ring-0 rounded-xl text-base shadow-sm">
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {CULTIVATION_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Legal Documents (PDF)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-muted/20 hover:bg-muted/40 transition-colors relative h-[160px] flex flex-col justify-center items-center">
                    <input
                      type="file"
                      multiple
                      accept="application/pdf,image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setDocuments(Array.from(e.target.files ?? []))}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {documents.length > 0 ? (
                          <span className="text-primary font-medium">{documents.length} files selected</span>
                        ) : (
                          "Upload Legal Docs"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Farm Images</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-muted/20 hover:bg-muted/40 transition-colors relative h-[160px] flex flex-col justify-center items-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {images.length > 0 ? (
                          <span className="text-primary font-medium">{images.length} images selected</span>
                        ) : (
                          "Upload Photos"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Aadhaar Card</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-muted/20 hover:bg-muted/40 transition-colors relative h-full flex flex-col justify-center items-center">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setAadhaarCards(Array.from(e.target.files ?? []))}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {aadhaarCards.length > 0 ? (
                          <span className="text-primary font-medium">{aadhaarCards.length} file selected</span>
                        ) : (
                          "Upload Aadhaar"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">PAN Card</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-muted/20 hover:bg-muted/40 transition-colors relative h-full flex flex-col justify-center items-center">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setPanCards(Array.from(e.target.files ?? []))}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {panCards.length > 0 ? (
                          <span className="text-primary font-medium">{panCards.length} file selected</span>
                        ) : (
                          "Upload PAN"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-8">
              <Button className="w-full h-12 text-base rounded-xl shadow-lg" type="submit" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Submit for Verification"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  // --- DESKTOP LAYOUT ---
  return (
    <DashboardLayout navItems={navItems} userType="farmer">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Register New Farmland</h1>
          <p className="text-muted-foreground mt-2">
            Submit your land details and documents for verification to start earning carbon credits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Land Details</CardTitle>
                    <CardDescription>Basic information about your farmland.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Land Name</Label>
                    <Input
                      placeholder="e.g. Green Valley Farm"
                      value={payload.landName}
                      onChange={(e) => setPayload(p => ({ ...p, landName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Village, District"
                        value={payload.location}
                        onChange={(e) => setPayload(p => ({ ...p, location: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Total Area (in Hectares)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-9"
                        placeholder="0.00"
                        value={payload.area}
                        onChange={(e) => setPayload(p => ({ ...p, area: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Land Type</Label>
                    <Input
                      placeholder="e.g. Mixed Crop"
                      value={payload.landType}
                      onChange={(e) => setPayload(p => ({ ...p, landType: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cultivation Method</Label>
                  <Select
                    value={payload.cultivationMethod}
                    onValueChange={(val) => setPayload(p => ({ ...p, cultivationMethod: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cultivation method" />
                    </SelectTrigger>
                    <SelectContent>
                      {CULTIVATION_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    This determines your carbon credit potential.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Documentation</CardTitle>
                    <CardDescription>Upload proof of ownership and land photos.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Legal Documents (PDF)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative cursor-pointer h-[180px] flex flex-col justify-center items-center">
                      <input
                        type="file"
                        multiple
                        accept="application/pdf,image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setDocuments(Array.from(e.target.files ?? []))}
                      />
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Click to upload documents</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF or Images up to 5MB</p>
                      {documents.length > 0 && (
                        <div className="mt-2 text-sm text-primary font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {documents.length} files selected
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Farmland Photos</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative cursor-pointer h-[180px] flex flex-col justify-center items-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                      />
                      <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Click to upload photos</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG or PNG up to 5MB</p>
                      {images.length > 0 && (
                        <div className="mt-2 text-sm text-primary font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {images.length} images selected
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aadhaar Card</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative cursor-pointer h-[180px] flex flex-col justify-center items-center">
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setAadhaarCards(Array.from(e.target.files ?? []))}
                      />
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Click to upload Aadhaar</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF or Images up to 5MB</p>
                      {aadhaarCards.length > 0 && (
                        <div className="mt-2 text-sm text-primary font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {aadhaarCards.length} file selected
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>PAN Card</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative cursor-pointer h-[180px] flex flex-col justify-center items-center">
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setPanCards(Array.from(e.target.files ?? []))}
                      />
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Click to upload PAN</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF or Images up to 5MB</p>
                      {panCards.length > 0 && (
                        <div className="mt-2 text-sm text-primary font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {panCards.length} file selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" onClick={handleCreate} disabled={loading} className="min-w-[200px]">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Submit Farmland"}
              </Button>
            </div>
          </div>

          {/* Right Column: Info/Help */}
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Verification Process
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span>Submit your land details and upload valid ownership documents.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span>Our team will review your application within 2-3 business days.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span>Once approved, you can start listing carbon credits on the marketplace.</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Required Documents</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Land Ownership Certificate</p>
                    <p className="text-xs text-muted-foreground">Government issued proof of ownership.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Survey Map</p>
                    <p className="text-xs text-muted-foreground">Official map showing land boundaries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
