import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role?: string | null;
}

const UserRolesTab = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profileError) throw profileError;

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Map roles to profiles
      const rolesMap = new Map(userRoles?.map((ur: any) => [ur.user_id, ur.role]) || []);
      
      const usersWithRoles = (profiles || []).map((p: any) => ({
        ...p,
        role: rolesMap.get(p.user_id) || null,
      }));

      setUsers(usersWithRoles);
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async () => {
    if (!selected || !selectedRole) return;
    setUpdating(true);

    try {
      // First, delete existing roles for this user
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selected.user_id);

      if (deleteError) throw deleteError;

      // Then insert the new role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({
          user_id: selected.user_id,
          role: selectedRole as any,
        });

      if (insertError) throw insertError;

      toast({ title: "Success", description: `User role updated to ${selectedRole}` });
      setSelected(null);
      setSelectedRole("");
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "agent":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectUser = (user: UserProfile) => {
    setSelected(user);
    setSelectedRole(user.role || "client");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">No users found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.full_name || "—"}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role || "unassigned"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.phone || "—"}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleSelectUser(user)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Assign Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">User Email</p>
                <p className="font-medium">{selected.email}</p>
              </div>
              {selected.full_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Name</p>
                  <p className="font-medium">{selected.full_name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Assign Role</p>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Cancel
                </Button>
                <Button onClick={updateUserRole} disabled={updating || !selectedRole}>
                  {updating ? "Updating..." : "Update Role"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserRolesTab;
