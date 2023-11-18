const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Wallet = new Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'CustomerDetails',
        required : true
    },
    balance : {
        type : Number,
        default : 0
    },
    history :{
      type : Array,
      default : 'No transations'
    }
},
{
timestamps : true
})
module.exports = mongoose.model('Wallet',Wallet)