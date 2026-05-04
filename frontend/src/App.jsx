import AuthScreen from "./components/AuthScreen";
import ProjectInspector from "./components/ProjectInspector";
import AppContextProvider from "./context/AppContextProvider";
import { useAppContext } from "./hooks/useAppContext";
import AppLayout from "./layouts/AppLayout";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage";
import AdminCreateProjectPage from "./pages/admin/AdminCreateProjectPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage";
import MemberCalendarPage from "./pages/member/MemberCalendarPage";
import MemberDashboardPage from "./pages/member/MemberDashboardPage";
import MemberProjectsPage from "./pages/member/MemberProjectsPage";

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

function AppContent() {
  const {
    activeView,
    bootstrapLoading,
    dashboard,
    dashboardLoading,
    error,
    handleLogin,
    handleLogout,
    handleSetupAdmin,
    handleSignup,
    handleUpdateProgress,
    hasAdmin,
    loading,
    loginForm,
    selectedProjectId,
    setActiveView,
    setLoginForm,
    setSelectedProjectId,
    setSetupForm,
    setSignupForm,
    setupForm,
    signupForm,
    successMessage,
    token,
    updatingProgress,
    user,
  } = useAppContext();

  if (bootstrapLoading) return <div className="loading-screen">Loading workspace...</div>;

  if (!token || !user) {
    return (
      <AuthScreen
        error={error}
        hasAdmin={hasAdmin}
        loading={loading}
        loginForm={loginForm}
        signupForm={signupForm}
        onLogin={handleLogin}
        onLoginChange={(event) => setLoginForm({ ...loginForm, [event.target.name]: event.target.value })}
        onSignup={handleSignup}
        onSignupChange={(event) => setSignupForm({ ...signupForm, [event.target.name]: event.target.value })}
        onSetupAdmin={handleSetupAdmin}
        onSetupChange={(event) => setSetupForm({ ...setupForm, [event.target.name]: event.target.value })}
        setupForm={setupForm}
      />
    );
  }

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

      <ProjectInspector
        currentUser={user}
        onClose={() => setSelectedProjectId("")}
        onUpdateProgress={handleUpdateProgress}
        project={selectedProject}
        updatingProgress={updatingProgress}
      />
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

export default App;
