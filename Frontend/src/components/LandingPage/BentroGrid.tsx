import { Button } from "@/components/ui/button";
import { 
  Shield, Sprout, Globe, Zap, CheckCircle, 
  TrendingUp, Lock, BarChart3, Leaf 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BentoFeaturesGrid = () => {
    const navigate = useNavigate();
  return (
    <section className="py-20 md:py-32 bg-gradient-nature relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Why Choose Karbo?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Built for transparency, designed for impact. Every feature ensures 
            authentic carbon trading that benefits both farmers and our planet.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto">
          
          {/* Large Feature Card - Verification (spans 8 cols) */}
          <div className="md:col-span-6 lg:col-span-8 bg-card rounded-3xl md:rounded-[2rem] p-8 md:p-12 relative overflow-hidden group  transition-all duration-500 border border-border/50">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Bank-Grade Verification
              </h3>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                Every carbon credit undergoes rigorous 3-step verification combining 
                satellite imagery, AI analysis, and field audits. No greenwashing, 
                only genuine environmental impact.
              </p>
              
              {/* Verification Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: CheckCircle, label: "AI Analysis" },
                  { icon: CheckCircle, label: "Satellite Data" },
                  { icon: CheckCircle, label: "Field Audits" },
                  { icon: CheckCircle, label: "Blockchain Ledger" },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 hover:bg-background/80 transition-all group/item"
                  >
                    <item.icon className="w-5 h-5 text-primary flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                    <span className="font-medium text-sm md:text-base text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tall Feature Card - For Farmers (spans 4 cols) */}
          <div className="md:col-span-6 lg:col-span-4 lg:row-span-2 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-3xl md:rounded-[2rem] p-8 md:p-10 relative overflow-hidden group transition-all duration-500 border border-border/50">
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Sprout className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Empowering Farmers
              </h3>
              
              <p className="text-muted-foreground text-base leading-relaxed mb-8 flex-grow">
                Transform your sustainable practices into steady income. 
                We handle the complexity of carbon markets so you can focus 
                on what you do best—nurturing the land.
              </p>
              
              {/* Earnings Card */}
              <div className="space-y-4 mt-auto">
                <div className="p-5 md:p-6 rounded-2xl bg-card border border-border/50 shadow-sm  transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-muted-foreground">Avg. Annual Earnings</span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </span>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    ₹45,000
                    <span className="text-base text-muted-foreground font-normal">/year</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                  </div>
                </div>
                
                <Button onClick={() => { navigate('/learn'); window.scrollTo(0, 0); }} className="w-full rounded-md" variant="default" size="lg">
                  See How It Works
                </Button>
              </div>
            </div>
          </div>

          {/* Medium Card - Global Marketplace */}
          <div className="md:col-span-3 lg:col-span-4 bg-card rounded-3xl md:rounded-[2rem] p-6 md:p-8 group  transition-all duration-500 border border-border/50 hover:border-primary/30">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
              <Globe className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">Global Marketplace</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Connect with buyers and sellers worldwide. Real-time pricing, 
              transparent transactions, zero boundaries.
            </p>
            
            {/* Mini Stats */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 p-3 rounded-lg bg-muted/50 text-center">
                <div className="text-lg font-bold text-foreground">120+</div>
                <div className="text-xs text-muted-foreground">Countries</div>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-muted/50 text-center">
                <div className="text-lg font-bold text-foreground">24/7</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>

          {/* Medium Card - Instant Settlement */}
          <div className="md:col-span-3 lg:col-span-4 bg-card rounded-3xl md:rounded-[2rem] p-6 md:p-8 group transition-all duration-500 border border-border/50 hover:border-primary/30">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">Instant Settlement</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Smart contracts ensure payments are released immediately upon 
              verification. No delays, no disputes.
            </p>
            
            {/* Progress Animation */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Transaction Speed</span>
                <span className="font-bold text-foreground">~2 min</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[95%] bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Wide Card - Security & Trust */}
          <div className="md:col-span-6 lg:col-span-8 bg-gradient-to-r from-card to-muted/30 rounded-3xl md:rounded-[2rem] p-6 md:p-8 relative overflow-hidden group  transition-all duration-500 border border-border/50">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Lock className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                  Enterprise-Grade Security
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Your data is protected with military-grade encryption. 
                  Blockchain-backed transparency ensures every transaction is 
                  immutable and verifiable.
                </p>
              </div>
              
              <div className="flex gap-3 flex-shrink-0">
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};