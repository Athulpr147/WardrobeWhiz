const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderId : {
        type : String,
        required : true
    },
  userId: {
    type: mongoose.Types.ObjectId,
    ref:'CustomerDetails'
  },
  paymentId: { 
    type: String,
    required: true, 
  },
  orderAddress: {
    type: mongoose.Types.ObjectId,
    ref:'Address'
  },
  refund:{
    type : Boolean,
    default : false
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  products:[{
    productId:{
       type:mongoose.Types.ObjectId,
       ref:'Products' },
       size : {
        type : String,
        required : false ,
        default : 'Free size'
       },quantity:{
        type : Number,
        required : false
       }
 }],
  coupon: {
    type: String,
    required: false,
    default : "Not used"
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status : {
    type : String ,
    default : 'Pending'
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  totalDiscount: {
    type: Number,
    required: true,
  },
  couponDiscount: {
    type: Number,
    required: false,
  },
  return :{
    type :Boolean,
    required  : false,
    default : false
  },
  refunded : {
    type : Boolean,
    required : false, 
    default : false
  },
  offerDiscount: {
    type: Number,
    required: false,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  completed :{
    type : Boolean,
    default : false
  },
  deliveredDate :{
    type : String,
    required : false
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Order", OrderSchema )
