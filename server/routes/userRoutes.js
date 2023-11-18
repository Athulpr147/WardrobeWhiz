const express = require('express')
const app = express()
const router = express.Router()
const controller = require('../controller/userController')
const isUserAuthroized = require('../middleware/isUserAuthorized')
const isUserLogged = require('../middleware/isUserLogged')
const userInformation = require('../middleware/userInfromation')
const forgotPassPageAuth = require('../middleware/forgotPassPageAuth') 
const couponToCart = require('../middleware/coupon')



 



//Home #Public
router.get('/',userInformation,controller.home)

//Login #Public
router.get('/login',isUserLogged,controller.login_page) 
router.post('/login',isUserLogged,controller.login)
//Forgot Password---->
//First Page Enter number or email
router.get('/forgot_password_',controller.forgot_password)
//Checking user and sending password
router.post('/send_otp',controller.send_otp) 
//Enter OTP POST Method
router.post('/enter_otp',controller.enter_otp)
//Change Password PAge
router.get('/change_password',controller.change_password_page) 
//Changing password PUT Method
router.put('/change_password',controller.change_password)
//Cancel delete OTP   DELETE method
router.delete('/cancel_otp',controller.cancel_otp)
//Register #Public
router.get('/register',isUserLogged,controller.register_page)
router.post('/register',isUserLogged,controller.register)
//Verify Email in registration
router.post('/verify_email',controller.verify_email)
//Resend otp in register
router.get('/resendOTP_register',controller.resendOTP_register)
//Logout
router.post('/logout',controller.logout) 


//User Profile
router.get('/profile',isUserAuthroized,controller.profile)
//User Edit
router.put('/profile_edit/:id',isUserAuthroized,controller.profile_edit)
//Add address 
router.post('/add_address',isUserAuthroized, controller.add_address)
//Add address from checkpot
router.post('/add_address_from_checkout',isUserAuthroized,controller.add_address_from_checkout)
//Delete Address
router.get('/deleteAddress/:id',isUserAuthroized, controller.deleteAddress)
//edit Address
router.put('/editAddress/:id',isUserAuthroized,controller.editAddress) 
router.get('/cancelorder/:id',isUserAuthroized,controller.cancelOrder)
router.get('/returnorder/:id',isUserAuthroized,controller.returnorder)

//View products > Public
router.get('/product/:id',controller.view_product)

//Cart Page 
router.get('/cart',couponToCart,isUserAuthroized,controller.view_cart)

//Add to cart==>POST
router.post('/addcart/:id/:from',isUserAuthroized,controller.add_toCart)

//Cart Product increment & Decrement
router.get('/addOneMore/:id',isUserAuthroized,controller.addOne)
router.get('/removeOne/:id',isUserAuthroized,controller.removeOne)
//Apply coupon==<
router.post('/coupon/:id',isUserAuthroized,controller.apply_coupon)
router.get('/removeCoupon',isUserAuthroized,couponToCart, controller.removeCoupon)
// Remove Products from Cart
router.get('/removeCart/:id',isUserAuthroized,controller.remove_cart)


//  Wishlist ==>(POST)
router.get('/wishlist/:id',isUserAuthroized,controller.add_wishlist)
router.post('/add_to_wishlist/:id',isUserAuthroized,controller.add_to_wishlist)
//Remove from wishlist
router.get('/removeWishlist/:id',isUserAuthroized,controller.remove_wishlist)

//All Catagories
router.get('/getProducts',controller.all_products)
//Filter
router.post('/filter',controller.fetch_products)

router.get('/checkout/:id',isUserAuthroized,couponToCart,controller.checkout)
router.get('/checkout',isUserAuthroized,couponToCart,controller.checkout)

router.post('/checkoutViaRazorpay',isUserAuthroized, controller.razorpay)
router.post('/addMoneyViaRazorpay',isUserAuthroized, controller.razorpay_to_wallet)
router.post('/debitWallet',isUserAuthroized,controller.debitWallet)

router.get('/resendOTP',controller.resendOTP)

router.post('/addMoneyInWallet',isUserAuthroized,controller.addMoneyInWallet)

router.post('/addOrder',isUserAuthroized,couponToCart,controller.addOrder)
//For testing purpose 
//Search GET Method ----->
router.get('/search',controller.search_page)
//SEarch POST Method----->  
router.post('/search',controller.search) 

// router.get('/qwer',isUserAuthroized,controller.hey)
router.get('/lookup',controller.lookup)

module.exports = router 