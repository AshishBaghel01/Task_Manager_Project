const express = require("express");
const { listMembers, createMember } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/members", listMembers);
router.post("/members", createMember);

module.exports = router;
