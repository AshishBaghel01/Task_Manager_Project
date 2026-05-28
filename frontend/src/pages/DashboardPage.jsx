import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import DashboardView from "../features/dashboard/DashboardView";

export default function DashboardPage() {
  const { dashboard, user } = useAppContext();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleNavigate = (view) => {
    navigate(`/app/${view}`);
  };

  const handleSelectProject = (projectId) => {
    navigate(`/app/projects?id=${projectId}`);
  };

  return (
    <DashboardView
      dashboard={dashboard}
      isAdmin={isAdmin}
      onNavigate={handleNavigate}
      onSelectProject={handleSelectProject}
      user={user}
    />
  );
}
