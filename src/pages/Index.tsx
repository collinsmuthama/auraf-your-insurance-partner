import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import PolicyCards from "@/components/home/PolicyCards";
import AgentCTA from "@/components/home/AgentCTA";
import FeatureTabs from "@/components/home/FeatureTabs";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import QuoteWizard from "@/components/home/QuoteWizard";

const Index = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroCarousel onGetQuote={() => setQuoteOpen(true)} />
        <PolicyCards />
        <FeatureTabs />
        <AgentCTA />
        <Testimonials />
        <Partners />
      </main>
      <Footer />
      <QuoteWizard open={quoteOpen} onOpenChange={setQuoteOpen} />
    </div>
  );
};

export default Index;
