import { initials } from "../utils/project";

export default function Sidebar({ activeView, isAdmin, onCreate, onLogout, onNavigate, user }) {
  const links = [
    { id: "dashboard", label: "Dashboard", icon: "[]" },
    { id: "projects", label: "Projects", icon: "<>" },
    { id: "calendar", label: "Calendar", icon: "##" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">TF</span>
        <div>
          <strong>TaskFlow</strong>
        </div>
      </div>

      <nav className="side-nav">
        {links.map((link) => (
          <button
            className={activeView === link.id ? "active" : ""}
            key={link.id}
            onClick={() => onNavigate(link.id)}
            type="button"
          >
            <span>{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>

      {isAdmin ? (
        <button className="create-side-button" onClick={onCreate} type="button">
          + Create Project
        </button>
      ) : null}

      <div className="side-footer">
        <button type="button">? Support</button>
        <button onClick={onLogout} type="button">
          {"->"} Logout
        </button>
        <div className="mini-profile">
          <span>{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{isAdmin ? "Administrator" : "Team Member"}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
