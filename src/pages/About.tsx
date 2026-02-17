import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Eye, Target, Heart, Users, Building2, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";

const stats = [
  { label: "Policies Sold", value: 15000, suffix: "+" },
  { label: "Agents Onboarded", value: 100, suffix: "+" },
  { label: "Years in Business", value: 5, suffix: "+" },
  { label: "Partner Companies", value: 10, suffix: "+" },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = Math.max(1, Math.floor(target / 60));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
          }, 20);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary">{count.toLocaleString()}{suffix}</div>;
};

const team = [
  { name: "Fiona Awino", role: "Founder & CEO", desc: "5+ years in insurance distribution" },
  { name: "Anita Mehta", role: "Head of Operations", desc: "Expert in process optimization" },
  { name: "Collins Muthama", role: "Chief Technology Officer", desc: "Building digital-first insurance solutions" },
  { name: "Pooja Iyer", role: "Head of Agent Relations", desc: "Dedicated to agent success and growth" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>About Auraf Insurance</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">Redefining insurance distribution in Kenya through technology, transparency, and trust.</p>
          </div>
        </section>

        {/* Mission Vision Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: "Our Mission", desc: "To make insurance accessible, affordable, and understandable for every Kenyan family and business." },
                { icon: Eye, title: "Our Vision", desc: "To become Kenya's most trusted insurance distribution platform, empowering agents and protecting customers." },
                { icon: Heart, title: "Core Values", desc: "Transparency, customer-first approach, agent empowerment, innovation, and integrity in everything we do." },
              ].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="border-0 shadow-lg text-center">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Target Market */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>Who We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Users, title: "Individuals", desc: "Families seeking reliable health, life, motor, and travel insurance." },
                { icon: Building2, title: "Businesses", desc: "Companies needing property, liability, and employee benefit coverage." },
                { icon: TrendingUp, title: "Agents", desc: "Insurance professionals looking for a modern platform to grow their business." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                  <p className="text-muted-foreground mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>Our Leadership Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((t) => (
                <Card key={t.name} className="border-0 shadow-md text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-sm text-accent font-medium">{t.role}</p>
                    <p className="text-xs text-muted-foreground mt-2">{t.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
