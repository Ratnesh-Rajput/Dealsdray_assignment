const { verifyToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        const tokenCookie= req.cookies[cookieName];
        if(!tokenCookie){
            return next();
        }
        try {
            const userPayload= verifyToken(tokenCookie);
            req.user=userPayload;
            return next();
        } catch (error) {
            
            return next();
        }

    };
}
module.exports={checkForAuthenticationCookie,};