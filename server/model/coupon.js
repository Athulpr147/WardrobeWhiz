const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({

  coupon :{
    type : String,
    required : true
  },
  discount : {
    type : String ,
    required : true
  },
  expireDate: {
    type: Date,
    required: false, 
  },
  minPurchase : {
    type : String,
    required : true
  }
})

module.exports = mongoose.model('Coupons', couponSchema)


