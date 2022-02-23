const mongoose = require('mongoose');
const order = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userdata',
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    phone:{type:String,required:true},
    address:{type:String,required:true},
    paymentType:{type:String,default:'COD'},
    status:{type:String,default:'order_placed'}

},{timestamps:true});
const Oders = new mongoose.model('Order', order);
module.exports = Oders;