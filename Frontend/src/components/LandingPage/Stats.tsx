import { 
  TrendingUp, Users, Leaf, Building2, 
  Globe, Sprout, TreePine, Droplets 
} from "lucide-react";

export const StatsImpactSection = () => {
  const mainStats = [
    {
      value: "150K+",
      label: "Tonnes CO₂ Offset",
      icon: Leaf,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Equivalent to removing 32,000 cars from roads"
    },
    {
      value: "2,500+",
      label: "Active Farmers",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "Across 15+ states in India"
    },
    {
      value: "₹4.2M",
      label: "Total Payouts",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Directly to farmer wallets"
    },
    {
      value: "120+",
      label: "Corporate Partners",
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Leading sustainable businesses"
    },
  ];

  const impactMetrics = [
    {
      icon: TreePine,
      value: "50K+",
      label: "Trees Equivalent",
      color: "from-lime-500 to-green-600"
    },
    {
      icon: Globe,
      value: "15",
      label: "States Covered",
      color: "from-lime-500 to-green-600"
    },
    {
      icon: Sprout,
      value: "85%",
      label: "Organic Farms",
      color: "from-lime-500 to-green-600"
    },
    {
      icon: Droplets,
      value: "30%",
      label: "Water Saved",
      color: "from-lime-500 to-green-600"
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 leaf-pattern opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Real Impact, Real Numbers
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Our Environmental Impact
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Every credit traded on Karbo represents real, measurable environmental 
            change. Here's what we've achieved together.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          {mainStats.map((stat, i) => (
            <div
              key={i}
              className="group relative p-6 md:p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-base font-semibold text-foreground mb-3">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Metrics Bar */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-[2rem] blur-2xl" />
          
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 md:p-12">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Additional Impact Metrics
              </h3>
              <p className="text-muted-foreground">
                Beyond carbon credits, we're transforming entire ecosystems
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {impactMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-background/50 to-muted/30 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Icon with Gradient */}
                  <div className="relative inline-block mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.color} p-[2px]`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                        <metric.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Value */}
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {metric.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Counter Section */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-primary/10 border border-primary/20">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <span className="text-sm font-medium text-primary">
              Live Carbon Offset Counter: <span className="font-bold">150,234 tonnes</span> and counting...
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};