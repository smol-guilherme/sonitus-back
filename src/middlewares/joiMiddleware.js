import { signInSchema, signUpSchema } from "../database/models/joiSchemas.js";

export function userValidation (req, res, next){

    const data = res.locals.cleanData

    if(data.name){
        const validation = signUpSchema.validate(data, {abortEarly : true});
        if(validation.error){return res.sendStatus(422)};
    }
    else{
        const validation = signInSchema.validate(data, {abortEarly : true});
        if(validation.error){return res.sendStatus(422)};
    }

    next();
}