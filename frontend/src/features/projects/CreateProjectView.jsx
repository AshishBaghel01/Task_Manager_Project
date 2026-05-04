import { initials } from "../../utils/project";

export default function CreateProjectView({
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
