import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Briefcase, Users, ShieldCheck, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const policies = [
  {
    icon: Building2, title: "Property Insurance",
    desc: "Protect your commercial properties, offices, and assets from natural and man-made disasters.",
    features: ["Fire & allied perils coverage", "Burglary & theft protection", "Business interruption cover", "Machinery breakdown insurance"],
  },
  {
    icon: Briefcase, title: "Liability Insurance",
    desc: "Shield your business from legal claims and lawsuits with professional liability coverage.",
    features: ["Professional indemnity", "Directors & officers liability", "Product liability coverage", "Cyber liability insurance"],
  },
  {
    icon: Users, title: "Employee Benefits",
    desc: "Attract and retain talent with comprehensive employee benefit packages.",
    features: ["Group health insurance", "Group term life insurance", "Workers compensation", "Key man insurance"],
  },
  {
    icon: ShieldCheck, title: "Marine & Transit",
    desc: "Protect goods in transit across land, sea, and air with comprehensive cargo insurance.",
    features: ["Inland transit coverage", "Marine cargo insurance", "Warehouse to warehouse cover", "Open policy options"],
  },
];

const BusinessInsurance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Business Insurance</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">Comprehensive coverage solutions to protect your business, employees, and assets.</p>
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

export default BusinessInsurance;
