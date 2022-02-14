const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'customer'
    }

},{timestamps:true});
const Userdata=new mongoose.model('Userdata',userschema);
module.exports=Userdata;