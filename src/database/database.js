import { MongoClient } from "mongodb";
import 'dotenv/config'

const URI = process.env.MONGO_URI

const client = new MongoClient(URI);
let db;

try {
    db = await client.connect();
} catch (err) {
    console.log(err);
    return;
}

export default db;