import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shield, Heart, Car, Home } from "lucide-react";

const slides = [
  {
    icon: Shield,
    title: "Secure Your Future Today",
    subtitle: "Comprehensive insurance plans tailored to protect what matters most to you.",
    color: "from-primary/90 to-accent/80",
  },
  {
    icon: Heart,
    title: "Health Insurance Made Simple",
    subtitle: "Access top-rated health plans with cashless hospitalization and complete coverage.",
    color: "from-accent/90 to-primary/80",
  },
  {
    icon: Car,
    title: "Drive with Confidence",
    subtitle: "Comprehensive motor insurance with instant claims and roadside assistance.",
    color: "from-secondary/90 to-primary/80",
  },
  {
    icon: Home,
    title: "Protect Your Property",
    subtitle: "Safeguard your home and business assets against unforeseen events.",
    color: "from-primary/80 to-secondary/80",
  },
];

const HeroCarousel = ({ onGetQuote }: { onGetQuote: () => void }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <section className={`relative bg-gradient-to-br ${slide.color} text-white transition-all duration-700 min-h-[500px] flex items-center`}>
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur mb-6">
          <Icon className="h-10 w-10" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {slide.title}
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">{slide.subtitle}</p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={onGetQuote} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-8">
            Get a Quote
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-semibold text-lg px-8">
            Learn More
          </Button>
        </div>

        <div className="flex gap-2 justify-center mt-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/40"}`} />
          ))}
        </div>
      </div>

      <button onClick={() => setCurrent((current - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={() => setCurrent((current + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
};

export default HeroCarousel;
