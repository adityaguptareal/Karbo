import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { platformStats, testimonials } from "@/data/mockData";
import { Leaf, TrendingUp, Users, Building2, Sprout, Earth, ArrowRight, Star, CheckCircle, Shield, Zap, Target, Globe, Award, Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', 'Inter', sans-serif;
          letter-spacing: -0.02em;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .gradient-animated {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        @media (max-width: 640px) {
          .card-hover:hover {
            transform: translateY(-4px);
          }
        }
      `}</style>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-12 md:pt-24 md:pb-28 lg:pt-20px lg:pb-32 overflow-hidden">
        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-80 h-80 md:w-[500px] md:h-[500px] bg-green-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="space-y-4 md:space-y-8 animate-slide-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-700 shadow-sm backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide">
                    Verified Carbon Credits Platform
                  </span>
                </div>
                
                {/* Headline */}
                <div className="space-y-3 md:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-tight">
                    Connect Sustainable
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-500 mt-1 md:mt-2 gradient-animated">
                      Farming with Impact
                    </span>
                  </h1>
                  
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                    A transparent platform linking eco-conscious farmers with companies seeking verified carbon credits. Real impact, real value.
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex gap-2.5 pt-1 max-w-md">
                  <Button size="default" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base h-11 sm:h-12 px-4 sm:px-6 group flex-1" asChild>
                    <Link to="/register?type=farmer" className="gap-2">
                      <Sprout className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Join as Farmer
                    </Link>
                  </Button>
                  <Button size="default" className="border-2 border-emerald-800 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 bg-white dark:bg-card transition-all duration-300 text-sm sm:text-base h-11 sm:h-12 px-4 sm:px-6 group flex-1 font-bold shadow-sm" asChild>
                    <Link to="/register?type=company" className="gap-2">
                      <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Find Credits
                    </Link>
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3 sm:gap-6 pt-1 sm:pt-4">
                  {[
                    { icon: CheckCircle, text: 'Verified Credits', color: 'emerald' },
                    { icon: Shield, text: 'Secure Platform', color: 'blue' },
                    { icon: Zap, text: 'Instant Reports', color: 'purple' }
                  ].map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2 group cursor-default">
                      <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-${badge.color}-100 to-${badge.color}-200 dark:from-${badge.color}-900/30 dark:to-${badge.color}-800/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                        <badge.icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 text-${badge.color}-600 dark:text-${badge.color}-400`} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative lg:block animate-float">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  {/* Main Card */}
                  <div className="bg-white/80 dark:bg-card/80 backdrop-blur-xl border-2 border-border rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Total Credits Traded</div>
                          <div className="text-3xl font-bold text-foreground">{platformStats.totalCreditsTraded.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end">
                          <TrendingUp className="w-4 h-4" />
                          +12.5%
                        </div>
                        <div className="text-xs text-muted-foreground">this month</div>
                      </div>
                    </div>
                    
                    {/* Chart */}
                    <div className="h-32 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl flex items-end justify-around p-4 gap-2">
                      {[45, 70, 50, 85, 65, 95, 80].map((height, i) => (
                        <div 
                          key={i} 
                          className="w-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-green-500 rounded-t-lg transition-all duration-500 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-400 cursor-pointer" 
                          style={{ 
                            height: `${height}%`,
                            animation: `slide-up 0.8s ease-out forwards ${i * 0.1}s`
                          }} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Floating Cards */}
                  <div className="hidden lg:block absolute -top-8 -right-8 bg-white dark:bg-card border-2 border-border rounded-2xl p-5 shadow-xl backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-2xl text-foreground">{platformStats.activeFarmers}</div>
                        <div className="text-xs text-muted-foreground font-medium">Active Farmers</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block absolute -bottom-8 -left-8 bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-2xl p-5 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Leaf className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-2xl">{(platformStats.co2Offset / 1000).toFixed(1)}K</div>
                        <div className="text-xs text-emerald-100 font-medium">Tons CO₂ Offset</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 md:mt-24 pt-8 md:pt-12 border-t border-border/50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
                {[
                  { value: `${platformStats.activeFarmers.toLocaleString()}+`, label: 'Active Farmers', icon: Users, color: 'emerald' },
                  { value: `${platformStats.activeCompanies}+`, label: 'Companies', icon: Building2, color: 'blue' },
                  { value: `${(platformStats.co2Offset / 1000).toFixed(0)}K`, label: 'Tons CO₂ Offset', icon: Leaf, color: 'green' },
                  { value: `₹${(platformStats.totalTransactionValue / 100000).toFixed(1)}L`, label: 'Total Value', icon: TrendingUp, color: 'purple' }
                ].map((stat, i) => (
                  <div key={i} className="text-center group cursor-default">
                    <div className="flex items-center justify-center mb-2 md:mb-3">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 dark:from-${stat.color}-900/30 dark:to-${stat.color}-800/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-5 h-5 md:w-6 md:h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                    </div>
                    <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground group-hover:scale-105 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-base text-muted-foreground mt-1 md:mt-2 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-28 lg:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 mb-4 md:mb-6">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Built for Everyone
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-3 md:mb-6">
                Your Role, Your Impact
              </h2>
              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you're reducing emissions or earning from sustainable practices, we've got you covered
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-10">
              {/* Farmers */}
              <div className="group bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-border hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-500 card-hover shadow-lg hover:shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl flex-shrink-0">
                    <Sprout className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground leading-tight">For Farmers</h3>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                  Transform your eco-friendly farming practices into verified carbon credits and earn additional income.
                </p>
                <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                  {['Upload farming proof', 'Get expert verification', 'List carbon credits', 'Receive direct payments'].map((item, i) => (
                    <li key={item} className="flex items-start gap-2 text-xs sm:text-sm lg:text-base opacity-0 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/learn#farmers" className="inline-flex items-center text-xs sm:text-sm lg:text-base font-bold text-emerald-600 dark:text-emerald-400 group/link hover:gap-3 transition-all duration-300">
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>

              {/* Companies */}
              <div className="group bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-border hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-500 card-hover shadow-lg hover:shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl flex-shrink-0">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground leading-tight">For Companies</h3>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                  Meet sustainability goals with verified carbon credits from trusted sources worldwide.
                </p>
                <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                  {['Browse verified credits', 'Transparent marketplace', 'Instant compliance reports', 'Track impact dashboard'].map((item, i) => (
                    <li key={item} className="flex items-start gap-2 text-xs sm:text-sm lg:text-base opacity-0 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/learn#companies" className="inline-flex items-center text-xs sm:text-sm lg:text-base font-bold text-blue-600 dark:text-blue-400 group/link hover:gap-3 transition-all duration-300">
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>

              {/* Planet */}
              <div className="group bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-border hover:border-teal-400 dark:hover:border-teal-600 transition-all duration-500 card-hover shadow-lg hover:shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl flex-shrink-0">
                    <Earth className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground leading-tight">For the Planet</h3>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                  Every transaction supports global carbon reduction and sustainable farming practices.
                </p>
                <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                  {['Verified carbon reduction', 'Support local farmers', 'Biodiversity protection', 'Transparent tracking'].map((item, i) => (
                    <li key={item} className="flex items-start gap-2 text-xs sm:text-sm lg:text-base opacity-0 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/learn" className="inline-flex items-center text-xs sm:text-sm lg:text-base font-bold text-teal-600 dark:text-teal-400 group/link hover:gap-3 transition-all duration-300">
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 md:py-28 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 dark:from-emerald-900 dark:via-green-900 dark:to-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-3 md:mb-4">Why Trust Us?</h2>
              <p className="text-base md:text-lg text-emerald-50 max-w-2xl mx-auto">
                Built on transparency, verified by experts, trusted by thousands
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 lg:gap-12">
              {[
                { icon: Shield, title: '100% Verified', desc: 'Every credit undergoes rigorous third-party verification before marketplace listing', stat: '10K+ Credits Verified' },
                { icon: Globe, title: 'Global Network', desc: 'Connect with verified farmers and sustainable projects across multiple countries', stat: '25+ Countries' },
                { icon: Activity, title: 'Fair Pricing', desc: 'Market-driven transparent pricing with zero hidden fees or commissions', stat: '0% Hidden Fees' }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105 cursor-default"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <item.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl md:text-2xl mb-2 md:mb-3">{item.title}</h4>
                  <p className="text-sm md:text-base text-emerald-50 leading-relaxed mb-3 md:mb-4">
                    {item.desc}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 border border-white/20">
                    <span className="text-xs md:text-sm font-bold">{item.stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-28 lg:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 mb-4 md:mb-6">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Trusted by Thousands
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-3 md:mb-6">
                What Our Users Say
              </h2>
              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Join farmers and companies already making a real impact on the planet
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, i) => (
                <div 
                  key={testimonial.id} 
                  className="group bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-8 border-2 border-border hover:border-amber-300 dark:hover:border-amber-700 card-hover shadow-lg hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="flex items-center gap-1.5 mb-4 md:mb-5">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400 animate-pulse" style={{ animationDelay: `${idx * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-foreground mb-4 md:mb-6 leading-relaxed italic font-medium">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-border">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-emerald-200 dark:ring-emerald-800 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div>
                      <div className="font-bold text-sm md:text-base text-foreground">{testimonial.name}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-28 lg:py-32 bg-gradient-to-br from-emerald-50 via-green-50/30 to-background dark:from-emerald-950/20 dark:via-green-950/10 dark:to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-400/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 dark:bg-card/90 backdrop-blur-xl border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 lg:p-20 text-center shadow-2xl">
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 border border-emerald-300 dark:border-emerald-700 mb-5 md:mb-8 shadow-sm">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs md:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Join 1,200+ Active Users
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 md:mb-6 leading-tight">
                Ready to Make
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 mt-1 md:mt-2">
                  an Impact?
                </span>
              </h2>
              
              <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands creating a sustainable future through transparent carbon credit trading. Start making a difference today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6 md:mb-10">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-sm md:text-base h-12 md:h-14 px-8 md:px-10 w-full sm:w-auto group" asChild>
                  <Link to="/register" className="gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" className="border-2 border-emerald-800 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 bg-white dark:bg-card transition-all duration-300 text-sm md:text-base h-12 md:h-14 px-8 md:px-10 w-full sm:w-auto font-bold shadow-sm" asChild>
                  <Link to="/learn">Explore Platform</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Setup in 5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;