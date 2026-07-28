import "dotenv/config";
import { MongoClient } from "mongodb";
import { distance } from "@turf/turf"

const connectionURI = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

if (!connectionURI) {
  throw new Error("Missing MONGO_URI in environment variables");
}

if (!dbName) {
  throw new Error("Missing MONGO_DB in environment variables");
}

const client = new MongoClient(connectionURI);

await client.connect();
console.log("Connected to MongoDB");

const db = client.db(dbName);
const buildings = db.collection("property_buildings");

const count = await buildings.countDocuments();
console.log("Buildings count:", count);

function calculateHaversineDistance(coordA, coordB){

}


async function getBuildingsMissingDistrictId(){

  const result = await buildings.find({
  $or: [
    { districtId: { $exists: false } },
    { districtId: null },
    { districtId: "" },
  ],   
  "location.geolocation.latitude": { $type: "number" },
  "location.geolocation.longitude": { $type: "number" }
}).toArray();

return result;
}

async function getDistrictReferenceBuildings(){
  //implement later
  const result = await buildings.find({
  districtId: { $exists: true, $nin: [null, ""] },
  "location.geolocation.latitude": { $type: "number" },
  "location.geolocation.longitude": { $type: "number" }
  }).toArray();
  return result;
}

function getMajorityDistrictVote(){
  //implement later
}

function inferDistrictIdForBuilding(){
  //implement later
}

const buildingsWithMissingDistrictId = await getBuildingsMissingDistrictId();
const districtReferenceBuildings = await getDistrictReferenceBuildings();


console.log(buildingsWithMissingDistrictId.length)
console.log(districtReferenceBuildings.length)

await client.close();