import { useEffect, useState } from "react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
} from "../services/projectService";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [memberEmail, setMemberEmail] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState("");

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      await createProject({
        name: projectName,
        description: projectDescription,
      });

      setProjectName("");
      setProjectDescription("");

      setSuccess("Project created successfully.");

      await fetchProjects();
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

    try {
      const [taskData, memberData] = await Promise.all([
        getTasks(project._id),
        getProjectMembers(project._id),
      ]);

      setSelectedProject(project);
      setTasks(taskData.tasks);
      setMembers(memberData.members);
      setTaskAssignedTo("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load project details. Please try again."
      );
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedProject) {
      setError("Please select a project first.");
      return;
    }

    try {
      await addProjectMember(
        selectedProject._id,
        memberEmail
      );

      setMemberEmail("");

      setSuccess("Member added successfully.");

      const data = await getProjectMembers(
        selectedProject._id
      );

      setMembers(data.members);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add member. Please try again."
      );
    }
  };

  const handleUpdateProject = async (project) => {
    const newName = window.prompt(
      "Enter new project name:",
      project.name
    );

    if (!newName) {
      return;
    }

    try {
      await updateProject(project._id, {
        name: newName,
      });

      setSuccess("Project updated successfully.");
      setError("");

      await fetchProjects();

      if (selectedProject?._id === project._id) {
        setSelectedProject({
          ...project,
          name: newName,
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

    try {
      await deleteProject(project._id);

      setSuccess("Project deleted successfully.");
      setError("");

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

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedProject) {
      setError("Please select a project first.");
      return;
    }

    try {
      await createTask({
        title: taskTitle,
        description: taskDescription,
        project: selectedProject._id,
        priority: taskPriority,
        dueDate: taskDueDate || undefined,
        assignedTo: taskAssignedTo || null,
      });

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("MEDIUM");
      setTaskDueDate("");
      setTaskAssignedTo("");

      setSuccess("Task created successfully.");

      const data = await getTasks(selectedProject._id);
      setTasks(data.tasks);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    }
  };

  const handleUpdateTask = async (task) => {
    const newTitle = window.prompt(
      "Enter new task title:",
      task.title
    );

    if (!newTitle) {
      return;
    }

    try {
      await updateTask(task._id, {
        title: newTitle,
      });

      setSuccess("Task updated successfully.");
      setError("");

      const data = await getTasks(selectedProject._id);
      setTasks(data.tasks);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task."
      );
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    setError("");
    setSuccess("");

    try {
      await updateTask(task._id, {
        status: newStatus,
      });

      const data = await getTasks(selectedProject._id);
      setTasks(data.tasks);

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

    try {
      await deleteTask(task._id);

      setError("");

      const data = await getTasks(selectedProject._id);
      setTasks(data.tasks);

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

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome to the Project Management App.</p>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <h2>Create Project</h2>

      <form onSubmit={handleCreateProject}>
        <div>
          <label>Project Name</label>

          <input
            type="text"
            value={projectName}
            onChange={(event) =>
              setProjectName(event.target.value)
            }
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={projectDescription}
            onChange={(event) =>
              setProjectDescription(event.target.value)
            }
            placeholder="Enter project description"
          />
        </div>

        <button type="submit">
          Create Project
        </button>
      </form>

      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project._id}>
              <h3>{project.name}</h3>

              <p>{project.description}</p>

              <p>
                Status: {project.status}
              </p>

              <button
                onClick={() =>
                  handleSelectProject(project)
                }
              >
                View Tasks
              </button>

              <button
                onClick={() =>
                  handleUpdateProject(project)
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDeleteProject(project)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <div>
          <h2>
            Tasks for {selectedProject.name}
          </h2>

          <h3>Project Progress</h3>

          <p>
            {completedTasks} of {totalTasks} tasks
            completed
          </p>

          <p>
            <strong>{progress}%</strong>
          </p>

          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "20px",
              backgroundColor: "#e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#22c55e",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <h3>Project Members</h3>

          {members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            <div>
              {members.map((member) => (
                <div key={member._id}>
                  <p>
                    <strong>{member.name}</strong>
                    <br />
                    {member.email}
                  </p>
                </div>
              ))}
            </div>
          )}

          <h3>Add Member</h3>

          <form onSubmit={handleAddMember}>
            <div>
              <label>Member Email</label>

              <input
                type="email"
                value={memberEmail}
                onChange={(event) =>
                  setMemberEmail(event.target.value)
                }
                placeholder="Enter member email"
                required
              />
            </div>

            <button type="submit">
              Add Member
            </button>
          </form>

          <h3>Create Task</h3>

          <form onSubmit={handleCreateTask}>
            <div>
              <label>Task Title</label>

              <input
                type="text"
                value={taskTitle}
                onChange={(event) =>
                  setTaskTitle(event.target.value)
                }
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label>Description</label>

              <textarea
                value={taskDescription}
                onChange={(event) =>
                  setTaskDescription(event.target.value)
                }
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label>Priority</label>

              <select
                value={taskPriority}
                onChange={(event) =>
                  setTaskPriority(event.target.value)
                }
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>
              </select>
            </div>

            <div>
              <label>Due Date</label>

              <input
                type="date"
                value={taskDueDate}
                onChange={(event) =>
                  setTaskDueDate(event.target.value)
                }
              />
            </div>

            <div>
              <label>Assign To</label>

              <select
                value={taskAssignedTo}
                onChange={(event) =>
                  setTaskAssignedTo(event.target.value)
                }
              >
                <option value="">
                  Unassigned
                </option>

                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">
              Create Task
            </button>
          </form>

          <h3>Tasks</h3>

          {tasks.length === 0 ? (
            <p>
              No tasks found for this project.
            </p>
          ) : (
            <div>
              {tasks.map((task) => (
                <div key={task._id}>
                  <h3>{task.title}</h3>

                  <p>{task.description}</p>

                  <div>
                    <label>Status: </label>

                    <select
                      value={task.status}
                      onChange={(event) =>
                        handleStatusChange(
                          task,
                          event.target.value
                        )
                      }
                    >
                      <option value="TODO">
                        TODO
                      </option>

                      <option value="IN_PROGRESS">
                        IN PROGRESS
                      </option>

                      <option value="COMPLETED">
                        COMPLETED
                      </option>
                    </select>
                  </div>

                  <p>
                    Priority: {task.priority}
                  </p>

                  {task.dueDate && (
                    <p>
                      Due Date:{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </p>
                  )}

                  {task.assignedTo ? (
                    <p>
                      Assigned to:{" "}
                      {task.assignedTo.name}
                    </p>
                  ) : (
                    <p>
                      Assigned to: Unassigned
                    </p>
                  )}

                  <button
                    onClick={() =>
                      handleUpdateTask(task)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTask(task)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;