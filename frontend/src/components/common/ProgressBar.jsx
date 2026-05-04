import { clampProgress, statusClass } from "../../utils/project";

export default function ProgressBar({ progress, status }) {
  return (
    <span className="progress-bar">
      <i className={statusClass(status)} style={{ width: `${clampProgress(progress)}%` }} />
    </span>
  );
}
