export function formatDate(date, options = {}) {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function clampProgress(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export function initials(name = "User") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function statusClass(status) {
  if (status === "completed") return "is-completed";
  if (status === "overdue") return "is-overdue";
  return "is-progress";
}

export function isSameCalendarDate(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function getProjectProgress(project, user, isAdmin) {
  if (isAdmin) return project.overallCompletion;
  const member = project.members.find((item) => item.user.id === user.id);
  return member?.progress ?? project.overallCompletion;
}
