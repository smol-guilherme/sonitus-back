import db from "../database/database.js";
import { ObjectId } from "mongodb";

const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;

export async function addItem(req, res) {
  const data = req.body;
  try {
    await db.collection(PRODUCTS_COLLECTION).insertOne({ ...data });
    res.status(201).send("Produto criado.");
    return;
  } catch (err) {
    res.send(err);
    return;
  }
}

export async function getItems(req, res) {
  let params = req.query;
  let StageOne;
  let StageTwo;
  try {
    switch (true) {
      case params.genre === "Sample":
        StageOne = { $match: {} };
        StageTwo = [{ $group: { _id: "$genre" } }, { $sort: { _id: 1 } }];
        break;
      case params.id !== undefined:
        StageOne = {
          $match: { _id: ObjectId(res.locals.cleanData || params.id) },
        };
        StageTwo = [{ $sample: { size: 1 } }];
        break;
      case params.genre !== undefined:
        StageOne = { $match: { genre: params.genre } };
        StageTwo = [{ $sample: { size: 20 } }];
        break;
      default:
        StageOne = { $match: {} };
        StageTwo = [{ $sample: { size: 10 } }];
        break;
    }
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .aggregate([StageOne, ...StageTwo])
      .toArray();
    res.status(200).send(response);
    return;
  } catch (err) {
    res.send(err);
    return;
  }
}
