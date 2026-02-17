import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgentDashboard = () => {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("agent_commissions").select("*").eq("agent_user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        const c = data ?? [];
        setCommissions(c);
        setTotalEarned(c.reduce((sum: number, x: any) => sum + Number(x.commission_amount), 0));
      });
    supabase.from("insurance_policies").select("*").eq("is_active", true).order("created_at", { ascending: false })
      .then(({ data }) => setPolicies(data ?? []));
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Agent Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">KES {totalEarned.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Policies Sold</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{commissions.length}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commissions">
        <TabsList>
          <TabsTrigger value="commissions">My Commissions</TabsTrigger>
          <TabsTrigger value="policies">Available Policies</TabsTrigger>
        </TabsList>
        <TabsContent value="commissions">
          <Card>
            <CardContent className="pt-6">
              {commissions.length === 0 ? <p className="text-muted-foreground">No commissions yet.</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((c: any) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.customer_name || "—"}</TableCell>
                        <TableCell className="font-medium">₹{c.commission_amount}</TableCell>
                        <TableCell><Badge className={c.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{c.status}</Badge></TableCell>
                        <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="policies">
          <Card>
            <CardContent className="pt-6">
              {policies.length === 0 ? <p className="text-muted-foreground">No policies available.</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Premium</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.policy_type}</TableCell>
                        <TableCell>{p.provider || "—"}</TableCell>
                        <TableCell>{p.premium_range || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDashboard;
