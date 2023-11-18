 
//to prevent if admin is already logined then dont render admin login page
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const isAdminLogged = asyncHandler(async(req,res,next)=>{
    const adminToken = req.cookies.adminToken
    jwt.verify(adminToken,"adminToken123",(error,decoded)=>{
        if(decoded){
            res.redirect('/admin/')
            res.adminData = decoded
        }else{
            next()
        }
    })
})
module.exports = isAdminLogged