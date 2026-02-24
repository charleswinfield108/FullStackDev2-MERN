import {MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.ATLAS_URI || "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

export async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB");
    
    db = client.db("employees");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

export default db;
    
