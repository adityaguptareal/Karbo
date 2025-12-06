import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatsCard } from "@/components/shared/StatsCard";
import { platformStats, testimonials } from "@/data/mockData";
import { Leaf, TrendingUp, Users, Globe, Sprout, Building2, Earth, ArrowRight, Star, CheckCircle, Shield, ChevronDown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Full Viewport */}
      <section className="relative md:pt-0  h-[calc(100vh-64px)] min-h-[600px] flex items-center overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-background to-emerald-50/30 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                  <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Verified Carbon Credit Marketplace
                  </span>
                </div>
                
                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    Connect Sustainable
                    <span className="block text-emerald-600 dark:text-emerald-400 mt-2">
                      Farming with Impact
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                    A transparent platform linking eco-conscious farmers with companies seeking verified carbon credits to meet sustainability goals.
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20" asChild>
                    <Link to="/register?type=farmer" className="gap-2">
                      <Sprout className="w-5 h-5" />
                      Join as Farmer
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2" asChild>
                    <Link to="/register?type=company" className="gap-2">
                      <Building2 className="w-5 h-5" />
                      Find Credits
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span>Verified Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span>Transparent Pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span>Instant Reports</span>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="hidden lg:block relative">
                {/* Stats Cards Floating */}
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                        +12.5%
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">
                      {platformStats.totalCreditsTraded.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Carbon Credits Traded</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-xl p-4 shadow-md">
                      <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
                      <p className="text-2xl font-bold text-foreground">
                        {platformStats.activeFarmers.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Active Farmers</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 shadow-md">
                      <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
                      <p className="text-2xl font-bold text-foreground">
                        {platformStats.activeCompanies}+
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Companies</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-8 h-8 opacity-90" />
                      <p className="text-3xl font-bold">
                        {(platformStats.co2Offset / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <p className="text-emerald-50">Tons of CO₂ Offset</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </section>

      {/* ALL sections below wrapped in desktop-only visibility */}
      <div className="hidden md:block">
        {/* How It Works */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Built for Everyone
              </h2>
              <p className="text-lg text-muted-foreground">
                Whether you're reducing emissions or earning from sustainable practices, our platform makes it simple and transparent.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* For Farmers */}
              <div className="group bg-card rounded-2xl p-8 border border-border hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sprout className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">For Farmers</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Transform your eco-friendly farming practices into verified carbon credits and earn additional income.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Upload farming proof',
                    'Get expert verification',
                    'List carbon credits',
                    'Receive direct payments'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/learn#farmers"
                  className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium hover:gap-2 transition-all group"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* For Companies */}
              <div className="group bg-card rounded-2xl p-8 border border-border hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">For Companies</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Meet sustainability goals with verified carbon credits from trusted sources worldwide.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Browse verified credits',
                    'Transparent marketplace',
                    'Instant compliance reports',
                    'Track impact dashboard'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/learn#companies"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:gap-2 transition-all group"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* For the Planet */}
              <div className="group bg-card rounded-2xl p-8 border border-border hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl transition-all md:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Earth className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">For the Planet</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every transaction supports global carbon reduction and sustainable farming practices.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Verified carbon reduction',
                    'Support local farmers',
                    'Biodiversity protection',
                    'Transparent tracking'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/learn"
                  className="inline-flex items-center text-teal-600 dark:text-teal-400 font-medium hover:gap-2 transition-all group"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-emerald-600 dark:bg-emerald-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">100% Verified</h4>
                <p className="text-emerald-50 leading-relaxed">
                  Every credit undergoes rigorous third-party verification before marketplace listing
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Global Network</h4>
                <p className="text-emerald-50 leading-relaxed">
                  Connect with verified farmers and sustainable projects across multiple countries
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Fair Pricing</h4>
                <p className="text-emerald-50 leading-relaxed">
                  Market-driven transparent pricing with zero hidden fees or commissions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-lg text-muted-foreground">
                Join farmers and companies already making an impact through sustainable carbon trading
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-border"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-50 via-background to-emerald-50/50 dark:from-emerald-950/10 dark:via-background dark:to-emerald-900/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Ready to Make an Impact?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of farmers and companies creating a sustainable future through transparent carbon credit trading.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg" asChild>
                  <Link to="/register" className="gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2" asChild>
                  <Link to="/learn">Explore Platform</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
