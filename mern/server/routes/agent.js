import express from "express";
import Agent from "../models/Agent.js";

const router = express.Router();

// Get all agents
router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching agents");
  }
});

// Get single agent by ID
router.get("/:id", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).send("Agent not found");
    }
    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching agent");
  }
});

// Create new agent
router.post("/", async (req, res) => {
  const { name, region, rating, fees, sales } = req.body;

  // Validate required fields
  if (!name || !region || rating === undefined || fees === undefined || sales === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    const agent = new Agent({ name, region, rating, fees, sales });
    const result = await agent.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating agent");
  }
});

// Update agent
router.patch("/:id", async (req, res) => {
  const { name, region, rating, fees, sales } = req.body;

  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { name, region, rating, fees, sales },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).send("Agent not found");
    }

    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating agent");
  }
});

// Delete agent
router.delete("/:id", async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) {
      return res.status(404).send("Agent not found");
    }

    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting agent");
  }
});

export default router;
