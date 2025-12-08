import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Organic Farmer, Punjab",
    content: "Karbo transformed my farming income. I'm now earning an additional ₹50,000 annually just by following the sustainable practices I was already doing. The verification process was smooth and transparent.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Sustainability Lead, TechCorp",
    content: "Finding verified carbon credits used to be a nightmare. Karbo's platform made it incredibly simple. We offset our entire company's carbon footprint in just 48 hours. Highly recommended!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5
  },
  {
    name: "Mohammed Ali",
    role: "Rice Farmer, Kerala",
    content: "The best decision I made for my farm. Not only am I contributing to the environment, but the extra income has helped me invest in better equipment and education for my children.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
    rating: 5
  },
  {
    name: "Sarah Thompson",
    role: "CSR Director, GreenTech Solutions",
    content: "Transparency is everything in carbon markets. Karbo's blockchain-backed verification gives us complete confidence that our investments are making real environmental impact.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5
  },
  {
    name: "Amit Patel",
    role: "Agroforestry Specialist, Gujarat",
    content: "I was skeptical about carbon trading at first, but Karbo's team guided me through everything. The platform is user-friendly, and payments are always on time. Five stars!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    rating: 5
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-muted/30 to-background overflow-hidden relative">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4 mb-12 md:mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Star className="w-4 h-4 fill-primary" />
          Testimonials
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-foreground">
          Trusted by Thousands
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join a growing community of farmers and businesses building a sustainable future together.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Content */}
        <div className="flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-4 sm:gap-6 py-4">
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <TestimonialCard key={`first-${i}`} testimonial={testimonial} />
            ))}
          </div>
          <div className="animate-marquee whitespace-nowrap flex gap-4 sm:gap-6 py-4">
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <TestimonialCard key={`second-${i}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 mt-12 md:mt-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {[
            { value: "4.9/5", label: "Average Rating" },
            { value: "2,500+", label: "Happy Farmers" },
            { value: "120+", label: "Corporate Partners" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30  transition-all"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className="inline-block w-[calc(100vw-40px)] sm:w-[350px] md:w-[420px] p-5 sm:p-6 md:p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 whitespace-normal group">
      {/* Quote Icon */}
      <div className="mb-3 sm:mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
        {[...Array(testimonial.rating)].map((_, j) => (
          <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 leading-relaxed text-foreground">
        "{testimonial.content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border/50">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-primary/20" 
        />
        <div>
          <div className="font-bold text-sm sm:text-base text-foreground">{testimonial.name}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
};