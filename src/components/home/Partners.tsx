import { Building2 } from "lucide-react";
import GA from '@/assets/ga.jpg'
import JB from '@/assets/jubi.jpg'

const partners = [
  { name: "Jubilee Insurance", initials: "JI",logo: JB },

  { name: "GA Insurance", initials: "GA", logo: GA },
 
];

const Partners = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Our Partner Insurers
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          We work with Kenya's leading insurance companies to bring you the best policies.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {partners.map((partner) => (
            <div key={partner.name} className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center h-28 hover:shadow-md transition-shadow">
              <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
