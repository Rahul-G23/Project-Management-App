import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import MembersPanel from "../components/MembersPanel";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
} from "../services/projectService";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const getId = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "object") {
      return value._id || value.id || "";
    }

    return value;
  };

  const currentUserId = getId(currentUser);

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects. Please try again."
      );
    }
  };

  const fetchProjectDetails = async (project) => {
    setMembersLoading(true);
    setMembersError("");

    try {
      const [taskData, memberData] = await Promise.all([
        getTasks(project._id),
        getProjectMembers(project._id),
      ]);

      setSelectedProject(project);
      setTasks(taskData.tasks || []);
      setMembers(memberData.members || []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load project details. Please try again.";

      setError(message);
      setMembersError(message);
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (projectData) => {
    setError("");
    setSuccess("");

    try {
      const data = await createProject(projectData);

      setIsCreateProjectOpen(false);
      setSuccess("Project created successfully.");

      await fetchProjects();

      if (data.project) {
        await fetchProjectDetails(data.project);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create project. Please try again."
      );
    }
  };

  const handleSelectProject = async (project) => {
    setError("");
    setSuccess("");

    await fetchProjectDetails(project);
  };

  const handleAddMember = async (email) => {
    if (!selectedProject) {
      throw new Error("Please select a project first.");
    }

    setError("");
    setSuccess("");
    setMembersError("");

    try {
      await addProjectMember(selectedProject._id, email);

      const data = await getProjectMembers(selectedProject._id);

      setMembers(data.members || []);
      setSuccess("Member added successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to add member. Please try again.";

      setError(message);
      setMembersError(message);

      throw new Error(message);
    }
  };

  const handleRemoveMember = async (member) => {
    if (!selectedProject) {
      throw new Error("Please select a project first.");
    }

    setError("");
    setSuccess("");
    setMembersError("");

    try {
      await removeProjectMember(selectedProject._id, member._id);

      const data = await getProjectMembers(selectedProject._id);

      setMembers(data.members || []);
      setSuccess(`${member.name || "Member"} removed from the project.`);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to remove member. Please try again.";

      setError(message);
      setMembersError(message);

      throw new Error(message);
    }
  };

  const handleUpdateProject = async (projectData) => {
    if (!editingProject) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const data = await updateProject(
        editingProject._id,
        projectData
      );

      setSuccess("Project updated successfully.");
      setEditingProject(null);

      await fetchProjects();

      if (selectedProject?._id === editingProject._id) {
        setSelectedProject({
          ...selectedProject,
          ...projectData,
          ...(data.project || {}),
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update project."
      );
    }
  };

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteProject(project._id);

      setSuccess("Project deleted successfully.");

      if (selectedProject?._id === project._id) {
        setSelectedProject(null);
        setTasks([]);
        setMembers([]);
      }

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  const handleCreateTask = async (taskData) => {
    if (!selectedProject) {
      setError("Please select a project first.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await createTask({
        ...taskData,
        project: selectedProject._id,
      });

      setIsCreateTaskOpen(false);

      const data = await getTasks(selectedProject._id);

      setTasks(data.tasks || []);
      setSuccess("Task created successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask || !selectedProject) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await updateTask(editingTask._id, taskData);

      setEditingTask(null);

      const data = await getTasks(selectedProject._id);

      setTasks(data.tasks || []);
      setSuccess("Task updated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task."
      );
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (!selectedProject) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await updateTask(task._id, {
        status: newStatus,
      });

      const data = await getTasks(selectedProject._id);

      setTasks(data.tasks || []);
      setSuccess("Task status updated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task status."
      );
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    if (!selectedProject) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteTask(task._id);

      const data = await getTasks(selectedProject._id);

      setTasks(data.tasks || []);
      setSuccess("Task deleted successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
    }
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const canManageMembers = Boolean(
    currentUserId &&
      selectedProject &&
      getId(selectedProject.owner).toString() ===
        currentUserId.toString()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar
          projectCount={projects.length}
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Dashboard Header */}
            <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative px-5 py-6 sm:px-7 sm:py-7">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-50 blur-2xl" />
                <div className="absolute bottom-0 right-24 h-20 w-20 rounded-full bg-blue-50 blur-2xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Project workspace
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                      Dashboard
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                      Manage projects, organize tasks, collaborate with
                      your team, and keep track of progress from one place.
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-indigo-600 shadow-sm">
                      {projects.length}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Projects
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {projects.length === 1
                          ? "Active workspace"
                          : "Your workspaces"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Feedback */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 shadow-sm">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-red-800">
                    Something went wrong
                  </p>

                  <p className="mt-0.5 text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 shadow-sm">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                  ✓
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-800">
                    Success
                  </p>

                  <p className="mt-0.5 text-sm text-emerald-700">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {/* Statistics */}
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total projects
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {projects.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600 transition group-hover:bg-indigo-100">
                    ▦
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-400">
                  Workspaces you can access
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total tasks
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {totalTasks}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600 transition group-hover:bg-blue-100">
                    ✓
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-400">
                  Tasks in selected project
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      In progress
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {inProgressTasks}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600 transition group-hover:bg-amber-100">
                    ◐
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-400">
                  Tasks currently being worked on
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Completion
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {progress}%
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600 transition group-hover:bg-emerald-100">
                    ↗
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-400">
                  Completion of selected project
                </p>
              </div>
            </section>

            {/* Create Project */}
            <section className="mb-8 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-white shadow-sm">
              <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-semibold text-indigo-600 shadow-sm">
                    +
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Create a new project
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Start a workspace and bring your team together.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setIsCreateProjectOpen(true);
                  }}
                  className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 md:w-auto"
                >
                  New project
                </button>
              </div>
            </section>

            {/* Projects */}
            <section id="projects-section" className="mb-8 scroll-mt-24">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Your projects
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {projects.length}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a project to manage its tasks and team.
                  </p>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-500">
                    ▦
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-800">
                    No projects yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Create your first project to start organizing work,
                    assigning tasks, and collaborating with your team.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setIsCreateProjectOpen(true);
                    }}
                    className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      isSelected={
                        selectedProject?._id === project._id
                      }
                      onSelect={handleSelectProject}
                      onEdit={setEditingProject}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Selected Project Workspace */}
            {selectedProject && (
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* Workspace Header */}
                <div className="border-b border-slate-100 bg-gradient-to-r from-white via-white to-indigo-50/40 px-5 py-6 sm:px-7 sm:py-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {selectedProject.status || "ACTIVE"}
                        </span>

                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          Selected workspace
                        </span>
                      </div>

                      <h2 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {selectedProject.name}
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {selectedProject.description ||
                          "Manage this project's tasks and team collaboration."}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Task completion
                      </p>

                      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        {progress}%
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {completedTasks} of {totalTasks} completed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 p-5 sm:p-7">
                  {/* Progress */}
                  <section>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Project progress
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Monitor task completion for this project.
                        </p>
                      </div>

                      <span className="text-lg font-bold text-indigo-600">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-lg font-bold text-slate-800">
                          {todoTasks}
                        </p>

                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                          To do
                        </p>
                      </div>

                      <div className="rounded-xl bg-amber-50 px-3 py-3 text-center">
                        <p className="text-lg font-bold text-amber-700">
                          {inProgressTasks}
                        </p>

                        <p className="mt-0.5 text-xs font-medium text-amber-600">
                          In progress
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center">
                        <p className="text-lg font-bold text-emerald-700">
                          {completedTasks}
                        </p>

                        <p className="mt-0.5 text-xs font-medium text-emerald-600">
                          Completed
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Team Members */}
                  <section
                    id="project-members"
                    className="scroll-mt-24"
                  >
                    <MembersPanel
                      members={members}
                      onAddMember={handleAddMember}
                      onRemoveMember={handleRemoveMember}
                      loading={membersLoading}
                      error={membersError}
                      canManageMembers={canManageMembers}
                    />
                  </section>

                  {/* Tasks */}
                  <section
                    id="project-tasks"
                    className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <div className="border-b border-slate-100 bg-slate-50/50 p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              Project tasks
                            </h3>

                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              {totalTasks}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            Track, assign, and update work for this project.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setSuccess("");
                            setIsCreateTaskOpen(true);
                          }}
                          className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 sm:w-auto"
                        >
                          New task
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      {tasks.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl text-slate-400 shadow-sm">
                            ✓
                          </div>

                          <h4 className="mt-4 font-bold text-slate-800">
                            No tasks yet
                          </h4>

                          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-5 text-slate-500">
                            Create a task to start tracking work for this
                            project.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setError("");
                              setSuccess("");
                              setIsCreateTaskOpen(true);
                            }}
                            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                          >
                            Create task
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {tasks.map((task) => (
                            <TaskCard
                              key={task._id}
                              task={task}
                              onEdit={setEditingTask}
                              onDelete={handleDeleteTask}
                              onStatusChange={handleStatusChange}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSave={handleCreateProject}
      />

      <EditProjectModal
        project={editingProject}
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onSave={handleUpdateProject}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSave={handleCreateTask}
        members={members}
      />

      <EditTaskModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
        members={members}
      />
    </div>
  );
}

export default Dashboard;