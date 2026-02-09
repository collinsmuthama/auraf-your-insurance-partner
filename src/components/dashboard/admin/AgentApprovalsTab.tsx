import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AgentApp {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string | null;
  created_at: string;
  city: string | null;
  state: string | null;
  experience_years: number | null;
  previous_company: string | null;
  license_number: string | null;
  pan_number: string | null;
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  id_document_url: string | null;
}

const AgentApprovalsTab = () => {
  const [apps, setApps] = useState<AgentApp[]>([]);
  const [selected, setSelected] = useState<AgentApp | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchApps = async () => {
    const { data } = await supabase.from("agent_applications").select("*").order("created_at", { ascending: false });
    setApps((data as AgentApp[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("agent_applications").update({
      status,
      approved_by: user?.id,
      approved_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Application ${status}.` });
      fetchApps();
    }
  };

  const statusColor = (s: string | null) => {
    if (s === "approved") return "bg-green-100 text-green-800";
    if (s === "rejected") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <p>Loading...</p> : apps.length === 0 ? <p className="text-muted-foreground">No applications yet.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.full_name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.phone}</TableCell>
                  <TableCell><Badge className={statusColor(a.status)}>{a.status ?? "pending"}</Badge></TableCell>
                  <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelected(a)}><Eye className="h-4 w-4" /></Button>
                    {a.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600" onClick={() => updateStatus(a.id, "approved")}><CheckCircle className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateStatus(a.id, "rejected")}><XCircle className="h-4 w-4" /></Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="font-medium">Name:</span> {selected.full_name}</div>
                <div><span className="font-medium">Email:</span> {selected.email}</div>
                <div><span className="font-medium">Phone:</span> {selected.phone}</div>
                <div><span className="font-medium">City:</span> {selected.city || "—"}</div>
                <div><span className="font-medium">State:</span> {selected.state || "—"}</div>
                <div><span className="font-medium">Experience:</span> {selected.experience_years ?? "—"} years</div>
                <div><span className="font-medium">Previous Co:</span> {selected.previous_company || "—"}</div>
                <div><span className="font-medium">License:</span> {selected.license_number || "—"}</div>
                <div><span className="font-medium">PAN:</span> {selected.pan_number || "—"}</div>
                <div><span className="font-medium">Bank:</span> {selected.bank_name || "—"}</div>
                <div><span className="font-medium">Account:</span> {selected.account_number || "—"}</div>
                <div><span className="font-medium">IFSC:</span> {selected.ifsc_code || "—"}</div>
              </div>
              {selected.id_document_url && (
                <div>
                  <span className="font-medium">ID Document:</span>
                  <a href={selected.id_document_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline inline-flex items-center gap-1">
                    <Download className="h-3 w-3" /> View Document
                  </a>
                </div>
              )}
              <div><span className="font-medium">Status:</span> <Badge className={statusColor(selected.status)}>{selected.status ?? "pending"}</Badge></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AgentApprovalsTab;
