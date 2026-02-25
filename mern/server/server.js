import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connection.js";
import auth from "./routes/auth.js";
import agent from "./routes/agent.js";

const PORT = process.env.PORT || 5050;
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "public");
const adminPath = path.join(__dirname, "..", "client", "dist");

app.use(cors());
app.use(express.json());
app.use("/auth", auth);
app.use("/agent", agent);    
app.use("/", express.static(publicPath));
app.use("/admin", express.static(adminPath));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

//Start the Express server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

