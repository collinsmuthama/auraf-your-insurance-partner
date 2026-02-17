import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, FileText, DollarSign, Shield, MessageSquare, UserPlus } from "lucide-react";
import AnalyticsTab from "./admin/AnalyticsTab";
import AgentApprovalsTab from "./admin/AgentApprovalsTab";
import PoliciesTab from "./admin/PoliciesTab";
import CommissionsTab from "./admin/CommissionsTab";
import UserRolesTab from "./admin/UserRolesTab";
import ContactQuotesTab from "./admin/ContactQuotesTab";
import CreateUserTab from "./admin/CreateUserTab";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Admin Dashboard</h1>
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 max-w-full">
          <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2"><Users className="h-4 w-4" />Agents</TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2"><Shield className="h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="create-user" className="flex items-center gap-2"><UserPlus className="h-4 w-4" />Create User</TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2"><FileText className="h-4 w-4" />Policies</TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2"><DollarSign className="h-4 w-4" />Commissions</TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />Contacts</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
        <TabsContent value="agents"><AgentApprovalsTab /></TabsContent>
        <TabsContent value="users"><UserRolesTab /></TabsContent>
        <TabsContent value="create-user"><CreateUserTab /></TabsContent>
        <TabsContent value="policies"><PoliciesTab /></TabsContent>
        <TabsContent value="commissions"><CommissionsTab /></TabsContent>
        <TabsContent value="contacts"><ContactQuotesTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
