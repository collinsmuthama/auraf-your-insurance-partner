import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Car, Shield, Plane, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const policies = [
  {
    icon: Heart, title: "Health Insurance",
    desc: "Comprehensive health coverage including hospitalization, day care, and critical illness.",
    features: ["Cashless hospitalization at 10,000+ hospitals", "No-claim bonus up to 50%", "Pre & post hospitalization cover", "Family floater options available"],
  },
  {
    icon: Car, title: "Motor Insurance",
    desc: "Protect your vehicle with comprehensive coverage for cars and two-wheelers.",
    features: ["Own damage & third-party cover", "24/7 roadside assistance", "Quick cashless claims", "No-claim bonus protection"],
  },
  {
    icon: Shield, title: "Life Insurance",
    desc: "Secure your family's future with term plans, endowment, and ULIPs.",
    features: ["Term insurance up to KES 2,000", "Tax benefits under Section 80C", "Riders for critical illness & accident", "Flexible premium payment options"],
  },
  {
    icon: Plane, title: "Travel Insurance",
    desc: "Travel worry-free with coverage for medical emergencies, trip cancellation, and lost baggage.",
    features: ["International & domestic coverage", "Emergency medical evacuation", "Trip cancellation protection", "Lost baggage compensation"],
  },
];

const IndividualInsurance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Individual Insurance</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">Protect yourself and your family with our comprehensive range of personal insurance solutions.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {policies.map((p) => {
                const Icon = p.icon;
                return (
                  <Card key={p.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{p.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">{p.desc}</p>
                      <ul className="space-y-2 mb-6">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      <Link to="/contact">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Get Quote</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IndividualInsurance;
