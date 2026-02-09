import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Commission {
  id: string;
  customer_name: string | null;
  commission_amount: number;
  commission_percentage: number | null;
  status: string;
  created_at: string;
  paid_at: string | null;
}

const CommissionsTab = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    supabase.from("agent_commissions").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setCommissions((data as Commission[]) ?? []));
  }, []);

  const statusColor = (s: string) => {
    if (s === "paid") return "bg-green-100 text-green-800";
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader><CardTitle>Agent Commissions</CardTitle></CardHeader>
      <CardContent>
        {commissions.length === 0 ? <p className="text-muted-foreground">No commissions recorded yet.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.customer_name || "—"}</TableCell>
                  <TableCell className="font-medium">₹{c.commission_amount}</TableCell>
                  <TableCell>{c.commission_percentage ? `${c.commission_percentage}%` : "—"}</TableCell>
                  <TableCell><Badge className={statusColor(c.status)}>{c.status}</Badge></TableCell>
                  <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionsTab;
