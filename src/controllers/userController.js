import db from "../database/database.js";

import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const ACCOUNTS_COLLECTION = process.env.MONGO_ACCOUNTS_COLLECTION
const SESSIONS_COLLECTION = process.env.MONGO_SESSIONS_COLLECTION

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

        if(user && bcrypt.compareSync(login.password, user.password)){

            const session = await db.collection(ACCOUNTS_COLLECTION).findOne({userId: user._id});
            
            if(session){
        
                return res.send({token: session.token , name: user.name}).status(200);
            }
            const token = uuid();
            const data ={
                token: token,
                userId: user._id,
                name: user.name,
            }
            await db.collection(SESSIONS_COLLECTION).insertOne(data);
            return res.send({token: token, name: user.name}).status(201);
            
        }else{
            return res.sendStatus(401);
        }

    
}