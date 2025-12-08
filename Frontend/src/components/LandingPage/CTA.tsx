import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export const CTASection = () => {
  const benefits = [
    "No upfront costs or hidden fees",
    "Get verified in 24-48 hours",
    "Start earning immediately",
    "24/7 dedicated support"
  ];

  return (
    <section className="py-16 md:py-20 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-6xl mx-auto">
          
          {/* Main CTA Card */}
          <div className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-primary" />
            
            {/* Animated Blobs (if any, not provided in snippet) */}
            
            {/* Content */}
            <div className="relative z-10 px-4 sm:px-8 md:px-16 py-10 md:py-16 lg:py-20 text-center">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs sm:text-sm font-medium mb-5 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Join 2,500+ Farmers Today
              </div>
              
              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 leading-tight tracking-tight animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
                Ready to Make
                <br />
                an Impact?
              </h2>
              
              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
                Join the sustainable revolution. Turn your eco-friendly practices 
                into a reliable income stream while healing our planet.
              </p>
              
              {/* Benefits List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8 animate-fade-up opacity-0" style={{ animationDelay: '0.4s' }}>
                {benefits.map((benefit, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-full text-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-sm md:text-base font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up opacity-0" style={{ animationDelay: '0.5s' }}>
                <Button 
                  size="lg" 
                  className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base md:text-lg rounded-full bg-white text-primary hover:bg-white/90 font-bold shadow-2xl shadow-black/20 hover:scale-105 transition-all w-full sm:w-auto" 
                  asChild
                >
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base md:text-lg rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold transition-all w-full sm:w-auto" 
                  asChild
                >
                  <Link to="/contact">
                    Talk to Sales
                  </Link>
                </Button>
              </div>
              
              {/* Trust Badge */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-white/80 text-xs sm:text-sm animate-fade-up opacity-0" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Free to join</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>No credit card required</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="hidden lg:block">
            {/* Left Card */}
            <div className="absolute -left-12 top-1/4 w-48 p-5 rounded-2xl bg-card border border-border/50 shadow-xl animate-float">
              <div className="text-3xl font-bold text-foreground mb-1">₹45K</div>
              <div className="text-sm text-muted-foreground">Avg. Annual Earnings</div>
            </div>
            
            {/* Right Card */}
            <div className="absolute -right-12 bottom-1/4 w-48 p-5 rounded-2xl bg-card border border-border/50 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-3xl font-bold text-foreground mb-1">24-48h</div>
              <div className="text-sm text-muted-foreground">Verification Time</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};