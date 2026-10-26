const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

const RegisterSchema = z.object({
  username: z.string().min(2).max(48),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128)
});

router.post("/register", async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  const { username, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, passwordHash });

  const token = signToken(
    { sub: String(user._id), username: user.username, email: user.email },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || "7d"
  );

  res.json({ token, user: { id: String(user._id), username: user.username, email: user.email } });
});

router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(
    { sub: String(user._id), username: user.username, email: user.email },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || "7d"
  );

  res.json({ token, user: { id: String(user._id), username: user.username, email: user.email } });
});

router.get("/me", authRequired, async (req, res) => {
  res.json({ user: { id: req.user.sub, username: req.user.username, email: req.user.email } });
});

module.exports = router;

