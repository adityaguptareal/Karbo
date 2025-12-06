import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { companyRequests, farmerBids, farmers, CompanyRequest } from "@/data/mockData";
import {
  LayoutDashboard,
  Upload,
  Leaf,
  Wallet,
  FileText,
  Settings,
  Store,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  Send,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/farmer/marketplace", icon: Store },
  { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
  { label: "My Credits", href: "/farmer/credits", icon: Leaf },
  { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
  { label: "Documents", href: "/farmer/documents", icon: FileText },
  { label: "Settings", href: "/farmer/settings", icon: Settings },
];

const currentFarmer = farmers[0];

const FarmerMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<CompanyRequest | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  

  const [bidForm, setBidForm] = useState({
    creditsOffered: "",
    pricePerCredit: "",
    deliveryTime: "",
    message: "",
  });


  const myBids = farmerBids.filter(bid => bid.farmerId === currentFarmer.id);


  const filteredRequests = useMemo(() => {
    let filtered = companyRequests;

    
    if (searchQuery) {
      filtered = filtered.filter(req =>
        req.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.practiceType.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

  
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    return filtered;
  }, [searchQuery, statusFilter]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRequest) return;

  
    const creditsOffered = parseInt(bidForm.creditsOffered);
    const pricePerCredit = parseInt(bidForm.pricePerCredit);

    if (creditsOffered > currentFarmer.creditsAvailable) {
      toast({
        title: "Insufficient Credits",
        description: `You only have ${currentFarmer.creditsAvailable} credits available.`,
        variant: "destructive",
      });
      return;
    }

    if (pricePerCredit > selectedRequest.maxPricePerCredit) {
      toast({
        title: "Price Too High",
        description: `Maximum price is ₹${selectedRequest.maxPricePerCredit} per credit.`,
        variant: "destructive",
      });
      return;
    }


    toast({
      title: "Bid Submitted Successfully!",
      description: `Your bid for ${creditsOffered} credits has been submitted to ${selectedRequest.companyName}.`,
    });

  
    setBidForm({
      creditsOffered: "",
      pricePerCredit: "",
      deliveryTime: "",
      message: "",
    });
    setBidDialogOpen(false);
  };

  const openBidDialog = (request: CompanyRequest) => {
    setSelectedRequest(request);
    setBidDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success/10 text-success border-success/20';
      case 'in_progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'closed': return 'bg-muted text-muted-foreground border-border';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'accepted': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'withdrawn': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <DashboardLayout navItems={navItems} userType="farmer" userName={currentFarmer.name}>
      <div className="space-y-8">

        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Company Marketplace
          </h1>
          <p className="text-muted-foreground">
            Browse carbon credit requests from companies and submit your bids
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Available Credits</p>
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{currentFarmer.creditsAvailable}</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">My Bids</p>
              <Send className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{myBids.length}</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Accepted Bids</p>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {myBids.filter(b => b.status === 'accepted').length}
            </p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Open Requests</p>
              <Store className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {companyRequests.filter(r => r.status === 'open').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Requests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Search Requests</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Company name, practice type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Requests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Requests</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
                  <p className="text-muted-foreground">Try adjusting your search filters</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={request.companyLogo}
                          alt={request.companyName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{request.companyName}</h3>
                          <p className="text-sm text-muted-foreground">{request.industry}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <p className="text-foreground mb-4">{request.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Leaf className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Credits needed:</span>
                        <span className="font-semibold text-foreground">{request.creditsNeeded}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Max price:</span>
                        <span className="font-semibold text-foreground">₹{request.maxPricePerCredit}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-semibold text-foreground">{request.deadline}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Bids:</span>
                        <span className="font-semibold text-foreground">{request.bidsCount}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Required Practices:</p>
                      <div className="flex flex-wrap gap-2">
                        {request.practiceType.map((practice) => (
                          <Badge key={practice} variant="secondary">
                            {practice}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {request.preferredStates && request.preferredStates.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Preferred States:</p>
                        <div className="flex flex-wrap gap-2">
                          {request.preferredStates.map((state) => (
                            <Badge key={state} variant="outline">
                              <MapPin className="w-3 h-3 mr-1" />
                              {state}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-border">
                      {request.status === 'open' ? (
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => openBidDialog(request)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Bid
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1" disabled>
                          Not Available
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4">My Bids</h3>
            
            {myBids.length === 0 ? (
              <div className="text-center py-8">
                <Send className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No bids submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBids.map((bid) => {
                  const request = companyRequests.find(r => r.id === bid.requestId);
                  return (
                    <div key={bid.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm text-foreground line-clamp-1">
                          {request?.companyName}
                        </p>
                        <Badge className={getBidStatusColor(bid.status)}>
                          {bid.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Credits:</span>
                          <span className="text-foreground font-medium">{bid.creditsOffered}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="text-foreground font-medium">₹{bid.pricePerCredit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Submitted:</span>
                          <span className="text-foreground">{bid.submittedDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Bid</DialogTitle>
              <DialogDescription>
                Submit your bid for {selectedRequest?.companyName}'s carbon credit request
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <form onSubmit={handleBidSubmit}>
                <div className="space-y-4 py-4">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credits Needed:</span>
                      <span className="font-semibold text-foreground">{selectedRequest.creditsNeeded}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Price:</span>
                      <span className="font-semibold text-foreground">₹{selectedRequest.maxPricePerCredit}/credit</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Available Credits:</span>
                      <span className="font-semibold text-primary">{currentFarmer.creditsAvailable}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditsOffered">Credits Offered *</Label>
                      <Input
                        id="creditsOffered"
                        type="number"
                        placeholder="500"
                        value={bidForm.creditsOffered}
                        onChange={(e) => setBidForm({ ...bidForm, creditsOffered: e.target.value })}
                        max={currentFarmer.creditsAvailable}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Max: {currentFarmer.creditsAvailable} credits
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricePerCredit">Price per Credit (₹) *</Label>
                      <Input
                        id="pricePerCredit"
                        type="number"
                        placeholder="1850"
                        value={bidForm.pricePerCredit}
                        onChange={(e) => setBidForm({ ...bidForm, pricePerCredit: e.target.value })}
                        max={selectedRequest.maxPricePerCredit}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Max: ₹{selectedRequest.maxPricePerCredit}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time *</Label>
                    <Select
                      value={bidForm.deliveryTime}
                      onValueChange={(value) => setBidForm({ ...bidForm, deliveryTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 days">3 days</SelectItem>
                        <SelectItem value="7 days">7 days</SelectItem>
                        <SelectItem value="14 days">14 days</SelectItem>
                        <SelectItem value="30 days">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Company *</Label>
                    <Textarea
                      id="message"
                      placeholder="Explain why your credits are a great fit for this request..."
                      value={bidForm.message}
                      onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

          
                  {bidForm.creditsOffered && bidForm.pricePerCredit && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-medium">Total Bid Amount:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{(parseInt(bidForm.creditsOffered) * parseInt(bidForm.pricePerCredit)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setBidDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Bid
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FarmerMarketplace;