import db from "../database/database.js";

const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION

export async function findDuplicate(req, res, next) {
  const itemData = req.body
  try {
    const response = await db.collection(PRODUCTS_COLLECTION).findOne({ album: itemData.album })
    if(response === null) {
      next();
      return;
    }
    res.status(409).send("Esse album já existe no banco de dados.");
    return;
  } catch(err) {
    res.send(err);
    return;
  }
}