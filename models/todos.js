const mongoose=require('mongoose')
const todo=new mongoose.Schema({
    username:{type:String,required:true},
    todo:{type:String,required:true},
    imp:{type:Number,required:true},
    date:{type:Date,default:Date.now()},
    dia:{type:Number,required:true},
    hora:{type:String}
})
mongoose.model('todos',todo)