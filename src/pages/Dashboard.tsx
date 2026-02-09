import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted py-8">
        <div className="container mx-auto px-4">
          {role === "admin" ? <AdminDashboard /> : role === "agent" ? <AgentDashboard /> : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Welcome!</h2>
              <p className="text-muted-foreground">Your account has no assigned role yet. Please contact an administrator.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
