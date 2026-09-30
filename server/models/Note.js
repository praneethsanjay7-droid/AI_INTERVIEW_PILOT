const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const noteSchema=new Schema({
    interview:{
        type:Schema.Types.ObjectId,
        ref:"Interview",
        required:true
    },
    interviewer:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Note",noteSchema);