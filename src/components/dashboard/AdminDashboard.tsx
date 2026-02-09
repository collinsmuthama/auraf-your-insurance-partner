import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, FileText, DollarSign } from "lucide-react";
import AnalyticsTab from "./admin/AnalyticsTab";
import AgentApprovalsTab from "./admin/AgentApprovalsTab";
import PoliciesTab from "./admin/PoliciesTab";
import CommissionsTab from "./admin/CommissionsTab";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Admin Dashboard</h1>
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2"><Users className="h-4 w-4" />Agents</TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2"><FileText className="h-4 w-4" />Policies</TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2"><DollarSign className="h-4 w-4" />Commissions</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
        <TabsContent value="agents"><AgentApprovalsTab /></TabsContent>
        <TabsContent value="policies"><PoliciesTab /></TabsContent>
        <TabsContent value="commissions"><CommissionsTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
