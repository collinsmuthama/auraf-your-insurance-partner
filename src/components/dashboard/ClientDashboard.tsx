import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const [policies, setPolicies] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    supabase.from("insurance_policies").select("*").eq("is_active", true).order("created_at", { ascending: false })
      .then(({ data }) => setPolicies(data ?? []));
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const handleDeactivate = async () => {
    if (!user) return;
    setDeactivating(true);
    try {
      const { error } = await supabase.functions.invoke("deactivate-account", {
        body: { user_id: user.id },
      });
      if (error) throw error;
      toast({ title: "Account Deactivated", description: "Your account has been deactivated. You will be signed out." });
      setTimeout(() => signOut(), 2000);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to deactivate account.", variant: "destructive" });
    } finally {
      setDeactivating(false);
      setShowDeactivate(false);
    }
  };

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

      <Card className="mb-6">
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

      {/* Account Deactivation */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deactivating your account will disable your login and hide your profile. This action can only be reversed by an administrator.
          </p>
          <Button variant="destructive" onClick={() => setShowDeactivate(true)}>Deactivate My Account</Button>
        </CardContent>
      </Card>

      <Dialog open={showDeactivate} onOpenChange={setShowDeactivate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Account Deactivation</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to deactivate your account? You will be signed out immediately and won't be able to log back in until an admin reactivates your account.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeactivate(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeactivate} disabled={deactivating}>
              {deactivating ? "Deactivating..." : "Yes, Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;