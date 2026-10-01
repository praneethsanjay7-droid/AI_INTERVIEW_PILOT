const jwt=require("jsonwebtoken");
const User=require("../models/User");

const protect=async(req,res,next)=>{
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

        if (!decoded.role || !decoded.name) {
            try {
                const dbUser = await User.findById(decoded.userId).select("name role email");
                if (dbUser) {
                    req.user.role = dbUser.role;
                    req.user.name = dbUser.name;
                }
            } catch (dbErr) {
                console.error("Failed to fetch user role:", dbErr);
            }
        }

        res.locals.user = req.user;
        next();
    }catch(error){
        return res.redirect("/");
    }
}

module.exports=protect;
