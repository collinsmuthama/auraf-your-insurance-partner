import { Heart, Car, Shield, Home, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const policies = [
  { icon: Heart, title: "Health Insurance", desc: "Cashless hospitalization, family floaters, and critical illness coverage.", link: "/insurance/individual" },
  { icon: Car, title: "Motor Insurance", desc: "Comprehensive and third-party coverage for cars and two-wheelers.", link: "/insurance/individual" },
  { icon: Shield, title: "Life Insurance", desc: "Term plans, endowment, and ULIPs for financial security.", link: "/insurance/individual" },
  { icon: Home, title: "Property Insurance", desc: "Protect your home and commercial properties from unforeseen events.", link: "/insurance/business" },
  { icon: Plane, title: "Travel Insurance", desc: "International and domestic travel coverage with medical emergency support.", link: "/insurance/individual" },
];

const PolicyCards = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Our Insurance Solutions
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore a wide range of insurance products designed to protect every aspect of your life.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {policies.map((p) => {
            const Icon = p.icon;
            return (
              <Link to={p.link} key={p.title}>
                <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 shadow-md h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PolicyCards;
