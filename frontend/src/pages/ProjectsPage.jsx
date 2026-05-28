import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import ProjectsView from "../features/projects/ProjectsView";
import CreateProjectView from "../features/projects/CreateProjectView";

export default function ProjectsPage() {
  const {
    addAssignment,
    assignmentForm,
    assignments,
    dashboard,
    handleCreateMember,
    handleCreateProject,
    loading,
    memberDirectory,
    memberForm,
    projectForm,
    removeAssignment,
    selectedMemberId,
    setAssignmentForm,
    setMemberForm,
    setProjectForm,
    setSelectedMemberId,
    setSelectedProjectId,
    user,
  } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const isCreateRoute = location.pathname.endsWith("/create");

  const handleSelectProject = (project) => {
    setSelectedProjectId(project.id);
  };

  const handleCreate = () => {
    navigate("/app/projects/create");
  };

  if (isCreateRoute && !isAdmin) return <Navigate to="/app/projects" replace />;

  if (isCreateRoute) {
    return (
      <CreateProjectView
        assignmentForm={assignmentForm}
        assignments={assignments}
        loading={loading}
        memberDirectory={memberDirectory}
        memberForm={memberForm}
        onAddAssignment={addAssignment}
        onAssignmentChange={(event) => setAssignmentForm({ ...assignmentForm, [event.target.name]: event.target.value })}
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
    );
  }

  return (
    <ProjectsView
      isAdmin={isAdmin}
      onCreate={handleCreate}
      onSelectProject={handleSelectProject}
      projects={dashboard.projects || []}
      user={user}
    />
  );
}
