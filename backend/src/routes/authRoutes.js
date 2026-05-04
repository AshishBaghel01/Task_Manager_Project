import express from "express";
import { getBootstrap, setupAdmin, registerMember, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/bootstrap", getBootstrap);
router.post("/setup-admin", setupAdmin);
router.post("/register", registerMember);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
