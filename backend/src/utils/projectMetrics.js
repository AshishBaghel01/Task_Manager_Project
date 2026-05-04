function normalizeDate(date) {
  return new Date(date);
}

function getProjectStatus(project) {
  const now = new Date();
  const endDate = normalizeDate(project.endDate);
  const members = project.members || [];
  const overallCompletion = getOverallCompletion(project);

  if (members.length > 0 && members.every((member) => Number(member.progress) >= 100)) {
    return "completed";
  }

  if (overallCompletion >= 100) {
    return "completed";
  }

  if (endDate < now) {
    return "overdue";
  }

  return "progress";
}

function getOverallCompletion(project) {
  const members = project.members || [];

  if (!members.length) {
    return 0;
  }

  const total = members.reduce((sum, member) => sum + Number(member.progress || 0), 0);
  return Math.round(total / members.length);
}

function getLeftDays(project) {
  const now = new Date();
  const endDate = normalizeDate(project.endDate);
  const diff = endDate.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function serializeProject(project, viewerId) {
  const members = (project.members || []).map((member) => {
    const isSelf = viewerId && String(member.user?._id || member.user) === String(viewerId);
    return {
      id: member._id,
      user: member.user && typeof member.user === "object"
        ? {
            id: member.user._id,
            name: member.user.name,
            email: member.user.email,
            role: member.user.role,
          }
        : { id: member.user },
      role: member.role,
      assignedTask: member.assignedTask,
      progress: Number(member.progress || 0),
      updatedAt: member.updatedAt,
      isSelf,
    };
  });

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    endDate: project.endDate,
    createdAt: project.createdAt,
    status: getProjectStatus(project),
    leftDays: getLeftDays(project),
    overallCompletion: getOverallCompletion(project),
    members,
  };
}

export { getProjectStatus, getOverallCompletion, getLeftDays, serializeProject };
