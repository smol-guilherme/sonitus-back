import db from "../database/database.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCOUNTS_COLLECTION = process.env.MONGO_ACCOUNTS_COLLECTION
const SECRET = process.env.ACCESS_TOKEN_SECRET
export const signUp = async (req,res) => {

    const user = res.locals.cleanData;
    
    try {
        const alreadyExist = await db.collection(ACCOUNTS_COLLECTION).findOne({email: user.email})
        

        if(alreadyExist){
            return res.sendStatus(401);
        }

        delete user.repeat_password;
        const hashPassword = bcrypt.hashSync(user.password, 10);
        
        await (await db).collection(ACCOUNTS_COLLECTION).insertOne({...user, password: hashPassword})

        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }

}

export const signIn = async (req,res) => {
    
    const login = res.locals.cleanData;
        const user = await db.collection(ACCOUNTS_COLLECTION).findOne({email: login.email});
    try{
        if(user && bcrypt.compareSync(login.password, user.password)){
            const token = jwt.sign({id: user._id}, SECRET, {expiresIn: "76h"});
            console.log(token)
            return res.json({token, name: user.name}).status(200);
        }else{
            return res.sendStatus(401);
        }
    }catch{
        return res.sendStatus(500);
    }
}