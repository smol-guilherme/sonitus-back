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
  const query = {};
  const querySample = {};
  switch (true) {
    case params.id !== undefined:
      query._id = ObjectId(params.id);
      querySample.size = 1;
      break;
    case params.genre !== undefined:
      query.genre = params.genre;
      querySample.size = 3;
      break;
    default:
      querySample.size = 10;
      break;
  }
  try {
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .aggregate([
        { $match: query },
        { $sample: querySample }
      ])
      .toArray();
    res.status(200).send(response);
    return;
  } catch (err) {
    res.send(err);
    return;
  }
}
