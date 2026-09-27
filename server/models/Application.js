const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const User=require("./User");


const applicationSchema=new Schema({
    candidate:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    job:{
        type:Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    resumeUrl:{
        type:String,
        required:true
    },
    resumeText:{
        type:String,
        deafult:""
    },
    status:{
        type:String,
        enum:["applied","shortlisted","rejected","interviewed"],
        deafult:"applied"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Application",applicationSchema);
