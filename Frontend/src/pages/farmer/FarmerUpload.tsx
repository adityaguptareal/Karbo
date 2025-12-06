// src/pages/farmer/FarmerUpload.tsx
import { useState, useCallback } from "react";
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
  CloudUpload,
  File,
  Image,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { farmlandAPI } from "@/services/api";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Credits", href: "/farmer/credits", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const FarmerUpload = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    landName: "",
    location: "",
    area: "",
    landType: "",
    cultivationMethod: ""
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: 'document' | 'image') => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (type === 'document') {
      setDocuments(prev => [...prev, ...droppedFiles]);
    } else {
      setImages(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image') => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (type === 'document') {
        setDocuments(prev => [...prev, ...selectedFiles]);
      } else {
        setImages(prev => [...prev, ...selectedFiles]);
      }
    }
  };

  const removeFile = (index: number, type: 'document' | 'image') => {
    if (type === 'document') {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.landName || !formData.location || !formData.area || !formData.landType || !formData.cultivationMethod) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (documents.length === 0 || images.length === 0) {
      toast({
        title: "Missing files",
        description: "Please upload at least one document and one image.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('landName', formData.landName);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('area', formData.area);
      formDataToSend.append('landType', formData.landType);
      formDataToSend.append('cultivationMethod', formData.cultivationMethod);

      // Append documents (single file)
      if (documents.length > 0) {
        formDataToSend.append('documents', documents[0]);
      }

      // Append images (multiple files)
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const result = await farmlandAPI.create(formDataToSend);

      if (result.success) {
        toast({
          title: "Farmland submitted!",
          description: "Your farmland has been submitted for verification."
        });

        // Reset form
        setFormData({
          landName: "",
          location: "",
          area: "",
          landType: "",
          cultivationMethod: ""
        });
        setDocuments([]);
        setImages([]);
      } else {
        toast({
          title: "Submission failed",
          description: result.message || "Failed to submit farmland",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit farmland. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <DashboardLayout navItems={navItems} userType="farmer" userName="Maria Santos">
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Register Your Farmland
          </h1>
          <p className="text-muted-foreground">
            Submit your farmland details and documents for verification to start earning carbon credits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Farmland Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Farmland Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="landName">Farm/Land Name *</Label>
                <Input
                  id="landName"
                  placeholder="Green Valley Farm"
                  value={formData.landName}
                  onChange={(e) => setFormData({ ...formData, landName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Punjab, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (in acres/hectares) *</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="12"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landType">Land Type *</Label>
                <Input
                  id="landType"
                  placeholder="Organic, Conventional, etc."
                  value={formData.landType}
                  onChange={(e) => setFormData({ ...formData, landType: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cultivationMethod">Cultivation Method *</Label>
                <Input
                  id="cultivationMethod"
                  placeholder="No Chemicals, No-Till, Agroforestry, etc."
                  value={formData.cultivationMethod}
                  onChange={(e) => setFormData({ ...formData, cultivationMethod: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Upload Documents</h2>
            
            <div className="space-y-6">
              {/* Document Upload */}
              <div className="space-y-2">
                <Label>Land Ownership Document (PDF) *</Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'document')}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <File className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">
                    Drag and drop your document here
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    or click to browse
                  </p>
                  <Input
                    type="file"
                    onChange={(e) => handleFileInput(e, 'document')}
                    className="hidden"
                    id="document-upload"
                    accept=".pdf,.doc,.docx"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="document-upload" className="cursor-pointer">
                      Browse Document
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported: PDF, DOC, DOCX • Max 10MB
                  </p>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Selected Document</Label>
                    {documents.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <File className="w-8 h-8 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'document')}
                          className="p-1 hover:bg-background rounded"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Images Upload */}
              <div className="space-y-2">
                <Label>Farm Images (JPG/PNG) *</Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'image')}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Image className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">
                    Drag and drop your images here
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    or click to browse (multiple files allowed)
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => handleFileInput(e, 'image')}
                    className="hidden"
                    id="image-upload"
                    accept="image/jpeg,image/jpg,image/png"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      Browse Images
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported: JPG, PNG • Max 5MB each
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Selected Images ({images.length})</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Image className="w-8 h-8 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'image')}
                            className="p-1 hover:bg-background rounded"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Submission Guidelines
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Ensure all documents are clearly legible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Include date stamps on photos when possible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Land documents should show ownership proof
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Images should clearly show farm activities
              </li>
            </ul>
          </div>

          <Button 
            variant="hero" 
            className="w-full" 
            size="lg" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              "Submitting..."
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Submit for Verification
              </>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default FarmerUpload;