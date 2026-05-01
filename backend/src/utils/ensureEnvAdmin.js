const bcrypt = require("bcrypt");
const User = require("../models/User");

function getAdminName(email) {
  const localPart = email.split("@")[0] || "Admin";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Admin";
}

async function ensureEnvAdmin() {
  const email = process.env.Admin_Email?.toLowerCase().trim();
  const password = process.env.Admin_password;

  if (!email || !password) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.name = existingAdmin.name || getAdminName(email);
    existingAdmin.password = hashedPassword;
    existingAdmin.role = "admin";
    await existingAdmin.save();
    return;
  }

  await User.create({
    name: getAdminName(email),
    email,
    password: hashedPassword,
    role: "admin",
  });
}

module.exports = ensureEnvAdmin;
