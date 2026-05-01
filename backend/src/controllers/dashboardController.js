const Project = require("../models/Project");
const { getProjectStatus, getOverallCompletion, serializeProject } = require("../utils/projectMetrics");

async function getDashboard(req, res) {
  const query =
    req.user.role === "admin"
      ? {}
      : {
          "members.user": req.user._id,
        };

  const projects = await Project.find(query).populate("members.user", "name email role").sort({ createdAt: -1 });

  const serializedProjects = projects.map((project) => serializeProject(project, req.user._id));

  if (req.user.role === "admin") {
    const stats = projects.reduce(
      (acc, project) => {
        const status = getProjectStatus(project);
        acc.totalProjects += 1;
        acc[status] += 1;
        return acc;
      },
      { totalProjects: 0, completed: 0, progress: 0, overdue: 0 }
    );

    return res.json({
      success: true,
      data: {
        role: "admin",
        stats: {
          totalProjects: stats.totalProjects,
          completedProjects: stats.completed,
          ongoingProjects: stats.progress,
          overdueProjects: stats.overdue,
          averageCompletion: serializedProjects.length
            ? Math.round(
                serializedProjects.reduce((sum, project) => sum + getOverallCompletion(project), 0) /
                  serializedProjects.length
              )
            : 0,
        },
        projects: serializedProjects,
      },
    });
  }

  const tasks = serializedProjects.map((project) => {
    const memberRecord = project.members.find((member) => String(member.user.id) === String(req.user._id));
    return {
      projectId: project.id,
      projectName: project.name,
      status: project.status,
      progress: memberRecord?.progress || 0,
    };
  });

  const taskStats = tasks.reduce(
    (acc, task) => {
      acc.totalTasks += 1;
      if (task.progress >= 100) {
        acc.completedTasks += 1;
      }
      if (task.status === "overdue" && task.progress < 100) {
        acc.overdueTasks += 1;
      }
      return acc;
    },
    { totalTasks: 0, completedTasks: 0, overdueTasks: 0 }
  );

  return res.json({
    success: true,
    data: {
      role: "member",
      stats: taskStats,
      projects: serializedProjects,
    },
  });
}

module.exports = { getDashboard };
