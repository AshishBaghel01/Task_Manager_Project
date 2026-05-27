import { lazy, Suspense } from "react";
import AuthScreen from "./components/AuthScreen";
import AppContextProvider from "./context/AppContextProvider";
import { useAppContext } from "./hooks/useAppContext";

const WorkspaceShell = lazy(() => import("./components/WorkspaceShell"));

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
    handleCreateAdmin,
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

  if (bootstrapLoading && token) return <div className="loading-screen">Loading workspace...</div>;

  if (!token || !user) {
    return (
      <AuthScreen
        error={error}
        hasAdmin={hasAdmin}
        loading={loading}
        loginForm={loginForm}
        signupForm={signupForm}
        onCreateAdmin={handleCreateAdmin}
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

  return (
    <Suspense fallback={<div className="loading-screen">Loading workspace...</div>}>
      <WorkspaceShell
        activeView={activeView}
        dashboard={dashboard}
        dashboardLoading={dashboardLoading}
        error={error}
        handleLogout={handleLogout}
        handleUpdateProgress={handleUpdateProgress}
        selectedProjectId={selectedProjectId}
        setActiveView={setActiveView}
        setSelectedProjectId={setSelectedProjectId}
        successMessage={successMessage}
        updatingProgress={updatingProgress}
        user={user}
      />
    </Suspense>
  );
}

export default App;
