const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const jobSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["open","closed"],
        default:"open"
    },
    createdAt:{
        type:Date,
        deafult:Date.now
    }
});

module.exports=mongoose.model("Jobs",jobSchema);