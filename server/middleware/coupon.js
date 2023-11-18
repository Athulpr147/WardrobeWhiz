const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const couponToCart = asyncHandler(async(req,res,next)=>{
    try{
        const coupon = req.cookies.couponToken
        jwt.verify(coupon, "123",(error,decoded)=>{
            if(decoded){
                res.coupon = decoded
                next()
            }else{
                next()
            }
        })
    }catch(er){
console.log(er)
    }
})

module.exports = couponToCart