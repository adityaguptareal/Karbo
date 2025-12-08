import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { walletApi, WalletData } from "@/services/walletApi";
import { useToast } from "@/components/ui/use-toast";
import {
    Loader2,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    LayoutDashboard,
    Upload,
    Sprout,
    Leaf,
    FileText,
    Settings
} from "lucide-react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const navItems = [
    { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
    { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
    { label: "My Farmlands", href: "/farmer/my-farmlands", icon: Sprout },
    { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
    { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
    { label: "Documents", href: "/farmer/documents", icon: FileText },
    { label: "Settings", href: "/farmer/settings", icon: Settings },
];

export const FarmerWallet = () => {
    const { toast } = useToast();
    const [data, setData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWallet = async () => {
            try {
                const walletData = await walletApi.getWalletDetails();
                setData(walletData);
            } catch (error) {
                console.error("Wallet load error:", error);
                toast({
                    title: "Error",
                    description: "Failed to load wallet details.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadWallet();
    }, [toast]);

    if (loading) {
        return (
            <DashboardLayout navItems={navItems} userType="farmer">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout navItems={navItems} userType="farmer">
            <div className="space-y-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        My Wallet
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your earnings and view transaction history.
                    </p>
                </div>

                {/* Balance Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                                <Wallet className="w-5 h-5" />
                                Current Balance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">
                                ₹{data?.balance?.toLocaleString() || "0"}
                            </div>
                            <p className="text-sm opacity-75 mt-1">
                                Available for withdrawal
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Total Earnings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                ₹
                                {data?.transactions
                                    .filter((t) => t.type === "credit")
                                    .reduce((sum, t) => sum + t.amount, 0)
                                    .toLocaleString() || "0"}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Lifetime credits
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.transactions && data.transactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.transactions.map((transaction) => (
                                        <TableRow key={transaction._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{transaction.description}</span>
                                                    {transaction.transactionId?.carbonCreditListingId && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {transaction.transactionId.creditsPurchased} credits @ ₹{transaction.transactionId.carbonCreditListingId.pricePerCredit}/credit
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {transaction.transactionId?.companyId?.name || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        transaction.type === "credit" ? "default" : "destructive"
                                                    }
                                                    className={
                                                        transaction.type === "credit"
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : "bg-red-500 hover:bg-red-600"
                                                    }
                                                >
                                                    {transaction.type === "credit" ? (
                                                        <ArrowDownLeft className="w-3 h-3 mr-1" />
                                                    ) : (
                                                        <ArrowUpRight className="w-3 h-3 mr-1" />
                                                    )}
                                                    {transaction.type.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.type === "credit" ? "+" : "-"}₹
                                                {transaction.amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                No transactions found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default FarmerWallet;
