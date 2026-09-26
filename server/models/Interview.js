const mongoose=require("mongoose");
const User=require("./User");
const Schema=mongoose.Schema;

const interviewSchema=new Schema({
    interviewer:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    candidateName:{
        type:String,
        required:true
    },
    candidateEmail:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    status:{
       type: String,
       default:"Scheduled"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Interview",interviewSchema);
