const express = require("express");

const {
  createProject,
  getProjects,
    updateProject,
  deleteProject,
  addMember,
  getProjectMembers,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.post("/:id/members", protect, addMember);
router.get("/:id/members", protect, getProjectMembers);
module.exports = router;