const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");

const isProjectOwner = (project, userId) => {
  return project.owner.toString() === userId.toString();
};

const isProjectMember = (project, userId) => {
  return project.members.some(
    (memberId) => memberId.toString() === userId.toString()
  );
};

const createProject = async (req, res) => {
  try {
    const { name, description, startDate, dueDate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required.",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      owner: req.user.userId,
      members: [req.user.userId],
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.status(201).json({
      message: "Project created successfully.",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      message: "Failed to create project.",
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

    return res.json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      message: "Failed to load projects.",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    if (!isProjectOwner(project, req.user.userId)) {
      return res.status(403).json({
        message: "Only the project owner can update this project.",
      });
    }

    const {
      name,
      description,
      status,
      startDate,
      dueDate,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Project name cannot be empty.",
        });
      }

      project.name = name.trim();
    }

    if (description !== undefined) {
      project.description = description.trim();
    }

    if (status !== undefined) {
      project.status = status;
    }

    if (startDate !== undefined) {
      project.startDate = startDate || undefined;
    }

    if (dueDate !== undefined) {
      project.dueDate = dueDate || undefined;
    }

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.json({
      message: "Project updated successfully.",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      message: "Failed to update project.",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    if (!isProjectOwner(project, req.user.userId)) {
      return res.status(403).json({
        message: "Only the project owner can delete this project.",
      });
    }

    await Task.deleteMany({
      project: project._id,
    });

    await project.deleteOne();

    return res.json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      message: "Failed to delete project.",
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Member email is required.",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    if (!isProjectOwner(project, req.user.userId)) {
      return res.status(403).json({
        message: "Only the project owner can manage members.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No registered user found with that email.",
      });
    }

    if (
      project.members.some((memberId) =>
        memberId.equals(user._id)
      )
    ) {
      return res.status(400).json({
        message: "User is already a member of this project.",
      });
    }

    project.members.push(user._id);

    await project.save();

    return res.status(201).json({
      message: "Member added successfully.",
      member: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Add member error:", error);

    return res.status(500).json({
      message: "Failed to add member.",
    });
  }
};

const getProjectMembers = async (req, res) => {
  try {
    /*
     * Important:
     * Check membership before populating the members field.
     * The membership check expects ObjectIds.
     */
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    if (!isProjectMember(project, req.user.userId)) {
      return res.status(403).json({
        message: "You are not a member of this project.",
      });
    }

    /*
     * Populate only after authorization succeeds.
     */
    await project.populate("owner", "name email");
    await project.populate("members", "name email");

    const ownerId = project.owner._id.toString();

    const members = project.members.map((member) => ({
      _id: member._id,
      name: member.name,
      email: member.email,
      isOwner: member._id.toString() === ownerId,
    }));

    return res.json({
      members,
    });
  } catch (error) {
    console.error("Get project members error:", error);

    return res.status(500).json({
      message: "Failed to load project members.",
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const {
      id: projectId,
      userId,
    } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    if (!isProjectOwner(project, req.user.userId)) {
      return res.status(403).json({
        message: "Only the project owner can remove members.",
      });
    }

    if (project.owner.toString() === userId) {
      return res.status(400).json({
        message:
          "The project owner cannot be removed from the project.",
      });
    }

    const isMember = project.members.some(
      (memberId) => memberId.toString() === userId
    );

    if (!isMember) {
      return res.status(404).json({
        message: "User is not a member of this project.",
      });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId
    );

    await project.save();

    await Task.updateMany(
      {
        project: project._id,
        assignedTo: userId,
      },
      {
        $set: {
          assignedTo: null,
        },
      }
    );

    return res.json({
      message: "Member removed from the project successfully.",
    });
  } catch (error) {
    console.error("Remove member error:", error);

    return res.status(500).json({
      message: "Failed to remove member.",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addMember,
  getProjectMembers,
  removeMember,
};