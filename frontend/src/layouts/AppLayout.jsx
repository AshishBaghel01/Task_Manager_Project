import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLoader from "../components/common/AppLoader";
import AnimatedGridPattern from "../components/magic/AnimatedGridPattern";
import ProjectInspector from "../components/ProjectInspector";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAppContext } from "../hooks/useAppContext";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ProjectsPage = lazy(() => import("../pages/ProjectsPage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));

export default function AppLayout() {
  const {
    dashboard,
    dashboardLoading,
    error,
    handleLogout,
    handleUpdateProgress,
    selectedProjectId,
    setSelectedProjectId,
    successMessage,
    updatingProgress,
    user,
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  // Get current view from URL path
  const currentPath = location.pathname.split("/").pop() || "dashboard";

  const handleNavigate = (view) => {
    navigate(`/app/${view}`);
  };

  const handleCreate = () => {
    navigate(`/app/projects/create`);
  };

  return (
    <main className="app-layout">
      <AnimatedGridPattern />
      <Sidebar
        activeView={currentPath}
        isAdmin={isAdmin}
        onCreate={handleCreate}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        user={user}
      />

      <section className="workspace">
        <TopBar
          activeView={currentPath}
          dashboardLoading={dashboardLoading}
          isAdmin={isAdmin}
          onCreate={handleCreate}
          user={user}
        />

        <AnimatePresence>
          {error ? (
            <motion.div className="flash-message error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {error}
            </motion.div>
          ) : null}
          {successMessage ? (
            <motion.div className="flash-message success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {successMessage}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <Suspense fallback={<AppLoader />}>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/create" element={<ProjectsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
            </Routes>
          </Suspense>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedProjectId ? (
          <ProjectInspector
            currentUser={user}
            onClose={() => setSelectedProjectId("")}
            onUpdateProgress={handleUpdateProgress}
            project={dashboard.projects.find((project) => project.id === selectedProjectId) || null}
            updatingProgress={updatingProgress}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
