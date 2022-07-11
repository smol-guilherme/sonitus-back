import db from "../database/database.js";

const PURCHASES_COLLECTION=process.env.MONGO_PURCHASES_COLLECTION

export async function searchHistory (req, res){
    const id = res.locals.user.id;
    
    const data = await db
        .collection(PURCHASES_COLLECTION)
        .find({userId: id})
        .toArray()

    return res.send(data).status(200);
}

