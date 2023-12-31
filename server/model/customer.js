const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const customer = new Schema({
    name :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    phone : {
        type : Number,
        required : true
    },
    blocked : {
        type : Boolean,
        default : false
    },
    password : {
        type : String,
        required : true
    } 
    
},{
timestamps : true
})
module.exports = mongoose.model('CustomerDetails',customer)
