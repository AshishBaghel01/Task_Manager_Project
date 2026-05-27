import bcrypt from "bcrypt";
import User from "../models/User.js";

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

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    const isCurrentPassword = await bcrypt.compare(password, existingAdmin.password);
    let shouldSave = false;

    if (!existingAdmin.name) {
      existingAdmin.name = getAdminName(email);
      shouldSave = true;
    }
    if (!isCurrentPassword) {
      existingAdmin.password = await bcrypt.hash(password, 10);
      shouldSave = true;
    }
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      shouldSave = true;
    }
    if (shouldSave) await existingAdmin.save();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name: getAdminName(email),
    email,
    password: hashedPassword,
    role: "admin",
  });
}

export default ensureEnvAdmin;
