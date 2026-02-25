import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

const uri = process.env.ATLAS_URI || "mongodb://localhost:27017";

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Pinged your deployment. You successfully connected to MongoDB");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

    
