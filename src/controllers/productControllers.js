import db from "../database/database.js";
import { ObjectId } from "mongodb";
import { getGenresSample, getHomeData } from "../handlers/productHandler.js";

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
  let response;
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

      case params.genre === "All":
        response = await getGenresSample();
        return res.status(200).send(response);
        
      case params.genre !== undefined:
        StageOne = { $match: { genre: params.genre } };
        StageTwo = [{ $sample: { size: 20 } }];
        break;

      case params.home !== undefined:
        response = await getHomeData()
        return res.status(200).send(response);

      default:
        StageOne = { $match: {} };
        StageTwo = [{ $sample: { size: 10 } }];
        break;
        
    }
     response = await db
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

