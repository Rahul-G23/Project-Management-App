import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Project Management App.</p>

      <h2>Create Project</h2>

      <form onSubmit={handleCreateProject}>
        <div>
          <label>Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
            placeholder="Enter project description"
          />
        </div>

        <button type="submit">Create Project</button>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div>
          {projects.map((project) => (
           <div key={project._id}>
  <h3>{project.name}</h3>
  <p>{project.description}</p>
  <p>Status: {project.status}</p>

  <button
    onClick={async () => {
      const newName = window.prompt(
        "Enter new project name:",
        project.name
      );

      if (!newName) return;

      try {
        await updateProject(project._id, {
          name: newName,
        });

        setSuccess("Project updated successfully.");
        setError("");
        await fetchProjects();
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to update project."
        );
      }
    }}
  >
    Edit
  </button>

  <button
    onClick={async () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${project.name}"?`
      );

      if (!confirmed) return;

      try {
        await deleteProject(project._id);

        setSuccess("Project deleted successfully.");
        setError("");
        await fetchProjects();
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to delete project."
        );
      }
    }}
  >
    Delete
  </button>
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;