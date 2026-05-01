const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "task-manager-secret");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    next();
  };
}

module.exports = { protect, authorize };
