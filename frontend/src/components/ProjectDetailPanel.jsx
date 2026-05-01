function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusClass(status) {
  if (status === "completed") return "status-completed";
  if (status === "overdue") return "status-overdue";
  return "status-progress";
}

export default function ProjectDetailPanel({
  project,
  currentUser,
  onUpdateProgress,
  updatingProgress,
}) {
  if (!project) {
    return (
      <section className="panel detail-panel empty-state fade-in">
        <p className="eyebrow">Project details</p>
        <h3>Select a project to view full details.</h3>
      </section>
    );
  }

  const selfAssignment = project.members.find((member) => member.user.id === currentUser.id);

  return (
    <section className="panel detail-panel fade-in">
      <div className="detail-hero">
        <div>
          <p className="eyebrow">Project details</p>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <div className={`status-pill large ${statusClass(project.status)}`}>{project.status}</div>
      </div>

      <div className="detail-grid">
        <div className="mini-card">
          <span>Start date</span>
          <strong>{formatDate(project.startDate)}</strong>
        </div>
        <div className="mini-card">
          <span>End date</span>
          <strong>{formatDate(project.endDate)}</strong>
        </div>
        <div className="mini-card">
          <span>Time left</span>
          <strong>{project.leftDays >= 0 ? `${project.leftDays} days` : `${Math.abs(project.leftDays)} days overdue`}</strong>
        </div>
        <div className="mini-card">
          <span>Overall completion</span>
          <strong>{project.overallCompletion}%</strong>
        </div>
      </div>

      <div className="members-section">
        <div className="section-title-row">
          <h3>{currentUser.role === "admin" ? "Member performance" : "Assigned task"}</h3>
        </div>

        <div className="member-list">
          {project.members.map((member) => {
            const isSelf = member.user.id === currentUser.id;
            return (
              <article className={`member-card ${isSelf ? "self" : ""}`} key={member.id}>
                <div className="member-card-top">
                  <div>
                    <h4>{member.user.name}</h4>
                    <p>{member.role}</p>
                  </div>
                  <span>{member.progress}%</span>
                </div>

                <p className="member-task">{member.assignedTask}</p>

                <div className="progress-bar">
                  <div style={{ width: `${member.progress}%` }} />
                </div>

                {isSelf && currentUser.role === "member" ? (
                  <form
                    className="progress-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      onUpdateProgress(project.id, member.id, Number(formData.get("progress")));
                    }}
                  >
                    <input
                      defaultValue={member.progress}
                      max="100"
                      min="0"
                      name="progress"
                      type="number"
                    />
                    <button disabled={updatingProgress} type="submit">
                      {updatingProgress ? "Saving..." : "Update"}
                    </button>
                  </form>
                ) : null}
              </article>
            );
          })}
        </div>

        {selfAssignment && currentUser.role === "member" ? (
          <div className="member-note">
            <span>Your task</span>
            <p>{selfAssignment.assignedTask}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
