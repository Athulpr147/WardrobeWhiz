const mongoose = require('mongoose')
const Schema = mongoose.Schema
const address = new Schema({
    userId : {
        type : String,
        required : true
    },
    name: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pincode: {
        type: Number
    },
    phone: {
        type: String
    },
    address : {
        type : String,
        required : true
    }
  
},
{
    timestamps : true
    }
    )
module.exports = mongoose.model('Address',address)