const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { name, description, startDate, dueDate } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user.userId,
      members: [req.user.userId],
      startDate,
      dueDate,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error.message);

    res.status(500).json({
      message: "Server error while creating project",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.userId,
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error.message);

    res.status(500).json({
      message: "Server error while fetching projects",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, status, startDate, dueDate } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you are not the owner",
      });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error.message);

    res.status(500).json({
      message: "Server error while updating project",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you are not the owner",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error.message);

    res.status(500).json({
      message: "Server error while deleting project",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};