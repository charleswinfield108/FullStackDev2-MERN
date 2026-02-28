// Import necessary modules
import express from "express";
import cors from "cors"; // Enable Cross-Origin Resource Sharing
import path from "path"; // Handle file paths
import { fileURLToPath } from "url"; // Get current file path in ES modules
import { connectDB } from "./db/connection.js"; // Database connection
import auth from "./routes/auth.js"; // Authentication routes
import agent from "./routes/agent.js"; // Agent CRUD routes

// Set the port from environment variable or default to 5050
const PORT = process.env.PORT || 5050;
const app = express(); // Initialize Express application

// Get the directory path of the current file (needed for ES modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define paths for public assets and admin (React) frontend
const publicPath = path.join(__dirname, "public"); // Static assets served at root
const adminPath = path.join(__dirname, "..", "client", "dist"); // React admin app compiled in dist

// Middleware setup
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies

// Mount API routes
app.use("/auth", auth); // Authentication endpoints: POST /auth/login
app.use("/agent", agent); // Agent CRUD endpoints: GET/POST /agent, PATCH/DELETE /agent/:id
    
// Serve static files
app.use("/", express.static(publicPath)); // Serve public assets (HTML, CSS, JS) at root
app.use("/admin", express.static(adminPath)); // Serve React admin app at /admin path

// Redirect root to index.html
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// SPA fallback: All /admin routes serve index.html (React handles routing)
// This allows React Router to handle client-side routing
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// Start the Express server
// This function connects to the database and starts listening for requests
async function startServer() {
  try {
    await connectDB(); // Connect to MongoDB database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit if startup fails
  }
}

startServer();

