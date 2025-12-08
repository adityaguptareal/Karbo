import { useState, useEffect } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { transactionService } from "@/services/transactionService";
import { authService } from "@/services/authService";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Download,
  Calendar,
  Leaf,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  Receipt,
  ExternalLink,
  FileCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Documents Verification", href: "/company/documents", icon: FileCheck},
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingCart },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

interface Transaction {
  _id: string;
  companyId: any;
  farmerId: any;
  carbonCreditListingId: any;
  creditsPurchased: number;
  amountPaid: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  invoiceUrl?: string;
  createdAt: string;
}

const CompanyPurchases = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await transactionService.getCompanyTransactions({
        page: currentPage,
        limit: 10,
        sortBy: 'newest'
      });

      if (response.transactions) {
        setTransactions(response.transactions);
        setTotalPages(response.pages || 1);
      }
    } catch (err: any) {
      console.error('Fetch transactions error:', err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Failed to load purchases';
      setError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by search
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.farmerId?.name?.toLowerCase().includes(searchLower) ||
      transaction.carbonCreditListingId?.farmlandId?.landName?.toLowerCase().includes(searchLower) ||
      transaction.razorpayPaymentId?.toLowerCase().includes(searchLower)
    );
  });

  // Download invoice
  const handleDownloadInvoice = async (transactionId: string, paymentId: string) => {
    try {
      toast({
        title: "Downloading...",
        description: "Your invoice is being prepared.",
      });

      const blob = await transactionService.downloadInvoice(transactionId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Invoice downloaded successfully.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download invoice. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading state
  if (loading && transactions.length === 0) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your purchases...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error && transactions.length === 0) {
    return (
      <DashboardLayout
        navItems={navItems}
        userType="company"
      >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Purchases</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchTransactions}>Try Again</Button>
          </div>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Purchases
            </h1>
            <p className="text-muted-foreground">
              View and manage your carbon credit transactions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/company/marketplace')}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Browse More Credits
          </Button>
        </div>

        {/* Search */}
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by farmer, land name, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <Card className="border border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Receipt className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No matching purchases' : 'No purchases yet'}
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchQuery 
                  ? 'Try adjusting your search query' 
                  : 'Start purchasing carbon credits to see your transaction history here'}
              </p>
              {!searchQuery && (
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => navigate('/company/marketplace')}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Browse Marketplace
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction._id} className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Transaction Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {transaction.carbonCreditListingId?.farmlandId?.landName || 'Carbon Credit Purchase'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            From: {transaction.farmerId?.name || 'Unknown Farmer'}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                          Completed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Credits</p>
                            <p className="font-medium">{transaction.creditsPurchased} tons CO₂</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="font-medium">{formatDate(transaction.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="font-medium">₹{transaction.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Transaction ID: <span className="font-mono">{transaction.razorpayPaymentId}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(transaction._id, transaction.razorpayPaymentId)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/company/purchases/${transaction._id}`)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyPurchases;
