import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout({
  activeView,
  children,
  dashboardLoading,
  error,
  isAdmin,
  onCreate,
  onLogout,
  onNavigate,
  successMessage,
  user,
}) {
  return (
    <main className="app-layout">
      <Sidebar
        activeView={activeView}
        isAdmin={isAdmin}
        onCreate={onCreate}
        onLogout={onLogout}
        onNavigate={onNavigate}
        user={user}
      />

      <section className="workspace">
        <TopBar
          activeView={activeView}
          dashboardLoading={dashboardLoading}
          isAdmin={isAdmin}
          onCreate={onCreate}
          user={user}
        />

        {error ? <div className="flash-message error">{error}</div> : null}
        {successMessage ? <div className="flash-message success">{successMessage}</div> : null}
        {children}
      </section>
    </main>
  );
}
