const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Banner = new Schema({
    title  :{
        type : String,
        required : true
    },
    image : {
        type : String ,
        required : true
    },
    name : {
        type : String,
        required : true
    }
})
module.exports = mongoose.model("Banner",Banner)