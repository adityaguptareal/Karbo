import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import { verificationRequests } from "@/data/mockData";
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

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Credits", href: "/farmer/credits", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const FarmerUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !documentType) {
      toast({
        title: "Missing information",
        description: "Please select a document type and upload at least one file.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Documents submitted!",
      description: "Your documents have been submitted for verification.",
    });
    
    setFiles([]);
    setDocumentType("");
    setDescription("");
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
            Upload Documents
          </h1>
          <p className="text-muted-foreground">
            Submit your farming documents for verification to earn carbon credits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type *</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="land_ownership">Land Ownership Proof</SelectItem>
                    <SelectItem value="eco_practice">Eco-Practice Documentation</SelectItem>
                    <SelectItem value="certification">Organic/Eco Certification</SelectItem>
                    <SelectItem value="photos">Farm Activity Photos</SelectItem>
                    <SelectItem value="other">Other Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Drag & Drop Zone */}
              <div className="space-y-2">
                <Label>Upload Files *</Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <CloudUpload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    Drag and drop your files here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse from your computer
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: PDF, JPG, PNG, DOC • Max 10MB per file
                  </p>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        {file.type.includes('image') ? (
                          <Image className="w-8 h-8 text-primary" />
                        ) : (
                          <File className="w-8 h-8 text-primary" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-background rounded"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional notes about your documents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <Button variant="hero" className="w-full" size="lg" type="submit">
                <Upload className="w-5 h-5 mr-2" />
                Submit for Verification
              </Button>
            </form>
          </div>

          {/* Upload History */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              {verificationRequests.slice(0, 4).map((request) => (
                <div key={request.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{request.documentType}</p>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{request.submittedDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Document Guidelines
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
              Certifications must be current and valid
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerUpload;
