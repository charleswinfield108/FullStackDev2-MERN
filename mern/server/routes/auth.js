/**
 * Authentication Routes - Handles user login and JWT token generation
 * 
 * Provides POST /auth/login endpoint for user authentication.
 * Validates credentials against User database and returns JWT token
 * if credentials are valid.
 */

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /auth/login
 * 
 * Authenticates user with email and password credentials.
 * On successful authentication, returns JWT token and user information.
 * Token expires in 8 hours and is used for session validation.
 * 
 * Request body:
 *   - email {string}: User's email address
 *   - password {string}: User's password (plain text)
 * 
 * Response (200):
 *   {
 *     token: "JWT token",
 *     user_id: "MongoDB user ID",
 *     first_name: "User's first name",
 *     last_name: "User's last name",
 *     email: "User's email"
 *   }
 * 
 * Error responses:
 *   - 400: Missing email or password
 *   - 401: Invalid credentials (user not found or password mismatch)
 *   - 500: Server error or JWT secret not configured
 */
router.post("/login", async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body || {};
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Get JWT secret from environment variables
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).send("JWT secret is not configured");
  }

  try {
    // Find user in database by email
    const user = await User.findOne({ email });
    
    // Validate credentials (user exists and password matches)
    if (!user || user.password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    // Create JWT token with user ID and email, expires in 8 hours
    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      secret,
      { expiresIn: "8h" }
    );

    // Return token and user information to frontend
    return res.status(200).send({
      token,
      user_id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Login failed");
  }
});

export default router;
