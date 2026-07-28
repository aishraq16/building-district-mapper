import "dotenv/config";
import { MongoClient } from "mongodb";

const connectionURI = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

if (!connectionURI) {
  throw new Error("Missing MONGO_URI in environment variables");
}

if (!dbName) {
  throw new Error("Missing MONGO_DB in environment variables");
}

const client = new MongoClient(connectionURI);

try {
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db(dbName);
  const buildings = db.collection("property_buildings");

  const count = await buildings.countDocuments();
  console.log("Buildings count:", count);
} finally {
  await client.close();
}