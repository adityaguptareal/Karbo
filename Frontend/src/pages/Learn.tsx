import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Leaf, 
  Sprout, 
  Building2, 
  HelpCircle, 
  BookOpen,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  FileText,
  Shield,
  TrendingUp,
  Globe
} from "lucide-react";

const Learn = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const farmerSteps = [
    { title: "Register & Create Profile", description: "Sign up and provide your farm details, location, and sustainable practices." },
    { title: "Upload Documentation", description: "Submit land ownership proof, certifications, and photos of your eco-friendly practices." },
    { title: "Verification Process", description: "Our experts review your documents and verify your sustainable farming methods." },
    { title: "Earn Credits", description: "Receive carbon credits based on your verified eco-friendly practices." },
    { title: "Get Paid", description: "Sell your credits on the marketplace and withdraw earnings to your bank." },
  ];

  const companyBenefits = [
    { icon: Shield, title: "Compliance Ready", description: "Meet regulatory requirements with verified carbon credits and instant compliance reports." },
    { icon: TrendingUp, title: "Track Your Impact", description: "Monitor your carbon offset progress with detailed analytics and reporting." },
    { icon: Globe, title: "Support Farmers", description: "Directly support sustainable farmers around the world while meeting your goals." },
  ];

  const ecoPractices = [
    { name: "Organic Farming", description: "Chemical-free agriculture that preserves soil health and biodiversity." },
    { name: "No-Till Agriculture", description: "Minimizing soil disturbance to sequester carbon and prevent erosion." },
    { name: "Crop Rotation", description: "Alternating crops to maintain soil fertility and reduce pest pressure." },
    { name: "Avoiding Stubble Burning", description: "Preventing air pollution by managing crop residue sustainably." },
    { name: "Agroforestry", description: "Integrating trees with crops for carbon sequestration and biodiversity." },
    { name: "Cover Cropping", description: "Planting cover crops to protect and enrich soil between main crops." },
  ];

  const faqs = [
    {
      question: "What exactly is a carbon credit?",
      answer: "A carbon credit represents one metric ton of CO₂ that has been prevented from entering the atmosphere or removed from it. When farmers use sustainable practices, they generate these credits which companies can purchase to offset their own emissions."
    },
    {
      question: "How do farmers get paid?",
      answer: "Farmers receive payment when their credits are purchased by companies. Payments are processed securely and can be withdrawn to bank accounts. The platform takes a small commission to cover verification and operational costs."
    },
    {
      question: "How long does verification take?",
      answer: "The verification process typically takes 7-14 business days, depending on the complexity of the documentation and the type of eco-practice being verified. You'll receive updates throughout the process."
    },
    {
      question: "Are the credits internationally recognized?",
      answer: "Yes, our credits follow international verification standards and are recognized for corporate sustainability reporting. We provide compliance documentation for regulatory requirements."
    },
    {
      question: "What documentation do farmers need?",
      answer: "Farmers typically need to provide proof of land ownership, photos of farming practices, any existing certifications, and documentation of sustainable methods being used. Our team guides you through the process."
    },
    {
      question: "How is credit pricing determined?",
      answer: "Credit prices are set by the market based on factors like verification quality, eco-practice type, location, and demand. Premium practices like agroforestry typically command higher prices."
    },
  ];

  const glossary = [
    { term: "Carbon Credit", definition: "A tradeable certificate representing one metric ton of CO₂ reduced or removed." },
    { term: "Carbon Offset", definition: "The reduction of CO₂ emissions to compensate for emissions made elsewhere." },
    { term: "Verification", definition: "The process of confirming that claimed carbon reductions are real and measurable." },
    { term: "Sustainability Compliance", definition: "Meeting regulatory requirements for environmental impact and emissions." },
    { term: "Agroforestry", definition: "Land use management combining trees with crops or livestock." },
    { term: "Carbon Sequestration", definition: "The process of capturing and storing atmospheric CO₂." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Educational Hub</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Learn About Carbon Credits
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand how sustainable farming creates value and how companies can meet their sustainability goals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-4 h-auto p-1 bg-muted rounded-xl">
              <TabsTrigger value="overview" className="py-3 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow">
                <Leaf className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="farmers" className="py-3 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow">
                <Sprout className="w-4 h-4 mr-2" />
                Farmers
              </TabsTrigger>
              <TabsTrigger value="companies" className="py-3 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow">
                <Building2 className="w-4 h-4 mr-2" />
                Companies
              </TabsTrigger>
              <TabsTrigger value="faq" className="py-3 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-12">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-2xl p-8 border border-border mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">What Are Carbon Credits?</h2>
                  <p className="text-muted-foreground mb-6">
                    Carbon credits are tradeable certificates that represent the reduction of one metric ton of CO₂ from the atmosphere. 
                    When farmers use sustainable practices, they prevent greenhouse gas emissions and can earn credits that companies 
                    purchase to offset their own emissions.
                  </p>
                  <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Watch: How Carbon Credits Work</p>
                    </div>
                  </div>
                </div>

                {/* Flow Diagram */}
                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">The Journey of a Carbon Credit</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {[
                      { icon: Sprout, label: "Eco Practice", desc: "Farmer implements sustainable methods" },
                      { icon: FileText, label: "Verification", desc: "Documents reviewed by experts" },
                      { icon: Leaf, label: "Credit Created", desc: "Verified credits are issued" },
                      { icon: Building2, label: "Company Purchase", desc: "Credits bought for offsetting" },
                      { icon: Globe, label: "Planet Impact", desc: "CO₂ reduction verified" },
                    ].map((step, index) => (
                      <div key={step.label} className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <step.icon className="w-8 h-8 text-primary" />
                        </div>
                        <p className="font-semibold text-foreground text-sm">{step.label}</p>
                        <p className="text-xs text-muted-foreground max-w-[120px]">{step.desc}</p>
                        {index < 4 && <ArrowRight className="w-6 h-6 text-muted-foreground mt-4 hidden md:block rotate-0 md:rotate-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Farmers Tab */}
            <TabsContent value="farmers" className="space-y-12">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-2xl p-8 border border-border mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">How Farmers Earn Money</h2>
                  <p className="text-muted-foreground mb-8">
                    Your sustainable farming practices already help the planet. Now you can get rewarded for them. 
                    Here's how to turn your eco-friendly methods into income.
                  </p>
                  
                  <div className="space-y-4">
                    {farmerSteps.map((step, index) => (
                      <div key={step.title} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h3 className="font-display text-xl font-bold text-foreground mb-6">Qualifying Eco Practices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ecoPractices.map((practice) => (
                      <div key={practice.name} className="flex items-start gap-3 p-4 rounded-xl border border-border">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{practice.name}</p>
                          <p className="text-sm text-muted-foreground">{practice.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Companies Tab */}
            <TabsContent value="companies" className="space-y-12">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-2xl p-8 border border-border mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Why Companies Need Carbon Credits</h2>
                  <p className="text-muted-foreground mb-8">
                    Meet sustainability regulations, enhance your brand reputation, and make a genuine impact on climate change. 
                    Our marketplace makes it easy to find and purchase verified carbon credits.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {companyBenefits.map((benefit) => (
                      <div key={benefit.title} className="text-center p-6 rounded-xl bg-muted/50">
                        <benefit.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h3 className="font-display text-xl font-bold text-foreground mb-6">How It Works for Companies</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Browse Marketplace", desc: "Explore verified credits from sustainable farms worldwide with transparent pricing." },
                      { title: "Select & Purchase", desc: "Choose credits that match your sustainability goals and complete secure checkout." },
                      { title: "Receive Documentation", desc: "Get instant compliance reports and certificates of carbon offset." },
                      { title: "Track Your Impact", desc: "Monitor your sustainability progress with detailed analytics dashboards." },
                    ].map((step, index) => (
                      <div key={step.title} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                        <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-12">
              <div className="max-w-3xl mx-auto">
                <div className="bg-card rounded-2xl p-8 border border-border mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="text-left font-medium py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h3 className="font-display text-xl font-bold text-foreground mb-6">Glossary of Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {glossary.map((item) => (
                      <div key={item.term} className="p-4 rounded-xl bg-muted/50">
                        <p className="font-semibold text-foreground mb-1">{item.term}</p>
                        <p className="text-sm text-muted-foreground">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learn;
