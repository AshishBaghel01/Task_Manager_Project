import heroImage from "../../assets/hero.png";
import AvatarStack from "../../components/common/AvatarStack";
import EmptyState from "../../components/common/EmptyState";
import ProgressBar from "../../components/common/ProgressBar";
import { statusLabels } from "../../constants/project";
import { formatDate, statusClass } from "../../utils/project";

export default function DashboardView({ dashboard, isAdmin, onNavigate, onSelectProject, user }) {
  const stats = dashboard.stats || {};
  const projects = dashboard.projects || [];
  const visibleProjects = projects.slice(0, isAdmin ? 3 : 2);

  return (
    <div className={isAdmin ? "dashboard-grid admin-dashboard" : "dashboard-grid member-dashboard"}>
      <section className="stat-row">
        {isAdmin ? (
          <>
            <MetricCard accent="mint" label="Total Projects Completed" trend=" " value={stats.completedProjects || 0} />
            <MetricCard accent="teal" label="Ongoing Projects" trend="Active Now" value={stats.ongoingProjects || 0} />
            <MetricCard accent="red" label="Overdue Projects" trend="Action Required" value={stats.overdueProjects || 0} />
          </>
        ) : (
          <>
            <MetricCard accent="aqua" label="Total Tasks Assigned" trend="+12%" value={stats.totalTasks || 0} />
            <MetricCard accent="mint" label="Completed Tasks" trend={`${stats.completedTasks || 0} done`} value={stats.completedTasks || 0} />
            <MetricCard accent="red" label="Overdue Tasks" trend="Action Needed" value={stats.overdueTasks || 0} />
          </>
        )}
      </section>

      <section className="main-panel">
        <div className="section-heading">
          <div>
            <h2>{isAdmin ? "Managed Projects" : "Enrolled Projects"}</h2>
            <p>{isAdmin ? "Project health, team output, and active timelines." : "Manage and track your active initiatives."}</p>
          </div>
          <button onClick={() => onNavigate("projects")} type="button">
            View All Projects {"->"}
          </button>
        </div>

        {isAdmin ? (
          <ProjectTable onSelectProject={onSelectProject} projects={visibleProjects} />
        ) : (
          <div className="project-card-grid">
            {visibleProjects.map((project, index) => (
              <ProjectTile
                image={index % 2 === 0 ? heroImage : null}
                key={project.id}
                onSelect={() => onSelectProject(project)}
                project={project}
                user={user}
              />
            ))}
          </div>
        )}
      </section>

      <aside className="deadline-panel">
        <MiniCalendar projects={projects} />
        <div className="deadline-list">
          <h3>{isAdmin ? "Timelines" : "Upcoming Deadlines"}</h3>
          {projects.slice(0, 3).map((project) => (
            <button key={project.id} onClick={() => onSelectProject(project)} type="button">
              <span>{formatDate(project.endDate)}</span>
              <strong>{project.name}</strong>
              <small>{statusLabels[project.status]}</small>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function MetricCard({ accent, label, trend, value }) {
  return (
    <article className={`metric-card ${accent}`}>
      <div className="metric-top">
        <span className="metric-icon">OK</span>
        <small>{trend}</small>
      </div>
      <p>{label}</p>
      <strong>{String(value).padStart(label.includes("Overdue") ? 2 : 0, "0")}</strong>
    </article>
  );
}

function ProjectTable({ onSelectProject, projects }) {
  if (!projects.length) return <EmptyState title="No projects yet." text="Create a project and assign members to begin." />;

  return (
    <div className="project-table">
      <div className="table-head">
        <span>Project Name</span>
        <span>Status</span>
        <span>Timeline</span>
      </div>
      {projects.map((project) => (
        <button className="table-row" key={project.id} onClick={() => onSelectProject(project)} type="button">
          <span>
            <strong>{project.name}</strong>
            <small>ID: {String(project.id).slice(-6).toUpperCase()}</small>
          </span>
          <span className={`pill ${statusClass(project.status)}`}>{statusLabels[project.status]}</span>
          <span>
            <strong>{project.overallCompletion}%</strong>
            <ProgressBar progress={project.overallCompletion} status={project.status} />
          </span>
        </button>
      ))}
    </div>
  );
}

function ProjectTile({ image, onSelect, project, user }) {
  const member = project.members.find((item) => item.user.id === user.id);

  return (
    <button className="project-tile" onClick={onSelect} type="button">
      <div className="tile-media" style={image ? { backgroundImage: `url(${image})` } : undefined}>
        <span className={`pill ${statusClass(project.status)}`}>{statusLabels[project.status]}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{member?.assignedTask || project.description}</p>
      <div className="progress-line">
        <span>Progress</span>
        <strong>{member?.progress ?? project.overallCompletion}%</strong>
      </div>
      <ProgressBar progress={member?.progress ?? project.overallCompletion} status={project.status} />
      <div className="tile-footer">
        <AvatarStack members={project.members} />
        <span>{formatDate(project.endDate)}</span>
      </div>
    </button>
  );
}

function MiniCalendar({ projects }) {
  const days = Array.from({ length: 21 }, (_, index) => index + 1);
  const marked = new Set(projects.map((project) => new Date(project.endDate).getDate()));

  return (
    <div className="mini-calendar">
      <div className="mini-cal-top">
        <h3>Deadline Calendar</h3>
        <span>{"< >"}</span>
      </div>
      <div className="mini-cal-grid weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <strong key={`${day}-${index}`}>{day}</strong>)}
      </div>
      <div className="mini-cal-grid">
        {days.map((day) => <span className={marked.has(day) ? "marked" : ""} key={day}>{day}</span>)}
      </div>
    </div>
  );
}
