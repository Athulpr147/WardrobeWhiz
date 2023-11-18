const mongoose = require('mongoose')
const Schema = mongoose.Schema

const catagories = new Schema({
    name: {
        type : String, 
        required : true 
        },
        description:{
        type:String
         },
        isListed:{
            type: Boolean,
            default : true
        }

})
module.exports = mongoose.model('Catagories',catagories)