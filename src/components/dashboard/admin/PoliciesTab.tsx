import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Policy {
  id: string;
  name: string;
  policy_type: string;
  provider: string | null;
  premium_range: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const PoliciesTab = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", policy_type: "", provider: "", premium_range: "", description: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPolicies = async () => {
    const { data } = await supabase.from("insurance_policies").select("*").order("created_at", { ascending: false });
    setPolicies((data as Policy[]) ?? []);
  };

  useEffect(() => { fetchPolicies(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.policy_type) {
      toast({ title: "Required", description: "Name and type are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("insurance_policies").insert({
      ...form,
      created_by: user?.id,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Policy added" });
      setForm({ name: "", policy_type: "", provider: "", premium_range: "", description: "" });
      setOpen(false);
      fetchPolicies();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("insurance_policies").update({ is_active: !current }).eq("id", id);
    fetchPolicies();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Insurance Policies</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary"><Plus className="h-4 w-4 mr-1" /> Add Policy</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Policy</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Policy Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Policy Type *</Label><Input placeholder="e.g. Health, Motor, Life" value={form.policy_type} onChange={(e) => setForm(f => ({ ...f, policy_type: e.target.value }))} /></div>
              <div><Label>Provider</Label><Input value={form.provider} onChange={(e) => setForm(f => ({ ...f, provider: e.target.value }))} /></div>
              <div><Label>Premium Range</Label><Input placeholder="e.g. ₹5,000 - ₹20,000" value={form.premium_range} onChange={(e) => setForm(f => ({ ...f, premium_range: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <Button onClick={handleAdd} disabled={loading} className="w-full bg-primary">{loading ? "Adding..." : "Add Policy"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {policies.length === 0 ? <p className="text-muted-foreground">No policies yet.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.policy_type}</TableCell>
                  <TableCell>{p.provider || "—"}</TableCell>
                  <TableCell>{p.premium_range || "—"}</TableCell>
                  <TableCell><Badge className={p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{p.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => toggleActive(p.id, p.is_active)}>
                      {p.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PoliciesTab;
