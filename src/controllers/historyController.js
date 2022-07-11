import db from "../database/database.js";


const PURCHASES_COLLECTION=process.env.MONGO_PURCHASES_COLLECTION
const CARTS_COLLECTION=process.env.MONGO_CARTS_COLLECTION

export async function searchHistory (req, res){
    const id = res.locals.id;

    const data = await db
        .collection(PURCHASES_COLLECTION)
        .find({id})
        .toArray()

    return res.send(data).status(200);
}

