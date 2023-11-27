const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const isUserAuthroized = asyncHandler(async (req,res,next)=>{
    let token = req.cookies.token
    jwt.verify(token,process.env.TokenPasskey,(error,decoded)=>{
        if(error){
            console.log("User is not Authroized")
            res.status(401).redirect('/login?notLogined')
        }else{
            console.log("User is Authroized")
            res.userData = decoded
            next()
        }
    })
})
module.exports = isUserAuthroized