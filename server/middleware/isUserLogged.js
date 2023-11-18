const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const isUserLogged = asyncHandler(async(req,res,next)=>{
    const token = req.cookies.token
    jwt.verify(token , process.env.TokenPasskey,(error,decoded)=>{
        if(error){
            next()
        }else{
            res.redirect('/')
        }
    })
})
module.exports = isUserLogged