import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, MoreHorizontal, Plus } from "lucide-react";
import AvatarStack from "../../components/common/AvatarStack";
import EmptyState from "../../components/common/EmptyState";
import ProgressBar from "../../components/common/ProgressBar";
import { projectFilters, statusLabels } from "../../constants/project";
import { formatDate, getProjectProgress, statusClass } from "../../utils/project";

export default function ProjectsView({ isAdmin, onCreate, onSelectProject, projects, user }) {
  const [projectView, setProjectView] = useState("all");

  const visibleProjects = [...projects]
    .filter((project) => {
      if (projectView === "completed") return project.status === "completed";
      if (projectView === "overdue") return project.status === "overdue";
      if (projectView === "in-progress") return project.status === "progress";
      return true;
    })
    .sort((a, b) => {
      if (projectView === "progress") {
        return getProjectProgress(b, user, isAdmin) - getProjectProgress(a, user, isAdmin);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <section className="projects-page">
      <div className="filter-bar">
        <span>Sort By:</span>
        {projectFilters.map((filter) => (
          <button
            className={projectView === filter.id ? "active" : ""}
            key={filter.id}
            onClick={() => setProjectView(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleProjects.length ? (
        <motion.div className={isAdmin ? "directory-list" : "member-project-grid"} layout>
          <AnimatePresence>
          {visibleProjects.map((project) =>
            isAdmin ? (
              <DirectoryRow key={project.id} onSelect={() => onSelectProject(project)} project={project} />
            ) : (
              <MemberProjectCard key={project.id} onSelect={() => onSelectProject(project)} project={project} user={user} />
            )
          )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState title="No projects match this view." text="Choose another sorting option or create a matching project." />
      )}

      {isAdmin ? (
        <button className="floating-action" onClick={onCreate} type="button">
          <Plus size={30} />
        </button>
      ) : null}
    </section>
  );
}

function DirectoryRow({ onSelect, project }) {
  return (
    <motion.button
      className={`directory-row ${statusClass(project.status)}`}
      exit={{ opacity: 0, y: 10 }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onClick={onSelect}
      type="button"
      whileHover={{ x: 6 }}
    >
      <span className="row-icon">{project.status === "overdue" ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}</span>
      <span className="row-main">
        <strong>{project.name}</strong>
        <small>Created {formatDate(project.createdAt, { year: "numeric" })} - ID: PM-{String(project.id).slice(-4).toUpperCase()}</small>
      </span>
      <span className="row-progress">
        <small>Progress</small>
        <ProgressBar progress={project.overallCompletion} status={project.status} />
      </span>
      <strong>{project.overallCompletion}%</strong>
      <span className={`pill ${statusClass(project.status)}`}>{statusLabels[project.status]}</span>
      <span className="more-dot"><MoreHorizontal size={20} /></span>
    </motion.button>
  );
}

function MemberProjectCard({ onSelect, project, user }) {
  const member = project.members.find((item) => item.user.id === user.id);

  return (
    <motion.button
      className="member-project-card"
      exit={{ opacity: 0, scale: 0.98 }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onClick={onSelect}
      type="button"
      whileHover={{ y: -7 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className={`pill ${statusClass(project.status)}`}>{statusLabels[project.status]}</span>
      <span className="more-dot"><MoreHorizontal size={20} /></span>
      <h3>{project.name}</h3>
      <p>{member?.assignedTask || project.description}</p>
      <div className="progress-line">
        <span>Tasks Completed</span>
        <strong>{member?.progress ?? project.overallCompletion}%</strong>
      </div>
      <ProgressBar progress={member?.progress ?? project.overallCompletion} status={project.status} />
      <div className="tile-footer">
        <AvatarStack members={project.members} />
        <span>{project.status === "overdue" ? `Expired ${formatDate(project.endDate)}` : formatDate(project.endDate)}</span>
      </div>
    </motion.button>
  );
}
