const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cart = new Schema({
    userId :{
       type : String,
       required : true
    },
    productId: {    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    quantity: {
        type: Number,
        require : true
    },
    size: {
        type: String,
        require : true
    },
    color: {
        type: String,
        require : true
    },
    coupon : {
        type  : String,
        required : false
    }

})
module.exports = mongoose.model('Cart',cart)