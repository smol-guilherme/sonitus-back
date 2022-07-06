import db from "../database/database.js";
const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;

export async function addItem(req, res) {
  const data = req.body;
  try {
    const response = await db.collection(PRODUCTS_COLLECTION).insertOne({ ...data });
    res.status(201).send("Produto criado.");
    return;
  } catch (err) {
    res.send(err);
    return err;
  }
}
