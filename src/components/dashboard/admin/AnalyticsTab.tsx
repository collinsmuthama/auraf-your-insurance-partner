import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, MessageSquare, DollarSign } from "lucide-react";

const AnalyticsTab = () => {
  const [stats, setStats] = useState({ agents: 0, policies: 0, quotes: 0, contacts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [agents, policies, quotes, contacts] = await Promise.all([
        supabase.from("agent_applications").select("id", { count: "exact", head: true }),
        supabase.from("insurance_policies").select("id", { count: "exact", head: true }),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        agents: agents.count ?? 0,
        policies: policies.count ?? 0,
        quotes: quotes.count ?? 0,
        contacts: contacts.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Agent Applications", value: stats.agents, icon: Users, color: "text-primary" },
    { title: "Insurance Policies", value: stats.policies, icon: FileText, color: "text-secondary" },
    { title: "Quote Requests", value: stats.quotes, icon: DollarSign, color: "text-accent" },
    { title: "Contact Messages", value: stats.contacts, icon: MessageSquare, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
            <c.icon className={`h-5 w-5 ${c.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsTab;
