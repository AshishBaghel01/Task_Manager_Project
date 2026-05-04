import express from "express";
import { listProjects, createProject, getProjectById, updateMemberProgress } from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", listProjects);
router.post("/", authorize("admin"), createProject);
router.get("/:id", getProjectById);
router.patch("/:id/members/:memberId/progress", authorize("member"), updateMemberProgress);

export default router;
