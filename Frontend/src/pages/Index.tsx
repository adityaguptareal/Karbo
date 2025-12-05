import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatsCard } from "@/components/shared/StatsCard";
import { platformStats, testimonials } from "@/data/mockData";
import { Leaf, TrendingUp, Users, Globe, Sprout, Building2, Earth, ArrowRight, Star, CheckCircle, Shield } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center px-[5px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
              <Leaf className="w-4 h-4" />
              <span>Sustainable Future Starts Here</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{
            animationDelay: '0.1s'
          }}>
              Turn Sustainable Farming into{" "}
              <span className="text-emerald-600">Earnings</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{
            animationDelay: '0.2s'
          }}>
              Connect eco-friendly farmers with companies seeking verified carbon credits. 
              Together, we're building a greener, more sustainable world.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{
            animationDelay: '0.3s'
          }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/register?type=farmer">
                  <Sprout className="w-5 h-5 mr-2" />
                  I'm a Farmer
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/register?type=company">
                  <Building2 className="w-5 h-5 mr-2" />
                  I Need Credits
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Credits Traded" value={platformStats.totalCreditsTraded.toLocaleString()} subtitle="Total carbon credits" icon={TrendingUp} variant="primary" trend={{
            value: 12.5,
            isPositive: true
          }} />
            <StatsCard title="Active Farmers" value={platformStats.activeFarmers.toLocaleString()} subtitle="Verified farmers" icon={Users} variant="secondary" trend={{
            value: 8.2,
            isPositive: true
          }} />
            <StatsCard title="CO₂ Offset" value={`${(platformStats.co2Offset / 1000).toFixed(1)}K`} subtitle="Tons of CO₂" icon={Globe} variant="accent" trend={{
            value: 15.3,
            isPositive: true
          }} />
            <StatsCard title="Companies" value={platformStats.activeCompanies} subtitle="Active buyers" icon={Building2} trend={{
            value: 6.7,
            isPositive: true
          }} />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform connects sustainable farmers with companies, creating a transparent marketplace for verified carbon credits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Farmers */}
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sprout className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">For Farmers</h3>
              <p className="text-muted-foreground mb-6">
                Turn your sustainable farming practices into additional income. Get verified, earn credits, and receive payments directly.
              </p>
              <ul className="space-y-3 mb-6">
                {['Upload farming documentation', 'Get verified by experts', 'Earn carbon credits', 'Receive payments'].map(item => <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    {item}
                  </li>)}
              </ul>
              <Link to="/learn#farmers" className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* For Companies */}
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">For Companies</h3>
              <p className="text-muted-foreground mb-6">
                Meet your sustainability goals with verified carbon credits. Browse, purchase, and receive compliance reports instantly.
              </p>
              <ul className="space-y-3 mb-6">
                {['Browse verified credits', 'Transparent pricing', 'Instant compliance reports', 'Track your impact'].map(item => <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    {item}
                  </li>)}
              </ul>
              <Link to="/learn#companies" className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* For the Planet */}
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Earth className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">For the Planet</h3>
              <p className="text-muted-foreground mb-6">
                Every credit purchased supports sustainable farming and reduces global carbon emissions. Together, we make a difference.
              </p>
              <ul className="space-y-3 mb-6">
                {['Verified carbon reduction', 'Support local farmers', 'Biodiversity protection', 'Transparent tracking'].map(item => <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    {item}
                  </li>)}
              </ul>
              <Link to="/learn" className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="w-10 h-10 mx-auto mb-4 opacity-90" />
              <h4 className="text-xl font-semibold mb-2">Verified Credits</h4>
              <p className="text-primary-foreground/80">Every credit is verified by independent experts before listing</p>
            </div>
            <div>
              <Globe className="w-10 h-10 mx-auto mb-4 opacity-90" />
              <h4 className="text-xl font-semibold mb-2">Global Marketplace</h4>
              <p className="text-primary-foreground/80">Connect with farmers and companies from around the world</p>
            </div>
            <div>
              <TrendingUp className="w-10 h-10 mx-auto mb-4 opacity-90" />
              <h4 className="text-xl font-semibold mb-2">Transparent Pricing</h4>
              <p className="text-primary-foreground/80">Fair market prices with complete fee transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of farmers and companies already making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => <div key={testimonial.id} className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Join our marketplace today and be part of the sustainable revolution. 
            Whether you're a farmer or a company, there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/learn">Learn How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;