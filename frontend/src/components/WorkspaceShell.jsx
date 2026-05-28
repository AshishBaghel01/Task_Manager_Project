import { AnimatePresence } from "framer-motion";
import ProjectInspector from "./ProjectInspector";
import AppLayout from "../layouts/AppLayout";
import AdminCalendarPage from "../pages/admin/AdminCalendarPage";
import AdminCreateProjectPage from "../pages/admin/AdminCreateProjectPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProjectsPage from "../pages/admin/AdminProjectsPage";
import MemberCalendarPage from "../pages/member/MemberCalendarPage";
import MemberDashboardPage from "../pages/member/MemberDashboardPage";
import MemberProjectsPage from "../pages/member/MemberProjectsPage";

export default function WorkspaceShell({
  activeView,
  dashboard,
  dashboardLoading,
  error,
  handleLogout,
  handleUpdateProgress,
  selectedProjectId,
  setActiveView,
  setSelectedProjectId,
  successMessage,
  updatingProgress,
  user,
}) {
  const isAdmin = user.role === "admin";
  const selectedProject = dashboard.projects.find((project) => project.id === selectedProjectId) || null;

  return (
    <AppLayout
      activeView={activeView}
      dashboardLoading={dashboardLoading}
      error={error}
      isAdmin={isAdmin}
      onCreate={() => setActiveView("create")}
      onLogout={handleLogout}
      onNavigate={setActiveView}
      successMessage={successMessage}
      user={user}
    >
      {mountPage(activeView, isAdmin)}

      <AnimatePresence>
        {selectedProject ? (
          <ProjectInspector
            currentUser={user}
            onClose={() => setSelectedProjectId("")}
            onUpdateProgress={handleUpdateProgress}
            project={selectedProject}
            updatingProgress={updatingProgress}
          />
        ) : null}
      </AnimatePresence>
    </AppLayout>
  );
}

function mountPage(activeView, isAdmin) {
  if (activeView === "dashboard") return isAdmin ? <AdminDashboardPage /> : <MemberDashboardPage />;
  if (activeView === "projects") return isAdmin ? <AdminProjectsPage /> : <MemberProjectsPage />;
  if (activeView === "calendar") return isAdmin ? <AdminCalendarPage /> : <MemberCalendarPage />;
  if (activeView === "create" && isAdmin) return <AdminCreateProjectPage />;
  return null;
}
