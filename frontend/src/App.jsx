import { useEffect, useState } from "react";
import AuthScreen from "./components/AuthScreen";
import heroImage from "./assets/hero.png";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage";
import AdminCreateProjectPage from "./pages/admin/AdminCreateProjectPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage";
import MemberCalendarPage from "./pages/member/MemberCalendarPage";
import MemberDashboardPage from "./pages/member/MemberDashboardPage";
import MemberProjectsPage from "./pages/member/MemberProjectsPage";
import { apiRequest } from "./utils/api";

const emptyLogin = { email: "", password: "" };
const emptySetup = { name: "", email: "", password: "" };
const emptySignup = { name: "", email: "", password: "" };
const emptyMember = { name: "", email: "", password: "" };
const emptyProjectForm = { name: "", description: "", startDate: "", endDate: "" };
const emptyAssignmentForm = { role: "", assignedTask: "" };

const statusLabels = {
  progress: "In Progress",
  completed: "Completed",
  overdue: "Overdue",
};

function formatDate(date, options = {}) {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...options,
  });
}

function clampProgress(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function initials(name = "User") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusClass(status) {
  if (status === "completed") return "is-completed";
  if (status === "overdue") return "is-overdue";
  return "is-progress";
}

function isSameCalendarDate(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getProjectProgress(project, user, isAdmin) {
  if (isAdmin) return project.overallCompletion;
  const member = project.members.find((item) => item.user.id === user.id);
  return member?.progress ?? project.overallCompletion;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("task_manager_token") || "");
  const [user, setUser] = useState(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasAdmin, setHasAdmin] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [signupForm, setSignupForm] = useState(emptySignup);
  const [setupForm, setSetupForm] = useState(emptySetup);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [memberDirectory, setMemberDirectory] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm);
  const [assignments, setAssignments] = useState([]);
  const [dashboard, setDashboard] = useState({ role: "", stats: {}, projects: [] });
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    async function initialize() {
      try {
        const bootstrapResponse = await apiRequest("/auth/bootstrap");
        setHasAdmin(bootstrapResponse.data.hasAdmin);
        if (token) await loadSession(token);
      } catch (requestError) {
        localStorage.removeItem("task_manager_token");
        setToken("");
        setUser(null);
        setError(requestError.message);
      } finally {
        setBootstrapLoading(false);
      }
    }

    initialize();
  }, [token]);

  async function loadSession(activeToken) {
    setDashboardLoading(true);
    try {
      const [meResponse, dashboardResponse] = await Promise.all([
        apiRequest("/auth/me", { token: activeToken }),
        apiRequest("/dashboard", { token: activeToken }),
      ]);

      setUser(meResponse.data.user);
      setDashboard(dashboardResponse.data);
      setSelectedProjectId((currentId) => {
        const projects = dashboardResponse.data.projects;
        if (currentId && projects.some((project) => project.id === currentId)) return currentId;
        return projects[0]?.id || "";
      });

      if (meResponse.data.user.role === "admin") {
        const membersResponse = await apiRequest("/users/members", { token: activeToken });
        setMemberDirectory(membersResponse.data.members);
      }
    } finally {
      setDashboardLoading(false);
    }
  }

  async function refreshData(activeToken = token) {
    await loadSession(activeToken);
  }

  function persistSession(nextToken, nextUser) {
    localStorage.setItem("task_manager_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest("/auth/login", { method: "POST", body: loginForm });
      persistSession(response.data.token, response.data.user);
      setLoginForm(emptyLogin);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetupAdmin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/auth/setup-admin", { method: "POST", body: setupForm });
      setHasAdmin(true);
      persistSession(response.data.token, response.data.user);
      setSetupForm(emptySetup);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest("/auth/register", { method: "POST", body: signupForm });
      persistSession(response.data.token, response.data.user);
      setSignupForm(emptySignup);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMember(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiRequest("/users/members", { method: "POST", token, body: memberForm });
      setMemberForm(emptyMember);
      setSuccessMessage("Member account created.");
      await refreshData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function addAssignment() {
    const member = memberDirectory.find((item) => item._id === selectedMemberId || item.id === selectedMemberId);
    if (!member || !assignmentForm.role || !assignmentForm.assignedTask) {
      setError("Select a member and fill role and task before assigning.");
      return;
    }
    if (assignments.some((item) => item.user === selectedMemberId)) {
      setError("This member is already assigned to the project.");
      return;
    }

    setAssignments((current) => [
      ...current,
      {
        user: selectedMemberId,
        name: member.name,
        email: member.email,
        role: assignmentForm.role,
        assignedTask: assignmentForm.assignedTask,
      },
    ]);
    setSelectedMemberId("");
    setAssignmentForm(emptyAssignmentForm);
    setError("");
  }

  function removeAssignment(memberId) {
    setAssignments((current) => current.filter((item) => item.user !== memberId));
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiRequest("/projects", {
        method: "POST",
        token,
        body: { ...projectForm, members: assignments },
      });
      setProjectForm(emptyProjectForm);
      setAssignments([]);
      setSelectedMemberId("");
      setAssignmentForm(emptyAssignmentForm);
      setSuccessMessage("Project created successfully.");
      setActiveView("projects");
      await refreshData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProgress(projectId, memberId, progress) {
    setUpdatingProgress(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiRequest(`/projects/${projectId}/members/${memberId}/progress`, {
        method: "PATCH",
        token,
        body: { progress: clampProgress(progress) },
      });
      setSuccessMessage("Progress updated.");
      await refreshData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingProgress(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("task_manager_token");
    setToken("");
    setUser(null);
    setDashboard({ role: "", stats: {}, projects: [] });
    setSelectedProjectId("");
    setActiveView("dashboard");
    setSuccessMessage("");
    setError("");
  }

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

  const selectedProject = dashboard.projects.find((project) => project.id === selectedProjectId) || null;
  const isAdmin = user.role === "admin";

  return (
    <main className="app-layout">
      <Sidebar
        activeView={activeView}
        isAdmin={isAdmin}
        onCreate={() => setActiveView("create")}
        onLogout={handleLogout}
        onNavigate={setActiveView}
        user={user}
      />

      <section className="workspace">
        <TopBar
          activeView={activeView}
          dashboardLoading={dashboardLoading}
          isAdmin={isAdmin}
          onCreate={() => setActiveView("create")}
          user={user}
        />

        {error ? <div className="flash-message error">{error}</div> : null}
        {successMessage ? <div className="flash-message success">{successMessage}</div> : null}

        {activeView === "dashboard" ? (
          isAdmin ? (
            <AdminDashboardPage>
              <DashboardView
                dashboard={dashboard}
                isAdmin={isAdmin}
                onNavigate={setActiveView}
                onSelectProject={(project) => setSelectedProjectId(project.id)}
                user={user}
              />
            </AdminDashboardPage>
          ) : (
            <MemberDashboardPage>
              <DashboardView
                dashboard={dashboard}
                isAdmin={isAdmin}
                onNavigate={setActiveView}
                onSelectProject={(project) => setSelectedProjectId(project.id)}
                user={user}
              />
            </MemberDashboardPage>
          )
        ) : null}

        {activeView === "projects" ? (
          isAdmin ? (
            <AdminProjectsPage>
              <ProjectsView
                isAdmin={isAdmin}
                onCreate={() => setActiveView("create")}
                onSelectProject={(project) => setSelectedProjectId(project.id)}
                projects={dashboard.projects}
                user={user}
              />
            </AdminProjectsPage>
          ) : (
            <MemberProjectsPage>
              <ProjectsView
                isAdmin={isAdmin}
                onCreate={() => setActiveView("create")}
                onSelectProject={(project) => setSelectedProjectId(project.id)}
                projects={dashboard.projects}
                user={user}
              />
            </MemberProjectsPage>
          )
        ) : null}

        {activeView === "calendar" ? (
          isAdmin ? (
            <AdminCalendarPage>
              <CalendarView isAdmin={isAdmin} projects={dashboard.projects} user={user} />
            </AdminCalendarPage>
          ) : (
            <MemberCalendarPage>
              <CalendarView isAdmin={isAdmin} projects={dashboard.projects} user={user} />
            </MemberCalendarPage>
          )
        ) : null}

        {activeView === "create" && isAdmin ? (
          <AdminCreateProjectPage>
            <CreateProjectView
              assignmentForm={assignmentForm}
              assignments={assignments}
              loading={loading}
              memberDirectory={memberDirectory}
              memberForm={memberForm}
              onAddAssignment={addAssignment}
              onAssignmentChange={(event) =>
                setAssignmentForm({ ...assignmentForm, [event.target.name]: event.target.value })
              }
              onCreateMember={handleCreateMember}
              onCreateProject={handleCreateProject}
              onMemberChange={(event) => setMemberForm({ ...memberForm, [event.target.name]: event.target.value })}
              onProjectChange={(event) => setProjectForm({ ...projectForm, [event.target.name]: event.target.value })}
              onRemoveAssignment={removeAssignment}
              onSelectedMemberChange={(event) => setSelectedMemberId(event.target.value)}
              projectForm={projectForm}
              selectedMemberId={selectedMemberId}
              user={user}
            />
          </AdminCreateProjectPage>
        ) : null}

        <ProjectInspector
          currentUser={user}
          onClose={() => setSelectedProjectId("")}
          onUpdateProgress={handleUpdateProgress}
          project={selectedProject}
          updatingProgress={updatingProgress}
        />
      </section>
    </main>
  );
}

function Sidebar({ activeView, isAdmin, onCreate, onLogout, onNavigate, user }) {
  const links = [
    { id: "dashboard", label: "Dashboard", icon: "[]" },
    { id: "projects", label: "Projects", icon: "<>" },
    { id: "calendar", label: "Calendar", icon: "##" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">{isAdmin ? "TF" : "TF"}</span>
        <div>
          <strong>{isAdmin ? "TaskFlow" : "TaskFlow"}</strong>
          
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

function TopBar({ activeView, dashboardLoading, isAdmin, onCreate, user }) {
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
        <span>O</span>
        <input placeholder={activeView === "calendar" ? "Search events..." : "Search projects, tasks..."} />
      </label>

      <div className="top-actions">
        
        {isAdmin && activeView === "projects" ? (
          <button className="new-project-button" onClick={onCreate} type="button">
            New Project
          </button>
        ) : null}
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

function DashboardView({ dashboard, isAdmin, onNavigate, onSelectProject, user }) {
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
        <span className="metric-icon">✓</span>
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

function ProjectsView({ isAdmin, onCreate, onSelectProject, projects, user }) {
  const [projectView, setProjectView] = useState("all");
  const projectFilters = [
    { id: "all", label: "All" },
    { id: "date", label: "Date Created" },
    { id: "progress", label: "Progress" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "overdue", label: "Overdue" },
  ];

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
      <span className="row-icon">{project.status === "overdue" ? "!" : "✓"}</span>
      <span className="row-main">
        <strong>{project.name}</strong>
        <small>Created {formatDate(project.createdAt, { year: "numeric" })} • ID: PM-{String(project.id).slice(-4).toUpperCase()}</small>
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

function CalendarView({ isAdmin, projects, user }) {
  const calendarYear = 2026;
  const [monthIndex, setMonthIndex] = useState(4);
  const visibleDate = new Date(calendarYear, monthIndex, 1);
  const monthName = visibleDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  function visitPreviousMonth() {
    setMonthIndex((current) => (current === 0 ? 11 : current - 1));
  }

  function visitNextMonth() {
    setMonthIndex((current) => (current === 11 ? 0 : current + 1));
  }

  return (
    <section className="calendar-page">
      <div className="calendar-board">
        <div className="calendar-toolbar">
          <button onClick={visitPreviousMonth} type="button">{"<"}</button>
          <h2>{monthName}</h2>
          <button onClick={visitNextMonth} type="button">{">"}</button>
          <select
            aria-label="Choose month in 2026"
            className="month-select"
            onChange={(event) => setMonthIndex(Number(event.target.value))}
            value={monthIndex}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                {new Date(calendarYear, index, 1).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
          <div className="segmented">
            <button className="active" type="button">Month</button>
            <button type="button">Week</button>
            <button type="button">Day</button>
          </div>
        </div>
        <CalendarGrid monthIndex={monthIndex} projects={projects} year={calendarYear} />
      </div>

      <aside className="calendar-side-panel">
        <h2>{isAdmin ? "Active Projects" : "Your Projects"}</h2>
        <p>{isAdmin ? "Current project windows and progress." : "Timeline of your active engagements."}</p>
        {projects.slice(0, 4).map((project) => {
          const member = project.members.find((item) => item.user.id === user.id);
          return (
            <button key={project.id} type="button">
              <span className={`side-marker ${statusClass(project.status)}`} />
              <strong>{project.name}</strong>
              <small>{formatDate(project.startDate)} - {formatDate(project.endDate)}</small>
              <ProgressBar progress={member?.progress ?? project.overallCompletion} status={project.status} />
            </button>
          );
        })}
        {!isAdmin ? (
          <div className="focus-card">
            <h3>Weekly Focus</h3>
            <p>Finish the highest-priority assigned task and update your progress before TimeLine.</p>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function CalendarGrid({ monthIndex, projects, year }) {
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);
  const leadingDays = monthStart.getDay();
  const totalDays = monthEnd.getDate();
  const visibleCells = Math.ceil((leadingDays + totalDays) / 7) * 7;
  const days = Array.from({ length: visibleCells }, (_, index) => {
    const dayNumber = index - leadingDays + 1;
    return new Date(year, monthIndex, dayNumber);
  });
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="large-calendar">
      {labels.map((label) => <strong key={label}>{label}</strong>)}
      {days.map((day) => {
        const isOutsideMonth = day.getMonth() !== monthIndex;
        const startMatches = projects.filter((project) => isSameCalendarDate(day, new Date(project.startDate)));
        const endMatches = projects.filter((project) => isSameCalendarDate(day, new Date(project.endDate)));
        const cellClass = [
          isOutsideMonth ? "muted-day" : "",
          startMatches.length ? "project-start-day" : "",
          endMatches.length ? "project-end-day" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className={cellClass} key={day.toISOString()}>
            <span>{day.getDate()}</span>
            {startMatches.slice(0, 1).map((project) => (
              <small className="date-chip start-chip" key={`start-${project.id}`}>
                Start: {project.name.slice(0, 12)}
              </small>
            ))}
            {endMatches.slice(0, 1).map((project) => (
              <small className="date-chip end-chip" key={`end-${project.id}`}>
                End: {project.name.slice(0, 12)}
              </small>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function CreateProjectView({
  assignmentForm,
  assignments,
  loading,
  memberDirectory,
  memberForm,
  onAddAssignment,
  onAssignmentChange,
  onCreateMember,
  onCreateProject,
  onMemberChange,
  onProjectChange,
  onRemoveAssignment,
  onSelectedMemberChange,
  projectForm,
  selectedMemberId,
  user,
}) {
  return (
    <section className="create-page">
      <div className="create-intro">
        <h2>Initialize New Workflow</h2>
        <p>Configure your project parameters and assemble your core team to begin high-velocity collaboration.</p>
      </div>

      <form className="create-card" onSubmit={onCreateProject}>
        <h3>i Primary Details</h3>
        <label>
          Project Name
          <input name="name" onChange={onProjectChange} placeholder="e.g., Q4 Strategic Infrastructure Migration" value={projectForm.name} />
        </label>
        <label>
          Description
          <textarea name="description" onChange={onProjectChange} placeholder="Detail the primary objectives, key stakeholders, and expected outcomes of this project..." rows="5" value={projectForm.description} />
        </label>
        <div className="date-fields">
          <label>
            Start Date
            <input name="startDate" onChange={onProjectChange} type="date" value={projectForm.startDate} />
          </label>
          <label>
            End Date
            <input name="endDate" onChange={onProjectChange} type="date" value={projectForm.endDate} />
          </label>
        </div>

        <h3>+ Member Assignment</h3>
        <div className="assign-row">
          <select onChange={onSelectedMemberChange} value={selectedMemberId}>
            <option value="">Add team member by name</option>
            {memberDirectory.map((member) => (
              <option key={member._id || member.id} value={member._id || member.id}>
                {member.name} - {member.email}
              </option>
            ))}
          </select>
          <input name="role" onChange={onAssignmentChange} placeholder="Role" value={assignmentForm.role} />
          <input name="assignedTask" onChange={onAssignmentChange} placeholder="Task: e.g., Update API docs" value={assignmentForm.assignedTask} />
          <button onClick={onAddAssignment} type="button">+ Assign</button>
        </div>

        <div className="assignment-list">
          <article className="assignment-owner">
            <span>{initials(user.name)}</span>
            <div>
              <strong>{user.name} (You)</strong>
              <small>Project Manager</small>
            </div>
            <em>Owner</em>
          </article>
          {assignments.map((assignment) => (
            <article key={assignment.user}>
              <span>{initials(assignment.name)}</span>
              <div>
                <strong>{assignment.name}</strong>
                <small>{assignment.assignedTask}</small>
              </div>
              <em>{assignment.role}</em>
              <button onClick={() => onRemoveAssignment(assignment.user)} type="button">Remove</button>
            </article>
          ))}
        </div>

        <button className="submit-project" disabled={loading} type="submit">
          {loading ? "Creating..." : "Save Project"}
        </button>
      </form>

      <form className="member-create-card" onSubmit={onCreateMember}>
        <h3>Create Member Account</h3>
        <input name="name" onChange={onMemberChange} placeholder="Member name" value={memberForm.name} />
        <input name="email" onChange={onMemberChange} placeholder="Member email" type="email" value={memberForm.email} />
        <input name="password" onChange={onMemberChange} placeholder="Temporary password" type="password" value={memberForm.password} />
        <button disabled={loading} type="submit">Add Member</button>
      </form>
    </section>
  );
}

function ProjectInspector({ currentUser, onClose, onUpdateProgress, project, updatingProgress }) {
  if (!project) return null;

  const selfAssignment = project.members.find((member) => member.user.id === currentUser.id);

  return (
    <aside className="project-inspector">
      <button className="close-inspector" onClick={onClose} type="button">x</button>
      <span className={`pill ${statusClass(project.status)}`}>{statusLabels[project.status]}</span>
      <h2>{project.name}</h2>
      <p>{project.description}</p>

      <div className="detail-metrics">
        <span><small>Start Date</small><strong>{formatDate(project.startDate, { year: "numeric" })}</strong></span>
        <span><small>End Date</small><strong>{formatDate(project.endDate, { year: "numeric" })}</strong></span>
        <span><small>Left Days</small><strong>{project.leftDays >= 0 ? project.leftDays : `${Math.abs(project.leftDays)} late`}</strong></span>
        <span><small>Overall</small><strong>{project.overallCompletion}%</strong></span>
      </div>

      <h3>{currentUser.role === "admin" ? "Member Completion" : "Your Task"}</h3>
      <div className="inspector-members">
        {project.members.map((member) => (
          <article className={member.user.id === currentUser.id ? "self" : ""} key={member.id}>
            <span>{initials(member.user.name)}</span>
            <div>
              <strong>{member.user.name}</strong>
              <small>{member.assignedTask}</small>
              <ProgressBar progress={member.progress} status={project.status} />
            </div>
            <em>{member.progress}%</em>
          </article>
        ))}
      </div>

      {selfAssignment && currentUser.role === "member" ? (
        <form
          className="progress-update"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onUpdateProgress(project.id, selfAssignment.id, formData.get("progress"));
          }}
        >
          <label>
            Set your completion percentage
            <input defaultValue={selfAssignment.progress} max="100" min="0" name="progress" type="number" />
          </label>
          <button disabled={updatingProgress} type="submit">{updatingProgress ? "Saving..." : "Update Progress"}</button>
        </form>
      ) : null}
    </aside>
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

function ProgressBar({ progress, status }) {
  return (
    <span className="progress-bar">
      <i className={statusClass(status)} style={{ width: `${clampProgress(progress)}%` }} />
    </span>
  );
}

function AvatarStack({ members }) {
  return (
    <span className="avatar-stack">
      {members.slice(0, 3).map((member) => <i key={member.id}>{initials(member.user.name)}</i>)}
      {members.length > 3 ? <i>+{members.length - 3}</i> : null}
    </span>
  );
}

function EmptyState({ text, title }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;
