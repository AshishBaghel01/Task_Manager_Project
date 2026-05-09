import { useCallback, useEffect, useState } from "react";
import {
  emptyAssignmentForm,
  emptyLogin,
  emptyMember,
  emptyProjectForm,
  emptySetup,
  emptySignup,
} from "../constants/forms";
import { apiRequest } from "../utils/api";
import { clampProgress } from "../utils/project";

const TOKEN_KEY = "task_manager_token";
const emptyDashboard = { role: "", stats: {}, projects: [] };

export function useWorkspace() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasAdmin, setHasAdmin] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [signupForm, setSignupForm] = useState(emptySignup);
  const [setupForm, setSetupForm] = useState(emptySetup);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [memberDirectory, setMemberDirectory] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm);
  const [assignments, setAssignments] = useState([]);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const persistSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const loadSession = useCallback(async (activeToken) => {
    setDashboardLoading(true);
    try {
      const [meResponse, dashboardResponse] = await Promise.all([
        apiRequest("/auth/me", { token: activeToken }),
        apiRequest("/dashboard", { token: activeToken }),
      ]);

      setUser(meResponse.data.user);
      setDashboard(dashboardResponse.data);
      setSelectedProjectId((currentId) => {
        const projects = dashboardResponse.data.projects;
        if (currentId && projects.some((project) => project.id === currentId)) return currentId;
        return projects[0]?.id || "";
      });

      if (meResponse.data.user.role === "admin") {
        const membersResponse = await apiRequest("/users/members", { token: activeToken });
        setMemberDirectory(membersResponse.data.members);
      }
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const bootstrapResponse = await apiRequest("/auth/bootstrap");
        setHasAdmin(bootstrapResponse.data.hasAdmin);
        if (token) await loadSession(token);
      } catch (requestError) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
        setError(requestError.message);
      } finally {
        setBootstrapLoading(false);
      }
    }

    initialize();
  }, [loadSession, token]);

  async function refreshData(activeToken = token) {
    await loadSession(activeToken);
  }

  async function handleLogin(event, role = "member") {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest("/auth/login", { method: "POST", body: { ...loginForm, role } });
      persistSession(response.data.token, response.data.user);
      setLoginForm(emptyLogin);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetupAdmin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/auth/setup-admin", { method: "POST", body: setupForm });
      setHasAdmin(true);
      persistSession(response.data.token, response.data.user);
      setSetupForm(emptySetup);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest("/auth/register", { method: "POST", body: signupForm });
      persistSession(response.data.token, response.data.user);
      setSignupForm(emptySignup);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMember(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiRequest("/users/members", { method: "POST", token, body: memberForm });
      setMemberForm(emptyMember);
      setSuccessMessage("Member account created.");
      await refreshData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function addAssignment() {
    const member = memberDirectory.find((item) => item._id === selectedMemberId || item.id === selectedMemberId);
    if (!member || !assignmentForm.role || !assignmentForm.assignedTask) {
      setError("Select a member and fill role and task before assigning.");
      return;
    }
    if (assignments.some((item) => item.user === selectedMemberId)) {
      setError("This member is already assigned to the project.");
      return;
    }

    setAssignments((current) => [
      ...current,
      {
        user: selectedMemberId,
        name: member.name,
        email: member.email,
        role: assignmentForm.role,
        assignedTask: assignmentForm.assignedTask,
      },
    ]);
    setSelectedMemberId("");
    setAssignmentForm(emptyAssignmentForm);
    setError("");
  }

  function removeAssignment(memberId) {
    setAssignments((current) => current.filter((item) => item.user !== memberId));
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiRequest("/projects", {
        method: "POST",
        token,
        body: { ...projectForm, members: assignments },
      });
      setProjectForm(emptyProjectForm);
      setAssignments([]);
      setSelectedMemberId("");
      setAssignmentForm(emptyAssignmentForm);
      setSuccessMessage("Project created successfully.");
      setActiveView("projects");
      await refreshData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProgress(projectId, memberId, progress) {
    setUpdatingProgress(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiRequest(`/projects/${projectId}/members/${memberId}/progress`, {
        method: "PATCH",
        token,
        body: { progress: clampProgress(progress) },
      });
      setSuccessMessage("Progress updated.");
      await refreshData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingProgress(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
    setDashboard(emptyDashboard);
    setSelectedProjectId("");
    setActiveView("dashboard");
    setSuccessMessage("");
    setError("");
  }

  return {
    activeView,
    addAssignment,
    assignmentForm,
    assignments,
    bootstrapLoading,
    dashboard,
    dashboardLoading,
    error,
    handleCreateMember,
    handleCreateProject,
    handleLogin,
    handleLogout,
    handleSetupAdmin,
    handleSignup,
    handleUpdateProgress,
    hasAdmin,
    loading,
    loginForm,
    memberDirectory,
    memberForm,
    projectForm,
    removeAssignment,
    selectedMemberId,
    selectedProjectId,
    setActiveView,
    setAssignmentForm,
    setLoginForm,
    setMemberForm,
    setProjectForm,
    setSelectedMemberId,
    setSelectedProjectId,
    setSetupForm,
    setSignupForm,
    setupForm,
    signupForm,
    successMessage,
    token,
    updatingProgress,
    user,
  };
}
