import bcrypt from "bcrypt";
import User from "../models/User.js";

async function listMembers(_req, res) {
  const members = await User.find({ role: "member" }).select("-password").sort({ createdAt: -1 });
  res.json({ success: true, data: { members } });
}

async function createMember(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }

  const existingUser = await User.exists({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ success: false, message: "Email is already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const member = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "member",
  });

  res.status(201).json({
    success: true,
    message: "Member account created.",
    data: {
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    },
  });
}

export { listMembers, createMember };
