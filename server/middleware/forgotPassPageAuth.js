const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const forgotPassPageAuth = asyncHandler(async (req, res, next) => {

    const OTPtoken = req.cookies.otpToken
    console.log(OTPtoken)
    jwt.verify(OTPtoken, process.env.OTP_Token_pass, (error, decoded) => {
        if (error) {
            console.log("User is not Authroized to change password")
            res.status(401).redirect('/login')
        } else {
            console.log("User is Authroized to change password")
            res.UserData = decoded
            next()
        }
    })

})
module.exports = forgotPassPageAuth
