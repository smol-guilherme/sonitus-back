import { MongoClient } from "mongodb";
import "dotenv/config";

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB_NAME
const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;

const client = new MongoClient(URI);
let db;

try {
  await client.connect();
  db = client.db(DB_NAME);
  db.collection(PRODUCTS_COLLECTION).dropIndexes();
  db.collection(PRODUCTS_COLLECTION).createIndex({
    artist: "text",
    album: "text",
    genre: "text",
    description: "text",
  });
} catch (err) {
  console.log(err);
}

export default db;
