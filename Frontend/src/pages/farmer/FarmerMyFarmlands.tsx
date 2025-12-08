import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { farmerApi, Farmland } from "@/services/farmerApi";
import { LayoutDashboard, Upload, Leaf, Wallet, FileText, Settings, MapPin, Ruler, Sprout, Loader2 } from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
    { label: "Upload Documents", href: "/farmer/upload", icon: Upload },
    { label: "My Farmlands", href: "/farmer/my-farmlands", icon: Sprout },
    { label: "Marketplace", href: "/farmer/marketplace", icon: Leaf },
    { label: "Wallet", href: "/farmer/wallet", icon: Wallet },
    { label: "Documents", href: "/farmer/documents", icon: FileText },
    { label: "Settings", href: "/farmer/settings", icon: Settings },
];

export default function FarmerMyFarmlands() {
    const [farmlands, setFarmlands] = useState<Farmland[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmlands = async () => {
            try {
                const data = await farmerApi.getMyFarmlands();
                setFarmlands(data);
            } catch (error) {
                console.error("Failed to fetch farmlands:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFarmlands();
    }, []);

    if (loading) {
        return (
            <DashboardLayout navItems={navItems} userType="farmer">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout navItems={navItems} userType="farmer">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Farmlands</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage your registered farmlands.
                    </p>
                </div>

                {farmlands.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed border-border">
                        <Sprout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No farmlands registered</h3>
                        <p className="text-muted-foreground mt-1">Upload your documents to register your first farmland.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {farmlands.map((land) => (
                            <Card key={land._id} className="overflow-hidden border-border/60 hover:shadow-md transition-all">
                                <div className="aspect-video w-full bg-muted relative">
                                    {land.landImages && land.landImages.length > 0 ? (
                                        <img
                                            src={land.landImages[0]}
                                            alt={land.landName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <Sprout className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <Badge
                                            className={`capitalize ${
                                                land.status === "verified"
                                                    ? "bg-green-500 hover:bg-green-500/80 text-white"
                                                    : land.status === "rejected"
                                                    ? "bg-red-500 hover:bg-red-500/80 text-white"
                                                    : "bg-yellow-500 hover:bg-yellow-500/80 text-black"
                                            }`}
                                        >
                                            {land.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">{land.landName}</CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" /> {land.location}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Ruler className="w-4 h-4" />
                                            <span>{land.area} Hectares</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Leaf className="w-4 h-4" />
                                            <span>{land.cultivationMethod}</span>
                                        </div>
                                    </div>

                                    {land.rejectionReason && (
                                        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md mt-2">
                                            <strong>Rejection Reason:</strong> {land.rejectionReason}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
