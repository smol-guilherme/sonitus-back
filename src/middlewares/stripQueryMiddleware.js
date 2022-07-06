import { stripHtml } from "string-strip-html";

export const clearData = ( req, res, next) => {
    const data = req.query.id;
    const output = { id: data };
    
    for(let param in data) {
        if(typeof output[param] === 'string'){
        output[param] = (stripHtml(data[param]).result).trim();
        }
    }
    
    res.locals.cleanData = output.id
    res.locals.headers = req.headers
    next();
}