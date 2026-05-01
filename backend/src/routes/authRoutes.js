const express = require("express");
const {
  getBootstrap,
  setupAdmin,
  registerMember,
  login,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/bootstrap", getBootstrap);
router.post("/setup-admin", setupAdmin);
router.post("/register", registerMember);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
