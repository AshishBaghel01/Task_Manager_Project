import { Bell, Plus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { initials } from "../utils/project";

export default function TopBar({ activeView, dashboardLoading, isAdmin, onCreate, user }) {
  const titleMap = {
    dashboard: isAdmin ? "Admin Dashboard" : "Member Dashboard",
    projects: isAdmin ? "Project Directory" : "Team Projects",
    calendar: isAdmin ? "Calendar View" : "Team Calendar",
    create: "Create New Project",
  };

  return (
    <header className="topbar">
      <div className="page-title">
        <h1>{titleMap[activeView]}</h1>
        {activeView === "dashboard" ? (
          <p>
            {isAdmin
              ? "Track and manage your enterprise operations at a glance."
              : "Manage and track your active initiatives."}
          </p>
        ) : null}
      </div>

      <label className="search-box">
        <Search size={18} />
        <input placeholder={activeView === "calendar" ? "Search events..." : "Search projects, tasks..."} />
      </label>

      <div className="top-actions">
        {isAdmin && activeView === "projects" ? (
          <Button className="new-project-button" onClick={onCreate} size="pill" type="button">
            <Plus size={18} /> New Project
          </Button>
        ) : null}
        <button aria-label="Notifications" type="button">
          <Bell size={19} />
        </button>
        <div className="profile-chip">
          <span className="avatar">{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{dashboardLoading ? "Syncing..." : isAdmin ? "Project Admin" : "Senior Developer"}</small>
          </div>
        </div>
      </div>
    </header>
  );
}
