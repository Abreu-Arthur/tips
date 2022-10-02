const mongoose=require('mongoose')
const playlist=new mongoose.Schema({
    nome:{type:String,required:true},
    desc:{type:String},
    usercreator:{type:String,required:true}
})
mongoose.model('playlists',playlist)