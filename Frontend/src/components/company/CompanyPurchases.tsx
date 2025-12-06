import { DashboardLayout } from "../layout/DashboardLayout";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { allTransactions, carbonCredits, farmers, companies } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  BarChart3,
  Settings,
  Download,
  Search,
  Filter,
  Calendar,
  MapPin,
  Leaf,
  ExternalLink,
  FileCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/company/marketplace", icon: ShoppingBag },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const currentCompany = companies[1];

const CompanyPurchases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Get all purchase transactions
  const purchases = allTransactions
    .filter((t) => t.type === "purchase" && t.companyId === currentCompany.id)
    .map((purchase) => {
      const credit = carbonCredits.find((c) => c.id === purchase.creditId);
      const farmer = credit ? farmers.find((f) => f.id === credit.farmerId) : null;
      return {
        ...purchase,
        credit,
        farmer,
      };
    });

  // Filter purchases
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      searchQuery === "" ||
      purchase.farmer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.credit?.practiceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || purchase.status === filterStatus;

    const matchesType =
      filterType === "all" || purchase.credit?.practiceType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate totals
  const totalPurchases = purchases?.length || 0;
  const totalCredits = purchases?.reduce((sum, p) => sum + (p.credits || 0), 0) || 0;
  const totalSpent = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const totalCO2 = purchases?.reduce((sum, p) => sum + ((p.credits || 0) * 1), 0) || 0;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: string; label: string }> = {
      completed: { variant: "default", label: "Completed" },
      pending: { variant: "secondary", label: "Pending" },
      verified: { variant: "default", label: "Verified" },
    };

    const config = variants[status] || variants.completed;
    return (
      <Badge
        variant={config.variant as any}
        className={
          status === "completed"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : ""
        }
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout navItems={navItems} userType="company" userName="EcoTech Industries">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Purchases</h1>
          <p className="text-muted-foreground">
            View and manage your carbon credit purchase history
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPurchases}</p>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalCredits.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Credits Purchased</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(totalSpent / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-muted-foreground">Total Invested</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalCO2.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Tons CO₂ Offset</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by farmer, type, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Credit Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Organic Farming">Organic Farming</SelectItem>
                <SelectItem value="No-Till Agriculture">No-Till Agriculture</SelectItem>
                <SelectItem value="Agroforestry">Agroforestry</SelectItem>
                <SelectItem value="Regenerative">Regenerative</SelectItem>
              </SelectContent>
            </Select>

            {/* Download All Button */}
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Purchases Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Credit Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No purchases found</p>
                        <Button variant="outline" size="sm" asChild className="mt-2">
                          <Link to="/marketplace">Browse Marketplace</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">
                        #{purchase.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(purchase.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={purchase.farmer?.avatar}
                            alt={purchase.farmer?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium">
                            {purchase.farmer?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm">{purchase.credit?.practiceType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {purchase.credit?.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {purchase.credits?.toLocaleString() || 0} credits
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{purchase.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Report
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Results Count */}
        {filteredPurchases.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
            <p>
              Showing {filteredPurchases.length} of {totalPurchases} purchases
            </p>
            <p>Total: ₹{totalSpent.toLocaleString()}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyPurchases;
