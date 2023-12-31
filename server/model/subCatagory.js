const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subCatagorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    listed: {
        type: Boolean,
        default: true,
    },
    count : {
        type  :Number,
        default : 0
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('subCatagory', subCatagorySchema)