const jwt=require("jsonwebtoken");

const protect=(req,res,next)=>{
    try{
        const token=req.cookies.token;

        if(!token){
            return res.redirect("/");

        }

        const decoded=jwt.verify(
            token,
            "interviewpilot_secret"
        );

        req.user=decoded;
        next();
    }catch(error){
        return res.redirect("/");
    }
}

module.exports=protect;
