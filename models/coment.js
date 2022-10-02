const mongoose=require('mongoose')
const coment=new mongoose.Schema({
    id:{type:String,required:true},
    coment:{type:String,required:true}
})
mongoose.model('coments',coment)