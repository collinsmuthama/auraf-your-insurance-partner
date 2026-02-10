import { Building2 } from "lucide-react";

const partners = [
  { name: "Jubilee Insurance", initials: "JI" },
  { name: "Britam", initials: "BR" },
  { name: "APA Insurance", initials: "APA" },
  { name: "CIC Insurance", initials: "CIC" },
  { name: "UAP Old Mutual", initials: "UAP" },
  { name: "Madison Insurance", initials: "MI" },
  { name: "AAR Insurance", initials: "AAR" },
  { name: "GA Insurance", initials: "GA" },
  { name: "Heritage Insurance", initials: "HI" },
  { name: "ICEA Lion", initials: "IL" },
  { name: "Sanlam Kenya", initials: "SK" },
  { name: "Kenya Alliance", initials: "KA" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {partners.map((partner) => (
            <div key={partner.name} className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center h-28 hover:shadow-md transition-shadow gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{partner.initials}</span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground text-center leading-tight">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
