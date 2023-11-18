const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const userInformation = asyncHandler (async(req,res,next)=>{
    let token = req.cookies.token
    jwt.verify(token ,process.env.TokenPasskey,(error,decoded)=>{
             if(error){
                next()
             }else{
                res.userData = decoded
                next()
             }
    })
})
module.exports = userInformation