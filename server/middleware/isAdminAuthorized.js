//To check admin is logined if not then redirect to login page
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const isAdminLogined = asyncHandler(async(req,res,next)=>{
     const adminToken = req.cookies.adminToken
     jwt.verify(adminToken,"adminToken123",(error,decoded)=>{
        if(error){
            console.log("Admin is not authorized")
            res.status(500).redirect('/admin/login')
        }else{
            res.adminData = decoded
            next()
        }
     })
})
module.exports  = isAdminLogined