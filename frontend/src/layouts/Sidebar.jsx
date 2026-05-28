import { motion } from "framer-motion";
import { CalendarDays, FolderKanban, Gauge, HelpCircle, LogOut, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { initials } from "../utils/project";

export default function Sidebar({ activeView, isAdmin, onCreate, onLogout, onNavigate, user }) {
  const links = [
    { id: "dashboard", label: "Dashboard", icon: Gauge },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
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
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
          <button
            className={activeView === link.id ? "active" : ""}
            key={link.id}
            onClick={() => onNavigate(link.id)}
            style={{ "--item-index": index }}
            type="button"
          >
            <Icon size={20} />
            {link.label}
          </button>
          );
        })}
      </nav>

      {isAdmin ? (
        <Button className="create-side-button" onClick={onCreate} size="pill" type="button">
          <Plus size={18} /> Create Project
        </Button>
      ) : null}

      <div className="side-footer">
        <button type="button"><HelpCircle size={18} /> Support</button>
        <button onClick={onLogout} type="button">
          <LogOut size={18} /> Logout
        </button>
        <motion.div className="mini-profile" whileHover={{ x: 4 }}>
          <span>{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{isAdmin ? "Administrator" : "Team Member"}</small>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
