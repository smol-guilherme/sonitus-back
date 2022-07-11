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

  await updateStock(cart);
  await checkStock(cart);
  await updateHistory(cart, userId);
  const msg = {
    to: data.email,
    from: "sonitusstore@gmail.com", // Use the email address or domain you verified above
    subject: "Purchase info",
    text: `Thank you for buying with us `,
    html: `
    <div></div><strong><h1>Thank you for purchasing from us.</h1></strong>
    <div></div>
    <div></div>
    <div><h3>Your order to the Address:</h3></div>
    <div></div>
    <div><p>${data.address},</p></div>
    <div><h3>Your Order:</h3></div>
    ${cart.map(item => `<div>${item.artist}, ${item.album}: ${item.quantity}</div>`)}
    <div><h3>Is being processed, you will be informed by e-mail for delivery updates.</h3></div>
    <div><h3>Remember, whenever you feel down, you can always listen to some vinyls.</h3></div>
    <div><h3>Thank you for checking out Sonitus Vinyl Store and we hope to see you again soon.</h3></div>
    <div></div>
    <div><h2>Best regards,</h2></div>
    <div><h2><strong>Sonitus Vinyl Store.</strong></h2></div>`,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
      return res.sendStatus(500);
    }
  }
  const purchase = { data: "Successful" };
  res.status(200).send(purchase);
  return;
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
