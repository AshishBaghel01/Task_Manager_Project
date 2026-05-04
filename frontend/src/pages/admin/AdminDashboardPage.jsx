import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import DashboardView from "../../features/dashboard/DashboardView";

export default function AdminDashboardPage() {
  const { dashboard, setActiveView, setSelectedProjectId, user } = useContext(AppContext);

  return (
    <section className="page admin-dashboard-page">
      <DashboardView
        dashboard={dashboard}
        isAdmin
        onNavigate={setActiveView}
        onSelectProject={(project) => setSelectedProjectId(project.id)}
        user={user}
      />
    </section>
  );
}
