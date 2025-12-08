import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { platformStats, testimonials } from "@/data/mockData";
import { 
  Leaf, TrendingUp, Users, Building2, Sprout, Earth, ArrowRight, Star, 
  CheckCircle, Shield, Zap, Target, Globe, Award, Activity, 
  BarChart3, PieChart, ArrowUpRight, Lock, Recycle 
} from "lucide-react";
import { cn } from "@/lib/utils";


const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-secondary/20 backdrop-blur-sm animate-fade-up opacity-0 " style={{ animationDelay: '0.1s' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="text-sm font-medium text-secondary-foreground">Reimagining Carbon Credits</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground leading-[1.1] animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
              Invest in <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600">
                Our Planet's Future
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
              Karbo connects sustainable farmers with forward-thinking companies. 
              Transparent, verified, and impactful carbon trading for a greener tomorrow.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up opacity-0" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 bg-secondary" asChild>
                <Link to="/register">
                  Start Trading Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-transparent hover:text-black/10 transition-all" asChild>
                <Link to="/learn">
                  How it Works
                </Link>
              </Button>
            </div>

            {/* Stats Preview */}
            <div className="pt-12 md:pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 animate-fade-up opacity-0" style={{ animationDelay: '0.6s' }}>
              {[
                { label: "Active Farmers", value: "2,500+", icon: Users },
                { label: "Carbon Offset", value: "150k T", icon: Leaf },
                { label: "Corporate Partners", value: "120+", icon: Building2 },
                { label: "Market Volume", value: "$4.2M", icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                  <div className="p-3 rounded-2xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                    <stat.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Karbo?</h2>
            <p className="text-lg text-muted-foreground">
              We've built a platform that removes the friction from carbon trading, 
              ensuring every credit is real, verified, and impactful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Large Card Left */}
            <div className="md:col-span-2 bg-card border border-border/50 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Bank-Grade Verification</h3>
                <p className="text-muted-foreground text-lg max-w-md mb-8">
                  Every single carbon credit on our platform undergoes a rigorous 3-step verification process involving satellite imagery, AI analysis, and on-ground audits.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">AI Analysis</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Satellite Data</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Field Audits</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Blockchain Ledger</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tall Card Right */}
            <div className="md:row-span-2 bg-gradient-to-b from-primary/5 to-transparent border border-border/50 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Farmers</h3>
                <p className="text-muted-foreground mb-8 flex-grow">
                  Turn your sustainable practices into a new revenue stream. We simplify the complex world of carbon markets for you.
                </p>
                
                <div className="space-y-4 mt-auto">
                  <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Estimated Earnings</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div className="text-2xl font-bold">₹45,000<span className="text-sm text-muted-foreground font-normal">/yr</span></div>
                  </div>
                  <Button className="w-full" variant="outline">Learn More</Button>
                </div>
              </div>
            </div>

            {/* Small Card Bottom Left */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 group hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Marketplace</h3>
              <p className="text-muted-foreground text-sm">
                Access a worldwide network of buyers and sellers. No borders, just impact.
              </p>
            </div>

            {/* Small Card Bottom Middle */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 group hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Settlement</h3>
              <p className="text-muted-foreground text-sm">
                Smart contracts ensure payments are released immediately upon verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Steps) --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl rotate-3 opacity-20 blur-lg" />
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
                alt="Sustainable Farming" 
                className="relative rounded-3xl shadow-2xl border-4 border-white dark:border-card object-cover h-[600px] w-full"
              />
              
              {/* Floating Card */}
              <div className="absolute bottom-8 -left-8 bg-card p-6 rounded-2xl shadow-xl border border-border/50 max-w-xs animate-float">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold">Carbon Offset</div>
                    <div className="text-xs text-muted-foreground">Verified Successfully</div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-green-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">Simple, Transparent, Effective.</h2>
                <p className="text-lg text-muted-foreground">
                  We've streamlined the entire process so you can focus on what matters most—making a difference.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Register & Upload", desc: "Farmers list their land and sustainable practices with proof.", icon: FileCheck },
                  { title: "Verification", desc: "Our AI & experts verify the data to calculate carbon credits.", icon: Shield },
                  { title: "Marketplace Listing", desc: "Verified credits are listed for companies to purchase.", icon: Store },
                  { title: "Direct Payment", desc: "Funds are transferred directly to the farmer's wallet.", icon: Wallet },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Marquee) --- */}
      <section className="py-24 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Trusted by the Best</h2>
          <p className="text-lg text-muted-foreground">Join a community of changemakers.</p>
        </div>

        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex gap-6 py-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="inline-block w-[350px] md:w-[400px] p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all whitespace-normal">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-6 py-4">
             {/* Duplicate for seamless loop - handled by CSS usually, but here simplified structure */}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-8 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to make an impact?</h2>
              <p className="text-xl opacity-90">
                Join thousands of farmers and companies building a sustainable future together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full font-bold" asChild>
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Missing icons import fix
import { FileCheck, Store, Wallet } from "lucide-react";

export default Index;