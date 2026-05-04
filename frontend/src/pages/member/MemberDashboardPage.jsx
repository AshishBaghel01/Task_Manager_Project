import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import DashboardView from "../../features/dashboard/DashboardView";

export default function MemberDashboardPage() {
  const { dashboard, setActiveView, setSelectedProjectId, user } = useContext(AppContext);

  return (
    <section className="page member-dashboard-page">
      <DashboardView
        dashboard={dashboard}
        isAdmin={false}
        onNavigate={setActiveView}
        onSelectProject={(project) => setSelectedProjectId(project.id)}
        user={user}
      />
    </section>
  );
}
