import db from "../database/database.js";

const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;

export async function querySearch(req, res) {
  const dataQuery = res.locals.cleanData
  try {
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .find({ $text: { $search: dataQuery } } )
      .toArray();
      res.status(200).send(response);
      return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}