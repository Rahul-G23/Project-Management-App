const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate,
    } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Task title and project are required",
      });
    }

    const projectExists = await Project.findOne({
      _id: project,
      members: req.user.userId,
    });

    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found or you are not a member",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error.message);

    res.status(500).json({
      message: "Server error while creating task",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const projectExists = await Project.findOne({
      _id: projectId,
      members: req.user.userId,
    });

    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found or you are not a member",
      });
    }

    const tasks = await Task.find({
      project: projectId,
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    res.status(500).json({
      message: "Server error while fetching tasks",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      dueDate,
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const projectExists = await Project.findOne({
      _id: task.project,
      members: req.user.userId,
    });

    if (!projectExists) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    res.status(500).json({
      message: "Server error while updating task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const projectExists = await Project.findOne({
      _id: task.project,
      members: req.user.userId,
    });

    if (!projectExists) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    res.status(500).json({
      message: "Server error while deleting task",
    });
  }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,

};