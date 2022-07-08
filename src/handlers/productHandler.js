import db from "../database/database.js";
const PRODUCTS_COLLECTION = process.env.MONGO_PRODUCTS_COLLECTION;

export async function getGenresSample (){
    let StageOne;
    let StageTwo;
   
    StageOne = { $match: {} };
    StageTwo = [{ $group: { _id: "$genre" } }, { $sort: { _id: 1 } }];
    const response = await db
    .collection(PRODUCTS_COLLECTION)
    .aggregate([StageOne, ...StageTwo])
    .toArray();
  
    const final = []
  
    for(let i = 0; i < response.length; i ++){
      
      StageOne = { $match: { genre: response[i]._id } };
      StageTwo = [{ $sample: { size: 4 } }];
      const setup= await db
      .collection(PRODUCTS_COLLECTION)
      .aggregate([StageOne, ...StageTwo])
      .toArray();
      const obj = {title: response[i]._id, arr: setup};
      final.push(obj)
    } 
    
    return final;
  }

  export async function getHomeData (){
    const bestSellers = await db
        .collection(PRODUCTS_COLLECTION)
        .find()
        .sort({stock: -1})
        .limit(7)
        .toArray();
        
    const worstSellers = await db
        .collection(PRODUCTS_COLLECTION)
        .find()
        .sort({stock: +1})
        .limit(7)
        .toArray();
    
    const response = {best: bestSellers, discover: worstSellers};
    return response;
  }