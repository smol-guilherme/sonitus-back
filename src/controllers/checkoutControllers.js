import { ObjectId } from "mongodb";
import db from "../database/database.js";
import sgMail from "@sendgrid/mail";

const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;
const PURCHASES_COLLECTION = process.env.MONGO_PURCHASES_COLLECTION;
const API_KEY = process.env.SENDGRID_API_TOKEN;

sgMail.setApiKey(API_KEY);

export async function checkoutHandlers(req, res) {
  const data = res.locals.cleanData;
  const cart = [...data.data];
  const userId = res.locals.user.id;
  const address = data.address;
  delete data.data;

   const response = await checkStock(cart);
   if (response[0] === null) {
     res.status(400).send(response[1]);
     return;
   }

    await updateStock(cart);
    await updateHistory(cart, userId, address);
    const msg = {
      to: data.email,
      from: "sonitusstore@gmail.com",
      subject: "Purchase info",
      text: `Thank you for buying with us `,
      html: "<strong>See you next time!</strong>",
    };
    try {
      await sgMail.send(msg);
    }  catch (error) {
      console.error(error);
      if (error.response) {
       console.error(error.response.body);
       return res.sendStatus(500);
     }
   }
  const purchase = "Successful";
  return res.send(purchase).status(201);
  
}

async function checkStock(cartData) {
  const ids = [];
  const albums = [];
  cartData.map((item) =>
    !ids.includes(item.id) ? ids.push(ObjectId(item.id)) : null
  );
  cartData.map((item) =>
    !ids.includes(item.album) ? albums.push(item.album) : null
  );
  try {
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .find({ _id: { $in: ids } }, { stock: { $gte: "$cartData.$.quantity" } })
      .toArray();
    const stockIndex = [];
    response.map((stock, index) =>
      albums.includes(stock.album) ? null : stockIndex.push(index)
    );
    if (cartData.length !== response.length) {
      let response = "";
      cartData.map((item, index) =>
        stockIndex.includes(index)
          ? (response += item.album + "\n" + item.artist + "\n")
          : null
      );
      const outOfStockMessage = `The following items are out of stock:\n ${response}`;
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
  const response = [];
  try {
    for (let i = 0; i < cart.length; i++) {
      response.push(
        await db
          .collection(PRODUCTS_COLLECTION)
          .updateOne({ album: ids[i] }, { $inc: { stock: -cart[i].quantity } })
      );
    }
    return response;
  } catch (err) {
    return err;
  }
}

async function updateHistory(cart, userId, address) {
  const albumsId = [];
  let total = 0;
  try {
    cart.map((item) => {
      albumsId.push(item);
      total += (item.price * item.quantity);
      
    });
   
    const purchaseObject = {
      addres: address,
      userId: userId,
      albums: albumsId,
      value: total,
      date: cart[0].date
    };
    await db.collection(PURCHASES_COLLECTION).insertOne(purchaseObject);
    return;
  } catch (error) {
    return err;
  }
}
