import { useState } from "react";
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
        <div className={isAdmin ? "directory-list" : "member-project-grid"}>
          {visibleProjects.map((project) =>
            isAdmin ? (
              <DirectoryRow key={project.id} onSelect={() => onSelectProject(project)} project={project} />
            ) : (
              <MemberProjectCard key={project.id} onSelect={() => onSelectProject(project)} project={project} user={user} />
            )
          )}
        </div>
      ) : (
        <EmptyState title="No projects match this view." text="Choose another sorting option or create a matching project." />
      )}

      {isAdmin ? (
        <button className="floating-action" onClick={onCreate} type="button">
          +
        </button>
      ) : null}
    </section>
  );
}

function DirectoryRow({ onSelect, project }) {
  return (
    <button className={`directory-row ${statusClass(project.status)}`} onClick={onSelect} type="button">
      <span className="row-icon">{project.status === "overdue" ? "!" : "OK"}</span>
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
      <span className="more-dot">...</span>
    </button>
  );
}

function MemberProjectCard({ onSelect, project, user }) {
  const member = project.members.find((item) => item.user.id === user.id);

  return (
    <button className="member-project-card" onClick={onSelect} type="button">
      <span className={`pill ${statusClass(project.status)}`}>{statusLabels[project.status]}</span>
      <span className="more-dot">...</span>
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
    </button>
  );
}
