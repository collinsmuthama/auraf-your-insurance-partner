const partners = [
  "HDFC Life", "ICICI Lombard", "Star Health", "Bajaj Allianz",
  "Tata AIG", "Max Life", "SBI General", "Kotak Life",
  "New India Assurance", "LIC", "Reliance General", "Care Health",
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
          {partners.map((name) => (
            <div key={name} className="bg-card border border-border rounded-lg p-4 flex items-center justify-center h-20 hover:shadow-md transition-shadow">
              <span className="text-sm font-semibold text-muted-foreground text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
