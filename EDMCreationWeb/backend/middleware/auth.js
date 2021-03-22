const JSRSASign = require("jsrsasign");
require('dotenv').config();

function auth(req, res, next){
    const token = req.header('x-auth-token');  //FOR WHEN I CAN FIGURE OUT HOW TO SWAGGER A HEADER

    if(!token){//no token provided
        return res.status(401).json({ msg: 'No Auth token provided, access denied'});
    }

    if(JSRSASign.jws.JWS.verifyJWT(token, process.env.JWT_KEY, {alg: ["HS512"]})){//valid token provided

        const jWS = token;
        const jWT = jWS.split(".");
        const uHeader = JSRSASign.b64utos(jWT[0]);//untrusted
        const uClaim = JSRSASign.b64utos(jWT[1]);
        const pHeader = JSRSASign.jws.JWS.readSafeJSONString(uHeader);//parsed
        const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);

        const day = new Date();
        const time = day.getTime();//check expiration

        if(time>pClaim.Expires){//reject from expiration
            return res.status(401).json({ msg: 'Expired token provided, access denied'});
        }

        req.body.uName = pClaim.Username;
        req.body.ID = pClaim.ID;//Passing token User Id 
        
        next();


    }else{//invalid token provided
        return res.status(401).json({ msg: 'Invalid token provided, access denied'});
    }



}


module.exports = auth;