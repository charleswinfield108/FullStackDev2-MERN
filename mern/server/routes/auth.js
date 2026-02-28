import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).send("JWT secret is not configured");
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      secret,
      { expiresIn: "8h" }
    );

    return res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Login failed");
  }
});

export default router;
