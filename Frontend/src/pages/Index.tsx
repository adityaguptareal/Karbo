import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/LandingPage/Hero";
import { BentoFeaturesGrid } from "@/components/LandingPage/BentroGrid";
import { HowItWorksSection } from "@/components/LandingPage/HowItWorks";
import { StatsImpactSection } from "@/components/LandingPage/Stats";
import { TestimonialsSection } from "@/components/LandingPage/Testimonials";
import { CTASection } from "@/components/LandingPage/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main>
        <HeroSection />
        <StatsImpactSection />
        <BentoFeaturesGrid />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;