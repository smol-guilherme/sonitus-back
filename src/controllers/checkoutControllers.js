import { ObjectId } from "mongodb";
import db from "../database/database.js";
import sgMail from '@sendgrid/mail';

const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;
const PURCHASES_COLLECTION = process.env.MONGO_PURCHASES_COLLECTION;
const API_KEY = process.env.SENDGRID_API_TOKEN;

sgMail.setApiKey(API_KEY);

export async function checkoutHandlers(req, res, next) {
  const data = res.locals.cleanData;
  const cart = [...data.data];
  const id = res.locals.id;
  delete data.data;
  // const response = await checkStock(cart);
  // if (response[0] === null) {
  //   res.status(400).send(response[1]);
  //   return;
  // }
  
  console.log(cart)
   await updateStock(cart);
   await updateHistory(cart, id);
  const msg = {
    to: data.email,
  from: 'sonitusstore@gmail.com', // Use the email address or domain you verified above
  subject: 'Purchase info',
  text: `Thank you for buying with us `,
  html: '<strong>See you next time!</strong>',
  }
  console.log(msg)
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error)
    if(error.response){
      console.error(error.response.body)
      return res.sendStatus(500)
    }
  }
  res.status(200).send("Successful");
  return;
}

async function checkStock(cartData) {
 
  const ids = [];
  cartData.map((item) => ids.push(ObjectId(item._id)));

  try {
    const response = await db
      .collection(PRODUCTS_COLLECTION)
      .find(
        //{ album: { $in: ids } },
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
  console.log(ids);
  const response = []
  try {
    for(let i = 0; i < cart.length; i++) {
      console.log(ids[i], '\n', -cart[i].quantity);
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

async function updateHistory (cart, id){
  const albumsId =[];
  let total = 0;
  try {
    cart.map((item) => {
      albumsId.push(ObjectId(item._id));
      total += item.price;
    });
    
    const purchaseObject={
      userId: ObjectId(id),
      albums: albumsId,
      value: total
    }

    await db
      .collection(PURCHASES_COLLECTION)
      .insertOne(purchaseObject)
    
    return 
  } catch (error) {
    return err;
  }
  
}