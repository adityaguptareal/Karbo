import {
  FileCheck, Shield, Store, Wallet,
  Leaf, ArrowRight, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HowItWorksSection = () => {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Register & Verify",
      description: "Sign up and submit your farmland details with supporting documents. Our team reviews within 24-48 hours.",
      icon: FileCheck,
      color: "from-primary to-secondary",
      delay: "0.1s"
    },
    {
      title: "AI Verification",
      description: "Advanced AI analyzes satellite imagery and calculates your carbon sequestration potential accurately.",
      icon: Shield,
      color: "from-secondary to-accent",
      delay: "0.2s"
    },
    {
      title: "List Credits",
      description: "Verified carbon credits are automatically listed on our global marketplace at competitive rates.",
      icon: Store,
      color: "from-accent to-primary",
      delay: "0.3s"
    },
    {
      title: "Get Paid",
      description: "Companies purchase your credits and funds are instantly transferred to your secure wallet.",
      icon: Wallet,
      color: "from-primary to-secondary",
      delay: "0.4s"
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[0%] right-[10%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-primary/5 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-secondary/5 rounded-full blur-[100px] sm:blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left Side - Visual */}
          <div className="relative order-2 lg:order-1">
            {/* Main Image Card */}
            <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-card group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay" />
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop"
                alt="Sustainable Farming"
                className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay Stats Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-card/95 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-border/50 animate-float">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                      <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-base sm:text-lg">Carbon Offset</div>
                      <div className="text-xs text-muted-foreground">Verified & Active</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold text-primary">85%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
                  </div>
                  <div className="text-xs text-muted-foreground">24.5 tonnes CO₂ sequestered</div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-primary text-primary-foreground px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-xl animate-bounce-gentle">
              Verified ✓
            </div>
          </div>

          {/* Right Side - Steps */}
          <div className="space-y-8 sm:space-y-10 order-1 lg:order-2">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                Simple Process
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                How Karbo Works
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                From registration to payout, we've streamlined every step
                to make carbon trading accessible for everyone.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-5 sm:space-y-6">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 sm:gap-4 md:gap-5 group animate-fade-up opacity-0"
                  style={{ animationDelay: step.delay }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.color} p-[2px] group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-xl sm:rounded-2xl bg-card flex items-center justify-center">
                        <step.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow pt-0.5 sm:pt-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1 sm:mb-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                        Step {i + 1}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {step.description}
                    </p>

                    {/* Progress Line (except last item) */}
                    {i < steps.length - 1 && (
                      <div className="mt-4 sm:mt-6 ml-6 sm:ml-7 h-10 sm:h-12 w-[2px] bg-gradient-to-b from-primary/30 to-transparent" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Box */}
            <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Ready to start?</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                    Join over 2,500 farmers already earning from sustainable practices.
                  </p>
                  <button onClick={() => navigate('/register')} className="text-primary font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 hover:gap-2.5 sm:hover:gap-3 transition-all">
                    Get Started Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};