import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Leaf, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />
        
        {/* Subtle leaf pattern overlay */}
        <div className="absolute inset-0 leaf-pattern opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Transforming Carbon Markets</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground leading-[1.05] animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
           Your Carbon Credit 
            <br />
            <span className="">
        Marketplace
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
            Karbo is a marketplace for carbon credits, connecting companies with farmers to offset their carbon footprint.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up opacity-0" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 bg-primary hover:bg-primary/90" 
              asChild onClick={()=>{navigate('/register'); window.scrollTo({top: 0, behavior: 'smooth'})}}
            >
              <Link to="/register">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-lg rounded-full border-2 hover:bg-transparent hover:border-primary hover:text-primary transition-all" 
              asChild 
              onClick={()=>{navigate('/learn'); window.scrollTo({top: 0, behavior: 'smooth'})}}
            >
              <Link to="/learn">
                Explore Platform
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="pt-12 md:pt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-up opacity-0" style={{ animationDelay: '0.6s' }}>
            {[
              { label: "Active Farmers", value: "2,500+", icon: Users, color: "text-primary" },
              { label: "Carbon Offset", value: "150k T", icon: Leaf, color: "text-secondary" },
              { label: "Corporate Partners", value: "120+", icon: Building2, color: "text-accent" },
              { label: "Market Volume", value: "$4.2M", icon: TrendingUp, color: "text-primary" },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <stat.icon className={`w-6 h-6 ${stat.color} transition-transform group-hover:scale-110`} />
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};