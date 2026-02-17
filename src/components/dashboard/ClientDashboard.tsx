import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, ShieldCheck } from "lucide-react";

const ClientDashboard = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("insurance_policies").select("*").eq("is_active", true).order("created_at", { ascending: false })
      .then(({ data }) => setPolicies(data ?? []));
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Policies</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{policies.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
            <ShieldCheck className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-lg font-semibold text-secondary">Active</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Browse Insurance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          {policies.length === 0 ? <p className="text-muted-foreground">No policies available at the moment.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Premium Range</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.policy_type}</TableCell>
                    <TableCell>{p.provider || "—"}</TableCell>
                    <TableCell>{p.premium_range || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">{p.description || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;