const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wishlist = new Schema({
    userId :{
       type : String,
       required : true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products' // references the 'Products' collection
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
module.exports = mongoose.model('Wishlist',wishlist)
