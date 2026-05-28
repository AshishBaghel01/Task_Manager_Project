import { motion } from "framer-motion";
import { X } from "lucide-react";
import { statusLabels } from "../constants/project";
import { formatDate, initials, statusClass } from "../utils/project";
import ProgressBar from "./common/ProgressBar";

export default function ProjectInspector({ currentUser, onClose, onUpdateProgress, project, updatingProgress }) {
  if (!project) return null;

  const selfAssignment = project.members.find((member) => member.user.id === currentUser.id);

  return (
    <motion.aside
      className="project-inspector"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 36 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <button className="close-inspector" onClick={onClose} type="button"><X size={18} /></button>
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
        {project.members
          .filter((member) =>
            currentUser.role === "admin" ? true : member.user.id === currentUser.id
          )
          .map((member) => (
            <motion.article className={member.user.id === currentUser.id ? "self" : ""} key={member.id} whileHover={{ x: 4 }}>
              <span>{initials(member.user.name)}</span>
              <div>
                <strong>{member.user.name}</strong>
                <small>{member.assignedTask}</small>
                <ProgressBar progress={member.progress} status={project.status} />
              </div>
              <em>{member.progress}%</em>
            </motion.article>
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
    </motion.aside>
  );
}
