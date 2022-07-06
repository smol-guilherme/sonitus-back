import { MongoClient } from "mongodb";
import "dotenv/config";

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB_NAME

const client = new MongoClient(URI);
let db;

try {
  await client.connect();
  db = client.db(DB_NAME);
} catch (err) {
  console.log(err);
}

export default db;
