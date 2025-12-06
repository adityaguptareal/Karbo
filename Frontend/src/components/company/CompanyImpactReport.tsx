import { DashboardLayout } from "../layout/DashboardLayout";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { allTransactions, companies } from "@/data/mockData";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  BarChart3,
  Settings,
  Download,
  TrendingUp,
  Leaf,
  Globe,
  Droplets,
  Wind,
  Trees,
  Factory,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "My Purchases", href: "/company/purchases", icon: FileText },
  { label: "Impact Report", href: "/company/impact", icon: BarChart3 },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const currentCompany = companies[1]; // c2 - Green Manufacturing Co.

const CompanyImpactReport = () => {
  // Get all purchase transactions for this company
  const purchases = allTransactions.filter(
    (t) => t.type === "purchase" && t.companyId === "c2"
  );

  // Calculate metrics
  const totalCredits = purchases.reduce((sum, p) => sum + (p.credits || 0), 0);
  const totalCO2Offset = totalCredits; // 1 credit = 1 ton CO2
  const treesEquivalent = totalCO2Offset * 50;
  const carsOffRoad = Math.round(totalCO2Offset * 2.5);
  const homesEnergy = Math.round(totalCO2Offset * 0.8);

  // Monthly data (example - you can enhance this)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyCredits = [450, 520, 680, 750, 820, 680];

  // Breakdown by practice type
  const practiceBreakdown = [
    { type: "Organic Farming", credits: 850, percentage: 22, color: "bg-emerald-500" },
    { type: "Agroforestry", credits: 1250, percentage: 32, color: "bg-green-500" },
    { type: "No-Till Agriculture", credits: 600, percentage: 15, color: "bg-teal-500" },
    { type: "Stubble Burning Avoidance", credits: 600, percentage: 15, color: "bg-cyan-500" },
    { type: "Regenerative Grazing", credits: 400, percentage: 10, color: "bg-lime-500" },
    { type: "Other Practices", credits: 200, percentage: 6, color: "bg-green-400" },
  ];

  // SDG Goals alignment
  const sdgGoals = [
    { goal: "Climate Action", icon: Globe, progress: 85 },
    { goal: "Zero Hunger", icon: Leaf, progress: 70 },
    { goal: "Life on Land", icon: Trees, progress: 78 },
    { goal: "Clean Water", icon: Droplets, progress: 65 },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userType="company"
      userName={currentCompany.name}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Environmental Impact Report
            </h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of your carbon offset initiatives
            </p>
          </div>
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4" />
            Download Full Report
          </Button>
        </div>

        {/* Key Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {totalCO2Offset.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Tons CO₂ Offset</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                +15.3% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Trees className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {treesEquivalent.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Trees Planted Equivalent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Factory className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {carsOffRoad.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Cars Off Road (Annual)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Wind className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {homesEnergy.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Homes Energy Saved (Annual)
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carbon Offset Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Carbon Credits by Practice Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {practiceBreakdown.map((practice) => (
                  <div key={practice.type}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${practice.color}`}
                        />
                        <span className="text-sm font-medium">
                          {practice.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {practice.credits.toLocaleString()} credits
                        </span>
                        <span className="text-sm font-semibold w-12 text-right">
                          {practice.percentage}%
                        </span>
                      </div>
                    </div>
                    <Progress value={practice.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Credits</span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {totalCredits.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SDG Alignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                UN SDG Alignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Your impact contributes to these Sustainable Development Goals
              </p>
              <div className="space-y-6">
                {sdgGoals.map((sdg) => (
                  <div key={sdg.goal}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <sdg.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{sdg.goal}</p>
                      </div>
                      <span className="text-sm font-semibold">
                        {sdg.progress}%
                      </span>
                    </div>
                    <Progress value={sdg.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Certificate */}
        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-background dark:from-emerald-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Carbon Neutral Certified
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your organization has successfully offset{" "}
                  {totalCO2Offset.toLocaleString()} tons of CO₂ through
                  verified carbon credits, contributing to global climate action
                  and sustainable development.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Valid: Jan 2024 - Dec 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>Certificate ID: #CC-2024-{currentCompany.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Impact Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold">Water Saved</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {(totalCO2Offset * 15000).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Liters annually</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold">Biodiversity</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {Math.round(totalCO2Offset * 0.5).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Hectares protected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Factory className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold">Farmers Supported</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {purchases.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Direct partnerships
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Continue Your Climate Journey
                </h3>
                <p className="text-primary-foreground/80">
                  Offset more carbon and increase your environmental impact
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="gap-2"
                asChild
              >
                <Link to="/marketplace">
                  Browse Carbon Credits
                  <TrendingUp className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanyImpactReport;
