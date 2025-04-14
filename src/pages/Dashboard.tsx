
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect to overview if at the dashboard root
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/overview", { replace: true });
    }
  }, [location, navigate]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />
      <main className="flex-1 p-4 md:p-6 mx-auto container">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
