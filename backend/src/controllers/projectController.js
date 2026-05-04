import Project from "../models/Project.js";
import User from "../models/User.js";
import { serializeProject } from "../utils/projectMetrics.js";

async function listProjects(req, res) {
  const query =
    req.user.role === "admin"
      ? {}
      : {
          "members.user": req.user._id,
        };

  const projects = await Project.find(query)
    .populate("members.user", "name email role")
    .sort({ createdAt: -1 });

  const serialized = projects.map((project) => serializeProject(project, req.user._id));
  res.json({ success: true, data: { projects: serialized } });
}

async function createProject(req, res) {
  const { name, description, startDate, endDate, members } = req.body;

  if (!name || !description || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: "Project name, description, start date and end date are required." });
  }

  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ success: false, message: "End date must be after start date." });
  }

  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ success: false, message: "At least one member must be assigned." });
  }

  const memberIds = members.map((member) => member.user);
  const existingMembers = await User.find({ _id: { $in: memberIds }, role: "member" }).select("_id");

  if (existingMembers.length !== memberIds.length) {
    return res.status(400).json({ success: false, message: "One or more selected members are invalid." });
  }

  const project = await Project.create({
    name,
    description,
    startDate,
    endDate,
    createdBy: req.user._id,
    members: members.map((member) => ({
      user: member.user,
      role: member.role,
      assignedTask: member.assignedTask,
      progress: Number(member.progress || 0),
      updatedAt: new Date(),
    })),
  });

  const populatedProject = await Project.findById(project._id).populate("members.user", "name email role");
  res.status(201).json({
    success: true,
    message: "Project created successfully.",
    data: { project: serializeProject(populatedProject, req.user._id) },
  });
}

async function getProjectById(req, res) {
  const project = await Project.findById(req.params.id).populate("members.user", "name email role");

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found." });
  }

  if (
    req.user.role !== "admin" &&
    !project.members.some((member) => String(member.user._id) === String(req.user._id))
  ) {
    return res.status(403).json({ success: false, message: "You are not assigned to this project." });
  }

  res.json({ success: true, data: { project: serializeProject(project, req.user._id) } });
}

async function updateMemberProgress(req, res) {
  const { progress } = req.body;
  const project = await Project.findById(req.params.id).populate("members.user", "name email role");

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found." });
  }

  const member = project.members.id(req.params.memberId);
  if (!member) {
    return res.status(404).json({ success: false, message: "Assigned member record not found." });
  }

  if (String(member.user._id) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: "You can only update your own progress." });
  }

  const nextProgress = Number(progress);
  if (Number.isNaN(nextProgress) || nextProgress < 0 || nextProgress > 100) {
    return res.status(400).json({ success: false, message: "Progress must be between 0 and 100." });
  }

  member.progress = nextProgress;
  member.updatedAt = new Date();
  await project.save();

  const updatedProject = await Project.findById(project._id).populate("members.user", "name email role");
  res.json({
    success: true,
    message: "Progress updated successfully.",
    data: { project: serializeProject(updatedProject, req.user._id) },
  });
}

export { listProjects, createProject, getProjectById, updateMemberProgress };
