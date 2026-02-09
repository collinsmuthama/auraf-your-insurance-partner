import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, BadgeDollarSign, TrendingUp } from "lucide-react";

const AgentCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Sell Insurance & Get Instant Payment
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Join Kenya's fastest growing insurance distribution network. Earn unlimited commissions with zero investment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
          {[
            { icon: Users, label: "500+ Agents Onboarded" },
            { icon: BadgeDollarSign, label: "Instant Commission Payouts" },
            { icon: TrendingUp, label: "Unlimited Earning Potential" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
        <Link to="/become-agent">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg px-10">
            Become an Agent Today
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default AgentCTA;
