import jwt from "jsonwebtoken";

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || "task-manager-secret",
    {
      expiresIn: "7d",
    }
  );
}

export { signToken };
