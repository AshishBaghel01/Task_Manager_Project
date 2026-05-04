import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import CreateProjectView from "../../features/projects/CreateProjectView";

export default function AdminCreateProjectPage() {
  const {
    addAssignment,
    assignmentForm,
    assignments,
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
    user,
  } = useContext(AppContext);

  return (
    <section className="page admin-create-project-page">
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
    </section>
  );
}
