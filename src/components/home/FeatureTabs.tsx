import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, BarChart3, FileCheck, Gift } from "lucide-react";

const features = [
  {
    value: "onboarding",
    icon: UserPlus,
    title: "Easy Onboarding",
    desc: "Get started in minutes with our simple agent registration process. No upfront investment required — just sign up, get trained, and start selling.",
    points: ["Quick 3-step registration", "Free training modules", "Dedicated relationship manager"],
  },
  {
    value: "quotes",
    icon: BarChart3,
    title: "Compare Quotes",
    desc: "Help your customers find the best policy by comparing quotes from multiple insurers side by side in real time.",
    points: ["30+ insurance partners", "Real-time premium comparison", "Transparent policy details"],
  },
  {
    value: "claims",
    icon: FileCheck,
    title: "Renewal & Claims",
    desc: "Hassle-free renewal reminders and a streamlined claims process ensures your customers are always covered.",
    points: ["Automated renewal alerts", "Quick claims settlement", "Dedicated claims support"],
  },
  {
    value: "perks",
    icon: Gift,
    title: "Perks & Benefits",
    desc: "Enjoy exclusive rewards, bonuses, and incentives as you grow your insurance portfolio with Auraf.",
    points: ["Monthly performance bonuses", "Annual reward trips", "Health insurance for agents"],
  },
];

const FeatureTabs = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Why Choose Auraf?
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Everything you need to succeed in the insurance business, all in one platform.
        </p>
        <Tabs defaultValue="onboarding" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto gap-2 bg-transparent">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <TabsTrigger key={f.value} value={f.value} className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{f.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {features.map((f) => (
            <TabsContent key={f.value} value={f.value} className="mt-8">
              <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>{f.title}</h3>
                <p className="text-muted-foreground mb-6">{f.desc}</p>
                <ul className="space-y-2">
                  {f.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeatureTabs;
