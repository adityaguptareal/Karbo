import { useState, useEffect } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { authService } from "@/services/authService";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  FileCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Documents Verification", href: "/company/documents", icon: FileCheck },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

interface DocumentUpload {
  type: string;
  label: string;
  description: string;
  icon: any;
  file: File | null;
  url: string | null;
  status: 'not_uploaded' | 'uploaded' | 'pending' | 'verified' | 'rejected';
}

const CompanyDocuments = () => {
  const currentUser = authService.getCurrentUser();

  // Verification State
  const [verificationStatus, setVerificationStatus] = useState('not_submitted');
  const [isVerified, setIsVerified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Document State
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      type: 'registration_certificate',
      label: 'Company Registration Certificate',
      description: 'Certificate of Incorporation or Business Registration',
      icon: Building2,
      file: null,
      url: null,
      status: 'not_uploaded'
    },
    {
      type: 'gst_certificate',
      label: 'GST Registration Certificate',
      description: 'Goods and Services Tax Registration',
      icon: FileCheck,
      file: null,
      url: null,
      status: 'not_uploaded'
    },
    {
      type: 'pan_card',
      label: 'PAN Card',
      description: 'Company PAN Card',
      icon: FileText,
      file: null,
      url: null,
      status: 'not_uploaded'
    },
    {
      type: 'address_proof',
      label: 'Address Proof',
      description: 'Electricity bill, Rent agreement, or Property documents',
      icon: MapPin,
      file: null,
      url: null,
      status: 'not_uploaded'
    }
  ]);

  // Fetch Profile Data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.user) {
        const user = response.data.user;

        console.log('User data:', user); // ✅ Debug - check what you're receiving
        console.log('Status:', user.status); // ✅ Debug

        // ✅ Check the correct field
        const status = user.status || 'not_submitted';
        const isVerified = status === 'verified';

        setIsVerified(isVerified);
        setVerificationStatus(status);

        // Load documents if they exist
        if (user.companyDocuments && user.companyDocuments.length > 0) {
          const updatedDocs = documents.map((doc, index) => {
            if (user.companyDocuments[index]) {
              return {
                ...doc,
                url: user.companyDocuments[index],
                status: (status === 'verified' ? 'verified' : 'uploaded') as DocumentUpload['status']
              };
            }
            return doc;
          });
          setDocuments(updatedDocs);
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle File Selection
  const handleFileSelect = (index: number, file: File | null) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, JPG, or PNG files only",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const updatedDocs = [...documents];
      updatedDocs[index].file = file;
      setDocuments(updatedDocs);
    }
  };

  // Upload Single Document - CHANGED to upload immediately
  const uploadDocument = async (index: number) => {
    const doc = documents[index];
    if (!doc.file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('documents', doc.file); // ✅ Use 'documents' as key

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/company/documents/upload`, // ✅ Use company route
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.msg) {
        const updatedDocs = [...documents];
        updatedDocs[index].status = 'uploaded';
        updatedDocs[index].file = null;
        setDocuments(updatedDocs);

        toast({
          title: "Document Uploaded",
          description: `${doc.label} uploaded successfully`,
        });

        // Refresh profile to get updated status
        fetchProfile();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.msg || "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Submit for Verification (when documents are already uploaded)
  const submitForVerification = async () => {
    // Check if at least some documents have files OR urls
    const hasDocuments = documents.some(doc => doc.file !== null || doc.url !== null);

    if (!hasDocuments) {
      toast({
        title: "No Documents",
        description: "Please upload at least one document",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();

      // Append files that aren't uploaded yet
      documents.forEach((doc) => {
        if (doc.file) {
          formData.append('documents', doc.file);
        }
      });

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_BASE_URL}/company/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.msg) {
        setVerificationStatus('pending_verification');
        toast({
          title: "Submitted for Verification ✓",
          description: response.data.msg,
        });
        fetchProfile();
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.msg || "Failed to submit for verification",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Get Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'uploaded':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Uploaded
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Uploaded
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Documents Verification</h1>
            <p className="text-muted-foreground">
              Manage your verification documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {getStatusBadge(verificationStatus)}
          </div>
        </div>

        {/* Verification Status Alert */}
        {!isVerified && verificationStatus === 'pending_verification' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Verification Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please upload all required documents below to verify your company account and start purchasing carbon credits.
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'pending' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  Under Review
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your documents are being reviewed by our team. This usually takes 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {isVerified && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                  Verified Account
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your company account is verified. You can now purchase carbon credits from the marketplace.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Documents */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Verification Documents
            </CardTitle>
            <CardDescription>
              Upload the following documents to verify your company account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {documents.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <div key={doc.type}>
                  <div className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {doc.label}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                        </div>
                        {getStatusBadge(doc.status)}
                      </div>

                      {doc.url ? (
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.url!, '_blank')}
                          >
                            <FileCheck className="w-4 h-4 mr-2" />
                            View Document
                          </Button>
                          {verificationStatus !== 'pending' && verificationStatus !== 'verified' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedDocs = [...documents];
                                updatedDocs[index].url = null;
                                updatedDocs[index].status = 'not_uploaded';
                                setDocuments(updatedDocs);
                              }}
                            >
                              Replace
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-3">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileSelect(index, e.target.files?.[0] || null)}
                            className="flex-1"
                            disabled={verificationStatus === 'pending' || verificationStatus === 'verified'}
                          />
                          <Button
                            onClick={() => uploadDocument(index)}
                            disabled={!doc.file || uploading || verificationStatus === 'pending' || verificationStatus === 'verified'}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            {uploading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {doc.file && !doc.url && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Selected: {doc.file.name} ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  </div>
                  {index < documents.length - 1 && <Separator className="my-4" />}
                </div>
              );
            })}

            {/* Submit Button */}
            {verificationStatus !== 'pending' && verificationStatus !== 'verified' && (
              <div className="pt-4">
                <Button
                  onClick={submitForVerification}
                  disabled={
                    uploading ||
                    verificationStatus === 'pending_verification' ||
                    verificationStatus === 'verified'
                  } // ✅ CORRECT - only disable if uploading or already submitted
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  By submitting, you confirm that all documents are authentic and accurate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanyDocuments;
