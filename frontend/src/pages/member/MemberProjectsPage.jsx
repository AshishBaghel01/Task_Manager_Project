import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import ProjectsView from "../../features/projects/ProjectsView";

export default function MemberProjectsPage() {
  const { dashboard, setActiveView, setSelectedProjectId, user } = useContext(AppContext);

  return (
    <section className="page member-projects-page">
      <ProjectsView
        isAdmin={false}
        onCreate={() => setActiveView("create")}
        onSelectProject={(project) => setSelectedProjectId(project.id)}
        projects={dashboard.projects}
        user={user}
      />
    </section>
  );
}
