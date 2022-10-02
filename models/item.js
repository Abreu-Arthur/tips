const mongoose=require('mongoose')
const item=new  mongoose.Schema({   
    username:{type:String,required:true},
    item:{type:String,required:true},
    imp:{type:Number,required:true},
    date:{type:Date,default:Date.now()},
    dia:{type:Number,required:true},
    hora:{type:String},
    id:{type:String,required:true}
})
mongoose.model('itens',item)