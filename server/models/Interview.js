const mongoose=require("mongoose");
const User=require("./User");
const Schema=mongoose.Schema;

const interviewSchema=new Schema({
    application:{
        type:Schema.Types.ObjectId,
        ref:"Application",
        required:true
    },

    interviewer:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    scheduledAt:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["scheduled","ongoing","completed","cancelled"],
        default:"scheduled"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Interview",interviewSchema);
