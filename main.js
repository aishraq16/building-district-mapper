//imports 
import "dotenv/config";
import { MongoClient } from "mongodb";
import { distance } from "@turf/turf";

//get the connection string and db name from the env file
const connectionURI = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

//error handling for missing connection string / db name variables
if (!connectionURI) {
  throw new Error("Missing MONGO_URI in environment variables");
}

if (!dbName) {
  throw new Error("Missing MONGO_DB in environment variables");
}

//connect to mongodb
const client = new MongoClient(connectionURI);

await client.connect();
console.log("Connected to MongoDB");

const db = client.db(dbName);
const buildings = db.collection("property_buildings");
/*
const count = await buildings.countDocuments();
console.log("Buildings count:", count);
*/

//helper functions for this task

function getCoordinates(building){
  return { 
    latitude : building.location.geolocation.latitude,
    longitude : building.location.geolocation.longitude
   }
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
  const result = await buildings.find({
  districtId: { $exists: true, $nin: [null, ""] },
  "location.geolocation.latitude": { $type: "number" },
  "location.geolocation.longitude": { $type: "number" }
  }).toArray();
  return result;
}

/*function getBuildingCoordinates(building) {
  return [
    building.location.geolocation.longitude,
    building.location.geolocation.latitude,
  ];
}*/

function findNearestBuildings(building, maxDistanceAllowed, buildingsToCheck){
  const { latitude: lat1, longitude: lng1 } = getCoordinates(building);
  let result = []
  districtReferenceBuildings.forEach(refBuilding => {
    const { latitude: lat2, longitude: lng2 } = getCoordinates(refBuilding);
    const dist = distance([lng1, lat1], [lng2, lat2], { units: "meters" })
    if (dist <= maxDistanceAllowed) {
      result.push({
      distance : dist,
      districtId : refBuilding.districtId
      });
    }
  });
  result.sort((a, b) => a.distance - b.distance);
  return result.slice(0, buildingsToCheck);
}

function getMajorityDistrictVote(){
  //implement later
}

function inferDistrictIdForBuilding(){
  //implement later
}

const buildingsWithMissingDistrictId = await getBuildingsMissingDistrictId();
const districtReferenceBuildings = await getDistrictReferenceBuildings();


const maxDistanceAllowed = 1000; 
const buildingsToCheck = 7;

/*
buildingsWithMissingDistrictId.forEach(building => {
  const nearestBuildings = findNearestBuildings(building, maxDistanceAllowed, buildingsToCheck)
  nearestBuildings.forEach(refBuilding => {

  });
  //console.log(`Nearest building is ${distance}`)
});


/*
console.log(buildingsWithMissingDistrictId.length)
console.log(districtReferenceBuildings.length)
*/

/*
const distanceInMeters = distance(
  getBuildingCoordinates(buildingsWithMissingDistrictId[0]),
  getBuildingCoordinates(districtReferenceBuildings[0]),
  { units: "meters" }
);

console.log(distanceInMeters)
*/
console.log(findNearestBuildings(buildingsWithMissingDistrictId[0], 1000, 7));
await client.close();