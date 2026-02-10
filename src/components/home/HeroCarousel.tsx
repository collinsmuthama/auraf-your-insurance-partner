import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shield, Heart, Car, Home } from "lucide-react";
import carouselShield from "@/assets/carousel-shield.jpg";
import carouselHealth from "@/assets/carousel-health.jpg";
import carouselMotor from "@/assets/carousel-motor.jpg";
import carouselProperty from "@/assets/carousel-property.jpg";

const slides = [
  {
    icon: Shield,
    title: "Secure Your Future Today",
    subtitle: "Comprehensive insurance plans tailored to protect what matters most to you.",
    image: carouselShield,
  },
  {
    icon: Heart,
    title: "Health Insurance Made Simple",
    subtitle: "Access top-rated health plans with cashless hospitalization and complete coverage.",
    image: carouselHealth,
  },
  {
    icon: Car,
    title: "Drive with Confidence",
    subtitle: "Comprehensive motor insurance with instant claims and roadside assistance.",
    image: carouselMotor,
  },
  {
    icon: Home,
    title: "Protect Your Property",
    subtitle: "Safeguard your home and business assets against unforeseen events.",
    image: carouselProperty,
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
    <section className="relative min-h-[500px] flex items-center overflow-hidden">
      {/* Blurred background image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px)",
            transform: "scale(1.05)",
          }}
        />
      ))}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container mx-auto px-4 py-20 text-center relative z-10 text-white">
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

      <button onClick={() => setCurrent((current - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10">
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button onClick={() => setCurrent((current + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10">
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </section>
  );
};

export default HeroCarousel;
