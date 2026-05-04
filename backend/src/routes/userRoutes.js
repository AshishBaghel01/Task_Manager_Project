import express from "express";
import { listMembers, createMember } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/members", listMembers);
router.post("/members", createMember);

export default router;
