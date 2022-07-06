import db from "../database/database.js";
import { ObjectId } from "mongodb";

const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;

export async function addItem(req, res) {
  const data = req.body;
  try {
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .insertOne({ ...data });
    res.status(201).send("Produto criado.");
    return;
  } catch (err) {
    res.send(err);
    return;
  }
}

export async function getItems(req, res) {
  let params = req.query;
  let query;
  switch (true) {
    case params.id !== undefined:
      query = { _id: ObjectId(params.id) };
      break;
    case params.genre !== undefined:
      console.log("bzzz");
      query = { genre: params.genre };
      break;
    case params.id === undefined:
    case params.genre === undefined:
      query = {};
      break;
    default:
      query = {};
      break;
  }
  console.log(query);
  try {
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .aggregate([
        { $match: { genre: query.genre } },
        { $group: { _id: "$_id" } },
        { $limit: 1 },
      ])
      .toArray();
    console.log(response);
    res.status(200).send(response);
    return;
  } catch (err) {
    res.send(err);
    return;
  }
}
