const express = require("express");
const {
  listProjects,
  createProject,
  getProjectById,
  updateMemberProgress,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", listProjects);
router.post("/", authorize("admin"), createProject);
router.get("/:id", getProjectById);
router.patch("/:id/members/:memberId/progress", authorize("member"), updateMemberProgress);

module.exports = router;
