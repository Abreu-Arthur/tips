const mongoose=require('mongoose')
const user=new mongoose.Schema({
    nome:{type:String,required:true},
    username:{type:String,required:true},
    email:{type:String,required:true},
    senha:{type:String,required:true}
})
mongoose.model('users',user)