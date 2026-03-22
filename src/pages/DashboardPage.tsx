import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredSession } from "@/lib/shopifyAdmin";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getStoredSession()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
