function getStatusClass(status) {
  if (status === "completed") return "status-completed";
  if (status === "overdue") return "status-overdue";
  return "status-progress";
}

export default function ProjectCard({ project, selected, onSelect, role }) {
  return (
    <button
      className={`project-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(project)}
      type="button"
    >
      <div className="project-card-top">
        <div>
          <p className="project-label">{role === "admin" ? "Project" : "Assigned work"}</p>
          <h3>{project.name}</h3>
        </div>
        <span className={`status-pill ${getStatusClass(project.status)}`}>{project.status}</span>
      </div>

      <p className="project-copy">{project.description}</p>

      <div className="project-meta">
        <span>{project.leftDays >= 0 ? `${project.leftDays} days left` : `${Math.abs(project.leftDays)} days late`}</span>
        <span>{project.overallCompletion}% overall</span>
      </div>
    </button>
  );
}
