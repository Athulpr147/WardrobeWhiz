const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    phone: {
        type : Number,
        required : false
    },
    email : {
        type : String,
        required : false
        
    },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 120, 
  },
});

module.exports = mongoose.model('OTP', otpSchema);