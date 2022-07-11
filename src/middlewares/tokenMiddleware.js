import jwt  from "jsonwebtoken";
const SECRET = process.env.ACCESS_TOKEN_SECRET

export function authenticateToken (req, res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return res.sendStatus(401);
    jwt.verify(token, SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.locals.user = user
        next()
    })

}