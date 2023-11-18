const mongoose = require('mongoose')
const Schema = mongoose.Schema

const product = new Schema({
    name : {
        type : String,
        
    },
    brand :{
        type : String,
        required : true
    },
    category : {
        type :String,
        required : true
    },
    sub_category : {
        type :String,
        required : true 
    },
    price : {
        type : Number,
        required : true
    },
    discount :{
        type : Number,
        required : true
    },
    discountPrice :{
        type : Number,
        required : true
    },
    image: {
        type: Array,
        required : false,
        
    },
    size: {
        type: Array,
        required : true
    },
    decription : {
        type :String,
        required : true
    },
    
    colors : {
        type :Array,
        required : true
    },
   
    coupons : {
        type : Number,
        required : false
    },
    stocks : {
        type : Number
    },
    blocked : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
    })

   

module.exports = mongoose.model('Products',product)