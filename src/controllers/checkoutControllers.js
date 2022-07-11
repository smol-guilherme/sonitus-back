import { ObjectId } from "mongodb";
import db from "../database/database.js";

const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;
const ACCOUNTS_COLLECTION = process.env.MONGO_ACCOUNTS_COLLECTION;
const SESSIONS_COLLECTION = process.env.MONGO_SESSIONS_COLLECTION;

export async function checkoutHandlers(req, res, next) {
  const data = res.locals.cleanData;
  const cart = [...data.data];
  const headers = res.locals.headers;
  delete data.data;
  const response = await checkStock(cart);
  if (response[0] === null) {
    res.status(400).send(response[1]);
    return;
  }
  await updateStock(cart);
  res.status(200).send();
  return;
}

async function checkStock(cartData) {
  const ids = [];
  cartData.map((item) => ids.push(ObjectId(item._id)));
  try {
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .find(
        { _id: { $in: ids } },
        { stock: { $gte: "$cartData.$.quantity" } }
      )
      .toArray();
    if (response.length < cartData.length) {
      // console.log(cartData.filter((item) => !response.includes(item.album) ? `${item.album}\n` : null));
      const outOfStockMessage = `The following items are out of stock:\n ${cartData.filter(
        (item) => (!response.includes(item.album) ? `${item.album}\n` : null)
      )}`;
      return [null, outOfStockMessage];
    }
    return response;
  } catch (err) {
    return err;
  }
}

async function updateStock(cart) {
  const ids = [];
  cart.map((item) => ids.push(item.album));
  const response = []
  try {
    for(let i = 0; i < cart.length; i++) {
      response.push(await db
        .collection(PRODUCTS_COLLECTION)
        .updateOne(
          { album: ids[i] },
          { $inc: { stock: -cart[i].quantity } }
        ))
    }
    return response;
  } catch (err) {
    return err;
  }
}
