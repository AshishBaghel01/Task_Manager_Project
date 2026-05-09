import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function getBootstrap(_req, res) {
  const adminExists = await User.exists({ role: "admin" });
  res.json({ success: true, data: { hasAdmin: Boolean(adminExists) } });
}

async function setupAdmin(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }

  const existingAdmin = await User.exists({ role: "admin" });
  if (existingAdmin) {
    return res.status(409).json({ success: false, message: "Admin account already exists." });
  }

  const existingUser = await User.exists({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ success: false, message: "Email is already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin",
  });

  const token = signToken(user);
  res.status(201).json({ success: true, message: "Admin account created.", data: { token, user: sanitizeUser(user) } });
}

async function registerMember(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }

  const existingUser = await User.exists({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ success: false, message: "Email is already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "member",
  });

  const token = signToken(user);
  res.status(201).json({ success: true, message: "Account created.", data: { token, user: sanitizeUser(user) } });
}

async function login(req, res) {
  const { email, password, role = "member" } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ success: false, message: "Choose a valid account type." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  if (user.role !== role) {
    const accountType = role === "admin" ? "admin" : "member";
    return res.status(403).json({ success: false, message: `This email cannot login as ${accountType}.` });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const token = signToken(user);
  res.json({ success: true, message: "Login successful.", data: { token, user: sanitizeUser(user) } });
}

async function getMe(req, res) {
  res.json({ success: true, data: { user: sanitizeUser(req.user) } });
}

export { getBootstrap, setupAdmin, registerMember, login, getMe };
