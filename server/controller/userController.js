const express = require('express')
const app = express()
const asyncHandler = require('express-async-handler')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const CustomerDetails = require('../model/customer')
const Products = require('../model/products')
const Banner = require('../model/banner')
const Cart = require('../model/cart')
const Coupons =require('../model/coupon')
const Address = require('../model/address')
const Wishlist = require('../model/wishlist')
const Orders = require('../model/orders')
const Wallet = require('../model/wallet')

const bcrypt = require('bcryptjs')
var $ = require( "jquery" )
const jwt = require("jsonwebtoken")
const generateOTP = require('otp-generator')   
const OTP = require('../model/otp')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const fs = require('fs')
const Razorpay = require('razorpay'); 

//Modules
const addToCart = require('../modules/addToCart')
const { LegacyContentInstance } = require('twilio/lib/rest/content/v1/legacyContent')
const p = require('../modules/console')
const { forEach } = require('lodash')


//TWILIO MObile OTP Confi

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken)
const service_SID = process.env.Messaging_Service_SID

//Razor pay

const razorpay = new Razorpay({
  key_id: 'rzp_test_BFC8QSPWgscUUW' ,
  key_secret: 'xDYTK4ow974hXURvAAR5fD0m'
})


//Home Page (1)
exports.home = asyncHandler( async(req,res)=>{
     try {
        const main = await Banner.findOne({name : "main"})
        const mens = await Banner.findOne({name : "mens"})
        const womens = await Banner.findOne({name : "womens"})
        const kids = await Banner.findOne({name : "kids"})
        const banner = { main : main.image , mens : mens.image , womens : womens.image , kids : kids.image}
        console.log(banner.kids)
      //sending products data to Home page
      const products = await Products.find({ blocked: false }).sort({ createdAt: -1 }).limit(9).exec()
      
      // If user logined then the data of user is send by 'userDetails'
      const userData = res.userData      
      if(userData){console.log("hi "+userData.name)
      const userDetails = await CustomerDetails.findOne({_id : userData.id})
       const validate = " "
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('user/index',{userDetails , validate , products ,  banner}) 
      }
      else{
         console.log("Login pls")
         const userDetails = {
            name : "Login"
         }

         const validate = " "
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('user/index',{userDetails , validate , products , banner})
      }
      
   
     } catch (error) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.status(500).redirect('/login')
       console.log("Cant load login pag => Error in controller/->home")
        console.log(error)  
     }
})

//Login Page GET-Method  (2)
exports.login_page = asyncHandler( async(req,res)=>{
   try {
      const main = await Banner.findOne({name : "main"})
      const banner = { main : main.image }
      const validate = " "
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.render('user/login',{validate,banner})
   } catch (error) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      console.log(error) 
   }
})




//Login form POST-Method  (3)
exports.login = asyncHandler(async (req,res)=>{
   try {
      const main = await Banner.findOne({name : "main"})
        const mens = await Banner.findOne({name : "mens"})
        const womens = await Banner.findOne({name : "womens"})
        const kids = await Banner.findOne({name : "kids"})
        const banner = { main : main.image , mens : mens.image , womens : womens.image , kids : kids.image}

      const {email, password} = req.body
   console.log(email)
   //Check user is exist or not
   const user = await CustomerDetails.findOne({ email }) 
   
   if (!user) {
      const validate = "No user found";
      console.log("No user found");
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.status(401).render('user/login', { validate , banner});
      return
    }
    if(user.blocked){
      const validate = "User is blocked";
      console.log("User is blocked");
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.status(401).render('user/login', { validate , banner});
      return
    }

    //Compairing password
    const comparePassword = await bcrypt.compare(password,user.password)
    //Check Password
    if(!comparePassword){
      console.log("pass compare fail")
      const validate = "Login credentials mismatch"
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.status(401).render('user/login',{validate , banner})
      return
   }
   //Create Token
   const userData = {
      id : user._id,
      name : user.name,
      email : user.email
   }
   const token = jwt.sign(userData,process.env.TokenPasskey,{ expiresIn : "500m"})
   res.cookie("token",token,{httpOnly : true})

   console.log("Login Sucess")
  

   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
   // res.render('user/index',{userDetails,validate,banner})
   res.redirect('/')
   } catch (error) {
      res.redirect('/login')
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.send("Login error")
   }
})

// OTP password reset ---------> (4)
//First Page Enter number or Email GET Method
exports.forgot_password = asyncHandler(async (req, res) => {
   try {
      
      const main = await Banner.findOne({name : "main"})
      const banner = { main : main.image }
     const validate = "";
     const otpSended = false; 
 
     res.render('user/forgotPasswordInput', { validate, otpSended ,banner});
   } catch (error) {
     console.log("Can't load Password reset First Page");
     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private') 
     res.status(500).redirect('/');
   }
 })

//Send OTP POST_Method (5)
exports.send_otp = asyncHandler (async(req,res)=>{
   try {
      const {contactMethod , phoneNumber , emailAddress} = req.body
       //If user Enter Email
      if(emailAddress){
        let userInput = emailAddress
        const isUser = await CustomerDetails.findOne({email : userInput})
        //Checking User exist with that email
        if(!isUser){
         console.log("no user found")
         const validate = "Email not registered"
         res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
         const otpSended = false
           const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
         res.status(401).render('user/forgotPasswordInput',{validate , otpSended ,banner})
         return
        }
        //Creating OTP
        const genOTP = generateOTP.generate(4, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets:false ,
           specialChars: false ,
           alphabets: false})
           console.log(`new otp : ${genOTP}`)
        //Insert otp to database
        await OTP.deleteOne({ email : isUser.email })
         const newOTP = new OTP({
            email : isUser.email,
            otp : genOTP
         })
         await OTP.create(newOTP) //Created
         // sending otp via email-------------------------------------/    
          const sendOTP = {                                           
            service : 'gmail',                                        
            auth : {                                                  
               user : process.env.GMAIL,                              
               pass : process.env.GMAIL_APP_PASSWORD                  
            }                                                         
         }                                                            
                                                                      
         const transporter = nodemailer.createTransport(sendOTP)      
                                                                      
         const mailGenerator = new Mailgen({                          
            theme : "default",                                        
            product : {                                               
               name : "Mailgen",                                      
               link : 'http://mailgen.js/'                            
            }                                                         
         })                                                           
                                                                      
         const responds = {                                           
            body : {                                                  
               name :  isUser.name,                                   
               intro : "This is from WardrobeWhiz",                   
               table : {                                              
                  data : [                                            
                     {                                                
                        item : "Request to change password",          
                     description : "OTP to change your Password",     
                     OTP : genOTP                                     
                     }                                                
                  ]                                                   
               },                                                     
               outro : "This OTP will expires in 2min"                
            }                                                         
         }                                                            
                                                                      
         const mail = mailGenerator.generate(responds)                
         const message = {                                            
            from : process.env.GMAIL,                                 
               name : isUser.name,                                    
               to : isUser.email,                                     
               subject : "OTP Verification",                          
               html : mail                                            
         }                                                            
         transporter.sendMail(message)                                
                                                                      
          //---Sending MAil Ended------------------------------------ 
         //-----------------------------------------------------------X
        const otpDetails = {
         senderID : isUser._id,
         otp : genOTP
        }

        const userId_type = { userId : isUser._id, email : true }
        res.cookie('userId_type',userId_type,{httpOnly : true})

        const otpToken = jwt.sign(otpDetails , process.env.OTP_Token_pass,{expiresIn : "2m"})
        res.cookie("otpToken",otpToken,{httpOnly : true})

        const otpSended = true   // if it is true then otp enter modal will triggger
        const validate = ""
        const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.render('user/forgotPasswordInput',{otpSended , validate , banner})
        return
        
      }
      //If user enter mobile
       else if(phoneNumber){
         let userInput = phoneNumber
         const isUser = await CustomerDetails.findOne({phone : userInput})  
         //Checking User exist with that phone number
         if(!isUser){
         console.log("no user found-->") 
         const validate = "Phone number not registered"
         res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
         const otpSended = false
         const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
         es.status(401).render('user/forgotPasswordInput',{otpSended,validate , banner})
         return 
         }
         const userId_type = { userId : isUser._id, email : false }
         res.cookie('userId_type',userId_type,{httpOnly : true})
        

        const countryCode = '+91'
        const sendingNumber = countryCode + isUser.phone        
        const sendOtp = async (sendingNumber) => {
        try {
        await client.verify.v2.services(service_SID).verifications.create({
        to: sendingNumber ,
          channel: `sms`,
         
         })
          console.log("1st OTP send Sucess") 
         } catch (error) {

           console.log(error); 
       
         }

        }
     
          await sendOtp(sendingNumber)
         
        
      //  sendOTP(sendingNumber,genOTP)
       
      
        const otpDetails = {
         senderID : isUser._id,
         sendedNumber : sendingNumber
        }
        
        console.log(isUser._id)
        const otpToken = jwt.sign(otpDetails , process.env.OTP_Token_pass,{expiresIn : "5m"})
      
        res.cookie("otpToken",otpToken,{httpOnly : true})

        const otpSended = true   // if it is true then otp enter modal will triggger
        
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const validate = " "
        const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
        res.render('user/forgotPasswordInput',{otpSended , validate , otpDetails , banner})
       
   }
    
   } catch (error) {
      // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      const validate = " "
      const otpSended = false
      const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
      res.render('user/forgotPasswordInput',{otpSended , validate , banner})
   }
})
//resend OTP
exports.resendOTP = asyncHandler(async(req,res)=>{
   try {
      p('Resend otp')
      const otpCookie = req.cookies.userId_type;
      console.log(otpCookie)
      if(otpCookie.email){
         p('its email')
         const user = await CustomerDetails.findOne({_id : otpCookie.userId})
         const email = user.email
         const genOTP = generateOTP.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets:false ,
             specialChars: false ,
             alphabets: false})
             console.log(`new otp : ${genOTP}`)
          //Insert otp to database
          await OTP.deleteOne({email : email})
           const newOTP = new OTP({
              email : email,
              otp : genOTP
           })
           await OTP.create(newOTP) //Created
           // sending otp via email-------------------------------------/    
            const sendOTP = {                                           
              service : 'gmail',                                        
              auth : {                                                  
                 user : process.env.GMAIL,                              
                 pass : process.env.GMAIL_APP_PASSWORD                  
              }                                                         
           }                                                            
                                                                        
           const transporter = nodemailer.createTransport(sendOTP)      
                                                                        
           const mailGenerator = new Mailgen({                          
              theme : "default",                                        
              product : {                                               
                 name : "Mailgen",                                      
                 link : 'http://mailgen.js/'                            
              }                                                         
           })                                                           
                                                                        
           const responds = {                                           
              body : {                                                  
                 name :  user.name,                                   
                 intro : "This is from WardrobeWhiz",                   
                 table : {                                              
                    data : [                                            
                       {                                                
                          item : "Request to change password",          
                       description : "OTP to change your Password",     
                       OTP : genOTP                                     
                       }                                                
                    ]                                                   
                 },                                                     
                 outro : "This OTP will expires in 2min"                
              }                                                         
           }                                                            
                                                                        
           const mail = mailGenerator.generate(responds)                
           const message = {                                            
              from : process.env.GMAIL,                                 
                 name : user.name,                                    
                 to : user.email,                                     
                 subject : "OTP Verification",                          
                 html : mail                                            
           }                                                            
           transporter.sendMail(message) 

           const otpSended = true   // if it is true then otp enter modal will triggger
        const validate = ""
        const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.render('user/forgotPasswordInput',{otpSended , validate , banner})
        return
      }
      else{
         p('its phone')
         const user = await CustomerDetails.findOne({_id : otpCookie.userId})
         const phone = user.phone
         const countryCode = '+91'
         const sendingNumber = countryCode + phone

         const sendOtp = async (sendingNumber) => {
            try {
            await client.verify.v2.services(service_SID).verifications.create({
            to: sendingNumber ,
              channel: `sms`,
             
             })
              console.log("OTP send Sucess") 
             } catch (error) {
    
               console.log(error); 
           
             }
    
            }
            await sendOtp(sendingNumber)
            const otpDetails = {
               senderID : user._id,
               sendedNumber : sendingNumber
              }
              const otpSended = true   // if it is true then otp enter modal will triggger
   
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const validate = " "
        const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
        res.render('user/forgotPasswordInput',{otpSended , validate , otpDetails , banner})

      }

   } catch (error) {
      
   }
})

//Cancel OTP DELETE Method---->
exports.cancel_otp = asyncHandler(async(req,res)=>{
   try {
      const otpToken = req.cookies.otpToken
      console.log("from cancel : "+otpToken)
      jwt.verify(otpToken , process.env.OTP_Token_pass, async (error,decoded)=>{
         if(error){
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.redirect('/forgot_password_')
         }else{
            console.log("from cancel : "+decoded.senderID)
             const user = await CustomerDetails.findOne({_id : decoded.senderID})
             await OTP.deleteOne({email : user.email})
             res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            
             res.redirect('/login')
         }
      })
      

   } catch (error) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.send("oops error on delete || cancel OTP ")
   }
})


//Modal Enter OTP
exports.enter_otp = asyncHandler (async(req,res)=>{ 
   try {
         const otpInput = req.body.otp
         if(otpInput.length == 6){
      const OTPtoken = req.cookies.otpToken
      jwt.verify(OTPtoken,process.env.OTP_Token_pass,async (error,decoded)=>{
         if(error){
            res.json("i dont know "+error)
         }else{

         const user = decoded
         console.log(user)
         const userId = user.senderID
         const number = user.sendedNumber
         console.log(userId)
         const otp = req.body.otp
         console.log(otp) 
         const verificationCheck = await client.verify.v2.services(service_SID).verificationChecks.create({
                   to: number,
                   code: otp,
                 })

                 if (verificationCheck.status === 'approved') {   
                         console.log('OTP is valid');
                         const userData = {userId : userId}
                         const userIdToken = jwt.sign(userData , "123" , {expiresIn : "2m"})
                         res.cookie("userIdToken",userIdToken,{ httpOnly : true })
                         
                         res.send({
                           sucess : true,
                           redirectTo : '/change_password',
                           message : 'Success! The OTP has been successfully validated'
                        })
                        return

                       } else {
                        res.send({
                           sucess : false,
                           redirectTo : '/login',
                           message : ' OTP is not matching '
                        })
                        return
                        
                       }


         }
      })
   }else if(otpInput.length == 4){
      const OTPtoken = req.cookies.otpToken
      jwt.verify(OTPtoken,process.env.OTP_Token_pass,async (error,decoded)=>{
         if(error){
            res.json("i dont know "+error)
         }else{
            const userId = decoded.senderID
            const otp = req.body.otp
            const user = await CustomerDetails.findOne({_id : userId})
            const otp_ = await OTP.findOne({email : user.email})
            if(otp_.otp == otp ){
               const userData = {userId : userId}
               const userIdToken = jwt.sign(userData , "123" , {expiresIn : "2m"})
               res.cookie("userIdToken",userIdToken,{ httpOnly : true })
               res.send({
                  sucess : true,
                  redirectTo : '/change_password',
                  message : 'Success! The OTP has been successfully validated'
               })
               return
            }else{
               res.send({
                  sucess : false,
                  redirectTo : '/login',
                  message : ' OTP is not matching '
               })
               return
            }
         }
      })

   }
         
         
       } catch (error) {
         console.error("An error occurred:", error);
         res.status(500).send({
            sucess : false,
            redirectTo : '/login',
            message : ' OTP is not matching '
         })
         return
      }
})

//Change password Page GET-Method   (7)
exports.change_password_page = asyncHandler(async(req,res)=>{
try {
   const main = await Banner.findOne({name : "main"})
      const banner = { main : main.image }
      const validate = " "
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.clearCookie('token')
      res.render('user/changePassword',{validate , banner})
   } catch (error) {
      console.log("Cant load Password reset second Page")
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.status(500).redirect('/')
   }
})

//Changing password POST Method (8)
exports.change_password = asyncHandler(async (req,res)=>{
   try {
      const {password1,password2} = req.body
      const OTPtoken = req.cookies.otpToken
      jwt.verify(OTPtoken,process.env.OTP_Token_pass,async (error,decoded)=>{
         if(error){
            res.send("Error ctrl 411"+error)
         }else{
            const user = decoded
            const userId = user.senderID
            const hashedPassword = await bcrypt.hash(password2,10)
            await CustomerDetails.findByIdAndUpdate(userId,{
               password : hashedPassword
             })
             res.clearCookie('otpToken')
             res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
             res.redirect('/login')
        
            }
      })
   
       
   } catch (error) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.write("Password change failed")
   }
})

// Register GET-method  (9)
exports.register_page = asyncHandler(async (req,res)=>{
   try {
      const main = await Banner.findOne({name : "main"})
      const banner = { main : main.image }
      const validate = " "
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
       res.render('user/register',{validate , banner})
   } catch (error) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.send("Not registered")
   }
})

// New Customer Register  POST -Method  (10)
exports.register = asyncHandler( async (req,res)=>{
try {
   const {name,email,phone,password} = req.body
   const isEmailExist = await CustomerDetails.findOne({ email })
   const isPhoneExist = await CustomerDetails.findOne({ phone })
   //Checking Email is already exist
   if(isEmailExist){
      const validate = "Email already registered"
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      return res.status(401).redirect(`/register?e_message=${validate}`)
   }
   //Checking Phone is alredy exist
   if(isPhoneExist){
      const validate = "Mobile number already exists"
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      return res.status(401).redirect(`/register?p_message=${validate}`)
   }
   //Hashing Password
   const hashPassword = await bcrypt.hash(password,10)
    //Creating OTP
    const genOTP = generateOTP.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets:false ,
       specialChars: false ,
       alphabets: false})
       console.log(`new otp : ${genOTP}`)
      const regData = {
      name : name,
      phone : phone,
      email : email,
      password : hashPassword,
      otp : genOTP
   }
   console.log(hashPassword+' <-----------------------')
   // const registerData = jwt.sign(regData, "12345" , {expiresIn : "5m"})
   res.cookie('registerData',regData,{httpOnly : true})
   const ab = req.cookies.registerData
   console.log('------------->'+ab.password)

   // sending otp via email-------------------------------------/    
   const sendOTP = {                                           
      service : 'gmail',                                        
      auth : {                                                  
         user : process.env.GMAIL,                              
         pass : process.env.GMAIL_APP_PASSWORD                  
      }                                                         
   }                                                            
                                                              
   const transporter = nodemailer.createTransport(sendOTP)      
                                                                
   const mailGenerator = new Mailgen({                          
      theme : "default",                                        
      product : {                                               
         name : "Mailgen",                                      
         link : 'http://mailgen.js/'                            
      }                                                         
   })                                                           
                                                              
   const responds = {                                           
      body : {                                                  
         name :  name,                                   
         intro : "This is from WardrobeWhiz",                   
         table : {                                              
            data : [                                            
               {                                                
                  item : "Account verification",           
               description : "OTP",     
               OTP : genOTP                                     
               }                                                
            ]                                                   
         },                                                     
         outro : "This OTP will expires in 5min"                
      }                                                         
   }                                                            
                                                           
   const mail = mailGenerator.generate(responds)                
   const message = {                                            
      from : process.env.GMAIL,                                 
         name : name,                                    
         to : email,                                     
         subject : "OTP Verification",                          
         html : mail                                            
   }                                                            
   transporter.sendMail(message) 
//Sending email otp ended

 res.redirect('/register?otpSended=true')
 
   
} catch (error) {
   console.log(`Can't register ${error}`)
   const message = "Oops something Wrong in Database"
   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
   .redirect('/')
}
})
//Register email verification with otp
exports.verify_email = asyncHandler (async(req,res)=>{
   try { 
      const recOtp = req.body.otp
      const regData = req.cookies.registerData
      
      p('regData : '+regData.name)
      p('regData : '+regData.phone)
      p('regData : '+regData.email)
      p('regData : '+regData.password)
      p('regData : '+regData.otp)
     if(recOtp === regData.otp){
      p("==>"+regData.password)
const newCustomer = new CustomerDetails({
      name : regData.name,
      email : regData.email,
      phone : regData.phone,
      password : regData.password 
   })
   p('iam inside')
   await CustomerDetails.create(newCustomer)
   res.clearCookie('registerData')
   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
   res.send({
      sucess : true ,
      message : 'Registration sucess',
      redirectTo : '/login?registration=true'
   })
   return
     }
     else{
      res.send({
         sucess : false ,
         message : 'Invalid OTP',
         redirectTo : ''
      })
      return
     }

   } catch (error) {
      console.log(error)
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.send({
         sucess : false ,
         message : 'Something went wrong',
         redirectTo : '',
         error : error
      })
   }
})
//Registeraion email verification resend otp
exports.resendOTP_register = asyncHandler(async(req,res)=>{
   try{
      const data = req.cookies.registerData
      p(data.password+" <==data")
      if(!data){
         p('no data')
         res.send({
            sucess : false,
            message : 'Registration failed. Please try again'
         })
         return
      }
      res.clearCookie('registerData')
      const genOTP = generateOTP.generate(4, {
         upperCaseAlphabets: false,
         lowerCaseAlphabets:false ,
          specialChars: false ,
          alphabets: false})
          console.log(`new generated otp : ${genOTP}`)
         const regData = {
         name : data.name,
         phone : data.phone,
         email : data.email,
         password : data.password,
         otp : genOTP
      }
      res.cookie('registerData',regData,{httpOnly : true})
      p("cookie sendd")
      p('email sending start')
      const sendOTP = {                                           
         service : 'gmail',                                        
         auth : {                                                  
            user : process.env.GMAIL,                              
            pass : process.env.GMAIL_APP_PASSWORD                  
         }                                                         
      }                                                            
                                                                 
      const transporter = nodemailer.createTransport(sendOTP)      
                                                                   
      const mailGenerator = new Mailgen({                          
         theme : "default",                                        
         product : {                                               
            name : "Mailgen",                                      
            link : 'http://mailgen.js/'                            
         }                                                         
      })                                                           
                                                                 
      const responds = {                                           
         body : {                                                  
            name :  data.name,                                   
            intro : "This is from WardrobeWhiz",                   
            table : {                                              
               data : [                                            
                  {                                                
                     item : "Account verification",           
                  description : "OTP",     
                  OTP : genOTP                                     
                  }                                                
               ]                                                   
            },                                                     
            outro : "This OTP will expires in 5min"                
         }                                                         
      }                                                            
                                                              
      const mail = mailGenerator.generate(responds)                
      const message = {                                            
         from : process.env.GMAIL,                                 
            name : data.name,                                    
            to : data.email,                                     
            subject : "OTP Verification",                          
            html : mail                                            
      }                                                            
      transporter.sendMail(message) 
      p('mail sended')
      const otpSended = true   // if it is true then otp enter modal will triggger
        const validate = ""
        const main = await Banner.findOne({name : "main"})
           const banner = { main : main.image }
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.redirect('/register?otpSended=true')

   }catch(err){
      console.log(err)
   }
})

//View Cart =====>
exports.view_cart = asyncHandler(async (req,res)=>{
   try {
      const userData = res.userData
      // const selectAddress = await Address.findOne({userId : userData.id })
      userDetails = {name : userData.name , _id : userData.id}
      const address = await Address.findOne({userId : userData.id})
      await Cart.find({userId : userData.id}).populate('productId')
      .then((cart)=>{
         let totalAmount = 0
         let finalPrice = 0 
         let couponDiscount = 0
         let totalNoOfProduct = 0
         cart.forEach(cartItems =>{
               totalAmount += cartItems.productId.price * cartItems.quantity
               finalPrice += cartItems.productId.discountPrice * cartItems.quantity
               totalNoOfProduct += cartItems.quantity
         })
         res.cookie('finalAmount',finalPrice)
         let offerDiscount = totalAmount - finalPrice 
         let couponMsg = ' '
         const coupon = res.coupon        
            if(coupon){  
               p("yes coupon")
               let price = finalPrice
               let calculateDiscount = Math.floor((coupon.discount / 100) * finalPrice)
               finalPrice = finalPrice - calculateDiscount
               couponDiscount = price - finalPrice
               couponMsg = `${coupon.coupon} coupon applied(${coupon.discount}% Off)`
            }
            let totalDiscount = totalAmount - finalPrice
         
         const amount = {
            totalAmount : totalAmount,
            finalPrice : finalPrice,
            totalDiscount : totalDiscount,
            couponDiscount : couponDiscount,
            offerDiscount : offerDiscount
          }

         // res.clearCookie('couponToken')
         
         res.render('user/cart',{ amount , cart , userDetails , couponMsg ,totalNoOfProduct , address }) 
      })
      .catch((err) => {
         console.error(err);
         res.status(500).redirect('/profile') 
       });     
   } catch (error) {
      p(error)
      res.status(500).redirect('/profile')
   }
})
//Apply Copoun=>
exports.apply_coupon = asyncHandler(async (req,res)=>{
   try {
      const userData = res.userData
      const orders = await Orders.find({userId : userData.id})
      
      const couponCode = req.body.coupon
      const coupon = await Coupons.findOne({ coupon : couponCode })
      if(!coupon){
         const copounErr = 'Enter a valid Coupon'
         res.status(500).redirect(`/cart?message=${copounErr}`)
         return
      }
      const currentDate = new Date()
      if(coupon.expireDate <= currentDate){
         p(coupon.expireDate)
         p(currentDate)
         const copounErr = ' Coupon is expired..'
         res.status(500).redirect(`/cart?message=${copounErr}`)
         return
      }
      orders.forEach(element =>{
         if(element.coupon === couponCode){
         const copounErr = 'Coupon already used'
         res.status(500).redirect(`/cart?message=${copounErr}`)
         return
         }
      })
      
      if(coupon.minPurchase > req.cookies.finalAmount ){
         p(true)
         const copounErr = `Min purchace of ₹${coupon.minPurchase} to apply this coupon`
         res.status(500).redirect(`/cart?message=${copounErr}`)
         return
      }
      const minPurchase = coupon.minPurchase
      res.cookie('couponLimit',minPurchase)
      
      const  couponData = {coupon : coupon.coupon , discount : coupon.discount }
      const couponToken = jwt.sign(couponData , "123" , { expiresIn : "60m"} )
      res.cookie("couponToken",couponToken, {httpOnly : true})
      // p(coupon)
      const copounErr = `${coupon.coupon} Coupon applied`
      res.redirect(`/cart?message=${copounErr}`)
   } catch (error) {
      console.log("Coupon error "+error)
      res.redirect('/')
   }
})
//Remove applied coupon on cart
exports.removeCoupon = asyncHandler(async(req,res)=>{
   try{
      res.clearCookie('couponToken')
      res.redirect('/cart')
   }catch(err){
      res.redirect('/cart')
   }
})
//Product Quantity ctrl increment Product
exports.addOne = asyncHandler (async(req,res)=>{
   try {
      let id = req.params.id
      let product = await Cart.findOne({_id : id})
      if(product.quantity > 9){
         res.redirect('/cart')
         return
      } 
      product.quantity = product.quantity + 1
      let quantity = product.quantity
      await Cart.findByIdAndUpdate( id , {
         quantity : quantity
      }) 
      res.redirect('/cart')
   } catch (error) {
      res.redirect('/cart')
      console.error(error)
   }
 })
//Product Quantity ctrl Decrement product
 exports.removeOne = asyncHandler(async(req,res)=>{
   try {
      let id = req.params.id
      let product = await Cart.findOne({_id : id})
      if(product.quantity < 2){
         res.redirect('/cart')
         return
      }
      product.quantity = product.quantity - 1
      let quantity = product.quantity
      await Cart.findByIdAndUpdate(id,{
         quantity : quantity
      })
      
      // if(req.couponToken){
      //    p('coupon true')
      //    p(req.coupon.minPurchase)
      //    p(req.cookies.finalAmount)
      //    const coupon = req.couponToken
      //    if(coupon.minPurchase < req.cookies.finalAmount){
      //       res.clearCookie('couponToken')
      //    }
      // }
      
      // console.log(req.cookies.couponLimit)
      // console.log(req.cookies.finalAmount)
      res.clearCookie('couponToken')
      res.redirect('/cart')
   } catch (error) {
      console.log(error)
   }
 })
 //Remove Product from Cart
 exports.remove_cart = asyncHandler(async(req,res)=>{ 
   try{
      const userData = res.userData
      const productId = req.params.id
      await Cart.findByIdAndDelete(productId)
      
      res.redirect('/cart?deleting_Sucess')
   }catch(err){
      res.redirect('/cart')
   }
 })

//Remove from wishlist
 exports.remove_wishlist = asyncHandler(async(req,res)=>{
   try{
      const id = req.params.id
      await Wishlist.findByIdAndDelete(id)
      res.redirect('/profile?wishlist=true') 
   }catch(err){
      const error = "Some thing not OK"
            res.redirect(`/profile`)

   }
 })
 
 //Add to wishlist from cart
 exports.add_wishlist = asyncHandler(async(req,res)=>{
   try{
         const cartData = req.params.id
         const cartItem = await Cart.findById(cartData)
         const wishlist = await Wishlist.find({productId : cartItem.productId})
         p(wishlist)
         if(wishlist.length !== 0){
            const errr = "Item is already in the wishlist"
            res.redirect(`/cart?message=${errr}`)
            return
         }
         const newWish = new Wishlist({
            userId :cartItem.userId ,
            productId :cartItem.productId ,
            quantity : cartItem.quantity,
            size :cartItem.size ,
            color : cartItem.color

         })
         await newWish.save()
         p("Added to wishlist")
         await Cart.findByIdAndDelete(cartData)
         p("Item removed from cart")
         const Sucess = "Item added to Wishlist"
         res.redirect(`/cart?message=${Sucess}`)
   }catch(err){
      const error = "Some thing not OK"
            res.redirect(`/cart?message=${error}`)

   }
 })
//Add to wishlist 2 from product
exports.add_to_wishlist = asyncHandler (async(req,res)=>{
   try {
      const productId = req.params.id
      const userData = res.userData
      const { size , color , quantity }= req.body
      const isAlready  = await Wishlist.find({productId : productId})
      // if(isAlready){
      //    const message = "Product already in wishlist"
      //    res.redirect(`/product/${productId}?message=${message}`)
      // }
      const newWish = new Wishlist({
         productId,
         size,
         color,
         quantity,
         userId : userData.id
      })
      await newWish.save()
      const message = "Product added to wishlist"
         res.redirect(`/product/${productId}?message=${message}`)
   } catch (error) {
      const message = "Problem"
      const productId = req.params.id
         res.redirect(`/product/${productId}?message=${message}`)
         console.log(error)
   }
})


//User Logout POST-Method   (12)
exports.logout = asyncHandler (async (req,res)=>{
   try {
      res.clearCookie('token')
      res.clearCookie('couponToken')
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.redirect('/')
   } catch (error) {
      console.log(error)
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.status(500).send('Internal server error')
   }
})

//View Products
exports.view_product = asyncHandler (async(req,res)=>{
   try {
      
      const productId = req.params.id
      const product = await Products.findOne({_id : productId})
      const userData = res.userData
        if(userData){          
      const userDetails = {name : userData.name , id : userData.id} 
      res.render('user/productView',{userDetails , product})
        }else{
         const userDetails = {name : "Login"}
         res.render('user/productView',{userDetails , product})
        }
   }
       catch (error) {
      console.log(error)
   }
})

//Add to cart
exports.add_toCart = asyncHandler(async (req,res)=>{
   try {
      const userData = res.userData
      const fromWishlist = req.params.from
      const productId = req.params.id
      const {color , size , quantity } = req.body
      const userId = userData.id
      const message = await addToCart(userId,productId,color,size,quantity)
      let go = "Product added Sucess"
      
      if(fromWishlist){
        
         let msg = "Product added to cart"
         res.redirect(`/cart?message=${msg}`)
         await Wishlist.findOneAndDelete({productId :productId })
         return  
      }
      if(message) go = "Product added to cart"
      res.redirect(`/product/${productId}?message=${go}`)
   } catch (error) {
      console.log(error)
   }
})


 //User Profile GET-Method  (11)
 exports.profile = asyncHandler(async(req,res)=>{
   try {
      // User Details
      const userData = res.userData  
      let userDetails = await CustomerDetails.findOne({_id : userData.id})
      

         // Adress Details 
         const address = await Address.find({userId : userData.id})

         //Wishlist
         const wishlist = await Wishlist.find({userId : userData.id}).populate('productId')


         //Order details 
      const userOrders = await Orders.find({userId : userData.id})
      .populate([
    { path: 'products.productId' },
    { path: 'orderAddress' }
      ])
        .sort({createdAt : -1})
      // Reference for how to get data
      // userOrders.forEach(element =>{                                   
      //    console.log(`ORDER ID  ${element.orderId}`)
      //    console.log(`PAYMENT ID  ${element.paymentId}`)
      //    console.log(`PAYMENT ID  ${element.orderAddress}`)
      //    element.products.forEach(ele =>{
      //       console.log("products  :------->"+ele.productId.image[0])    
      //    })
      // })  //Reference for how to get data  ending---->
       
      //Wallet
      const wallet = await Wallet.findOne({userId : userData.id})
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      console.log(wallet)
      res.render('user/profile',{userDetails , address , wishlist , userOrders , wallet})
   } catch (error) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.send('Profile is not loaded'+error)
   }
})
//Edit User Profile (PUT ==> )
exports.profile_edit = asyncHandler(async(req,res)=>{
   try {
      const userId = req.params.id
      const user = await CustomerDetails.findOne({_id : userId})
      let {name , email , phone } = req.body
      if(!name) name = user.name
      if(!email) email = user.email
      if(!phone) phone = user.phone
      await CustomerDetails.findByIdAndUpdate(userId,{
         name,
         email,
         phone
      })
      res.redirect('/profile')
   } catch (error) {
      console.log(error)
      
   }
})
//Add address 
exports.add_address = asyncHandler (async(req,res)=>{
   try{
      // const check = 'checkout'
      const {name ,country , city , state , pincode , phone , address } = req.body
      if(name.length === 0 || country.length === 0 || city.length === 0 || state.length === 0 || pincode.length === 0 || 
         phone.length === 0 || address.length === 0 ){
            const validate = "Enter all fields"
            res.redirect(`/profile?validate=${validate}?address=true?addressAdd=true`)
         }
         const userData = res.userData
         const userId = userData.id
         const newAddress = new Address({
            userId,
            name,
            country,
            city,
            state,
            pincode,
            phone,
            address
         })
         await newAddress.save()
        
            res.redirect(`/profile?address=true?`)
      
         
   }catch(err){
      console.log(err)
   }
})
//Add address 
exports.add_address_from_checkout = asyncHandler (async(req,res)=>{
   try{
      // const check = 'checkout'
      const {name ,country , city , state , pincode , phone , address } = req.body
      if(name.length === 0 || country.length === 0 || city.length === 0 || state.length === 0 || pincode.length === 0 || 
         phone.length === 0 || address.length === 0 ){
            const validate = "Enter all fields"
            res.redirect(`/profile?validate=${validate}?address=true?addressAdd=true`)
         }
         const userData = res.userData
         const userId = userData.id
         const newAddress = new Address({
            userId,
            name,
            country,
            city,
            state,
            pincode,
            phone,
            address
         })
         await newAddress.save()
         const addresss = await Address.findOne({ userId: userId })
         .sort({ createdAt: -1 })
        
            res.redirect(`/checkout/${addresss._id}`)
      
         
   }catch(err){
      console.log(err)
   }
})

//Delete address 
exports.deleteAddress = asyncHandler (async (req,res)=>{
   try {
      const addressId = req.params.id
      await Address.findByIdAndDelete(addressId)
      res.redirect('/profile?address=true')
   } catch (error) {
      
   }
})
//Update Address
exports.editAddress = asyncHandler(async(req,res)=>{
   try {
      const addId = req.params.id
      const {name ,country , city , state , pincode , phone , address } = req.body
      await Address.findByIdAndUpdate(addId,{
             name,
            country,
            city,
            state,
            pincode,
            phone,
            address
      })
      res.redirect('/profile?address=true')
   } catch (error) {
      res.redirect('/')
      console.log(error)
   }
})
//Cancel order 
exports.cancelOrder = asyncHandler(async(req,res)=>{
   try{
      let data = 'Cancel'
      const userData = res.userData
      const orderId = req.params.id
      await Orders.findByIdAndUpdate(orderId ,{
         status : data
      }) 
      res.redirect('/profile?order=true')
   }catch(err){
      console.log('Cant cancel update line no : 1043 (error)=>'+err)
   }
})




//Show All products
exports.all_products = asyncHandler(async(req,res)=>{
   try {
      res.render('user/explore')
   } catch (error) {
      res.redirect('/')
      console.log(error)
   }
})
//Fetch products filtering
exports.fetch_products = asyncHandler(async (req, res) => {
   try {
       let payload = req.body.payload;
       let category = payload.cata;
       let sort = payload.sort;
       let sendingData;

       if (category == 'mens') {
           category = 'Mens';
       }
       if (category == 'womens') {
           category = 'Womens';
       }
       if (category == 'kids') {
           category = 'Kids';
       }
   
       let aggregationPipeline = [{ $match: { category: category } }];

       if (category == 'all') {
           aggregationPipeline = [{ $match: {} }];
       }

       if (sort == 'newFirst') {
           aggregationPipeline.push({ $sort: { createdAt: -1 } });
       } else if (sort == 'priceLowToHigh') {
           aggregationPipeline.push({ $sort: { discountPrice: 1 } });
       } else if (sort == 'priceHighToLow') {
           aggregationPipeline.push({ $sort: { discountPrice: -1 } });
       }

       // Add a $limit stage to control the number of documents returned
       const page = payload.page || 1; 
       const PerPage = 8;
       const skip = (page - 1) * PerPage;
       aggregationPipeline.push({ $skip: skip })

       aggregationPipeline.push({ $match: {
         blocked: {
             $ne: true 
         }
     } })
       const options = { maxTimeMS : 6000000 }
       
       sendingData = await Products.aggregate(aggregationPipeline ,options)
     
       const totalPages = Math.ceil(sendingData.length / PerPage )
       
       const currentPageProducts = sendingData.slice(0, 8)
       
       const responsePayload = { products: currentPageProducts, totalPage: totalPages, currentPage: page }

       res.send( {payload : responsePayload} ) 

       
   } catch (err) {
       console.log(err);
       res.status(500).send({ error: 'Internal Server Error' })
   }
});



//Checkout page
exports.checkout = asyncHandler(async(req,res)=>{
   try{
      const userData = res.userData 
      const addressData = req.params.id
      let showAddress 
       let Addres = await Address.find({userId : userData.id})
       let index = Addres.length - 1
       showAddress = Addres[0]
       if(addressData){
         showAddress = await Address.findOne({_id : addressData})
         console.log("yes")
       }
      const selectAddress = await Address.find({userId : userData.id })
      
      userDetails = {name : userData.name , _id : userData.id}
      await Cart.find({userId : userData.id}).populate('productId')
      .then(async (cart)=>{
         let totalAmount = 0
         let finalPrice = 0 
         let couponDiscount = 0
         let totalNoOfProduct = 0
         cart.forEach(cartItems =>{
               totalAmount += cartItems.productId.price * cartItems.quantity
               finalPrice += cartItems.productId.discountPrice * cartItems.quantity
               totalNoOfProduct += cartItems.quantity
         })
         let offerDiscount = totalAmount - finalPrice 
         let couponMsg = ' '
         const coupon = res.coupon  
         console.log('=========================>2')
          
            if(coupon){  
               let price = finalPrice
               let calculateDiscount = Math.floor((coupon.discount / 100) * finalPrice)
               finalPrice = finalPrice - calculateDiscount
               couponDiscount = price - finalPrice
               couponMsg = `${coupon.coupon} coupon applied(${coupon.discount}% Off)`
            }
         console.log('=========================>1')

            let totalDiscount = totalAmount - finalPrice
         
         const amount = {
            totalAmount : totalAmount,
            finalPrice : finalPrice,
            totalDiscount : totalDiscount,
            couponDiscount : couponDiscount,
            offerDiscount : offerDiscount
          }
          const wallet = await Wallet.findOne({userId : userData.id}) 
         // res.clearCookie('couponToken')
      res.render('user/checkout',{showAddress ,
           amount ,
           cart , 
           userDetails , 
           selectAddress ,
           totalNoOfProduct ,
           wallet })
   })
   }catch(err){
      p(err)
   }
})
//return order
exports.returnorder = asyncHandler (async (req,res)=>{
   try{
      const orderId = req.params.id
      await Orders.findByIdAndUpdate(orderId , {
         return : true
      }) 
      res.redirect('/profile?order=true')
   }catch(err){
console.log(err)
   }
})

//check out Payment
exports.razorpay = asyncHandler(async (req,res)=>{
   try{

      let amount = req.body.amount
      const paymentData = {
         amount: amount,
         currency: "INR",
         receipt: "athulpr147@gmail.com",
       }
       console.log(amount)
       razorpay.orders.create(paymentData,(err,order)=>{
         if (!err) {
            console.log("here")
            res.status(200)
            res.send({
              success: true,
              msg: "Order Created",
              amount: amount,
              key_id: 'rzp_test_BFC8QSPWgscUUW',
              contact: "8330834359",
              name: "Athul PR",
              email: "athulpr147@gmail.com",
              message: true,
              orderId : order.id
            })
            // console,log(order.id)
          } else {
            res.status(400)
            res.send({
                message: true,
                success: false,
                msg: "Something went wrong!",
              })
          }
       })
       

   }catch(err){
      console.log(err)
   }
})

//check out Payment
exports.razorpay_to_wallet = asyncHandler(async (req,res)=>{
   try{

      let amount = req.body.amount
      console.log('amound '+amount)
      const paymentData = {
         amount: amount,
         currency: "INR",
         receipt: "athulpr147@gmail.com",
       }
       console.log('amound '+amount)
       razorpay.orders.create(paymentData,(err,order)=>{
         if (!err) {
            console.log("here")
            res.status(200)
            res.send({
              success: true,
              msg: "Order Created",
              amount: amount,
              key_id: 'rzp_test_BFC8QSPWgscUUW',
              contact: "8330834359",
              name: "Athul PR",
              email: "athulpr147@gmail.com",
              message: true,
              orderId : order.id
            })
            console.log("==>"+order.id)
          } else {
            res.status(400)
            res.send({
                message: true,
                success: false,
                msg: "Something went wrong!",
              })
          }
          console.log(err)
       })
       

   }catch(err){
      console.log(err)
   }
})

//Checkout by wallet
exports.debitWallet = asyncHandler(async(req,res)=>{
   try{
      const userData = res.userData 
      const amount = req.body.amount
      const wallet = await Wallet.findOne({userId : userData.id})
      let balance = parseInt(wallet.balance , 10) - parseInt(amount , 10)
      await Wallet.findByIdAndUpdate(wallet._id,{
         balance 
      })
      res.send({sucess : true})
   }catch(err){
      p(err)
      res.send({sucess : false})
   }
})


//Add money to wallet
exports.addMoneyInWallet = asyncHandler(async(req,res)=>{
   try{
      const userData = res.userData 
      let { paymentID , amount } = req.body
      console.log("walletAmount"+amount)
      const wallet = await Wallet.findOne({userId : userData.id})
      const currentDate = new Date()
      const date = currentDate.toLocaleDateString()
      const time = currentDate.toLocaleTimeString(); // E.g., "12:34:56 PM"
      let new_wallet = {amount : amount , date : date , time : time , paymentID:paymentID }
      if(wallet){
         new_wallet = wallet.history.unshift(new_wallet)
         p(amount)
         amount = parseInt(wallet.balance, 10) + parseInt(amount, 10)
         p(amount)
         await Wallet.findByIdAndUpdate(wallet,{
         userId : userData.id,
         balance : amount,
         history :  new_wallet
         })
         res.send({
            sucess : true,
            redirectTo : '/profile?dashboard=true'
         })
         return
      }
      const newWallet = new Wallet({
         userId : userData.id,
         balance : amount,
         history : new_wallet
      })
      await newWallet.save()

      res.send({
         sucess : true,
         redirectTo : '/profile?dashboard=true'
      })

   }catch(err){
      p(err)
      res.send({
         sucess : false,
         redirectTo : '/profile?dashboard=true'
      })
   }
})


//Adding Order Details
exports.addOrder = asyncHandler (async(req,res)=>{
   const userData = res.userData  
   try {
      const {paymentID,orderAddress,paymentMethod,paymentStatus} = req.body
      res.clearCookie('couponToken')
      const cartProducts = await Cart.find({ userId: userData.id }).populate('productId');
      let products = []
     cartProducts.forEach(element =>{
       let size = element.size
       let productId = element.productId
       products.push({size : size , productId : productId})
     })
   
     const cart  = await Cart.find({userId : userData.id}).populate('productId')
      
         let totalAmount = 0
         let finalPrice = 0 
         let couponDiscount = 0
         let totalNoOfProduct = 0
         cart.forEach(cartItems =>{
               totalAmount += cartItems.productId.price * cartItems.quantity
               finalPrice += cartItems.productId.discountPrice * cartItems.quantity
               totalNoOfProduct += cartItems.quantity
         })
         let offerDiscount = totalAmount - finalPrice 
         let couponMsg = ' '
         let couponName
         const coupon = res.coupon
         if(!coupon) {
            couponName = 'No coupon'
         }  else{ couponName = coupon.coupon }
              
            if(coupon){  
               p("yes coupon")
               let price = finalPrice
               let calculateDiscount = Math.floor((coupon.discount / 100) * finalPrice)
               finalPrice = finalPrice - calculateDiscount
               couponDiscount = price - finalPrice
               couponMsg = `${coupon.coupon} coupon applied(${coupon.discount}% Off)`
            }
            let totalDiscount = totalAmount - finalPrice
         
         //Generating Order id
       const order_Id = generateOTP.generate(7, {
         upperCaseAlphabets: false,
         lowerCaseAlphabets:false ,
          specialChars: false ,
          alphabets: false})
          const orderId = 'ORD'+order_Id
         let status = 'Pending'

         if(!couponName) couponName = 'No Coupon'
            const newOrder = new Orders({
            orderId : orderId,
            status , 
            userId : userData.id,
            paymentId: paymentID,
            orderAddress: orderAddress,
            paymentMethod: paymentMethod,
            products: products, 
            coupon: couponName,
            totalAmount: totalAmount,  
            finalPrice: finalPrice, 
            totalDiscount: totalDiscount,
            couponDiscount: couponDiscount,
            offerDiscount: offerDiscount,
            paymentStatus: paymentStatus,
            quantity: totalNoOfProduct,
          })
           await newOrder.save()
           const Cart_products = await Cart.find({userId : userData.id }).populate('productId')
           Cart_products.forEach(element =>{
            const stocks =  parseInt(element.productId.stocks,10) - parseInt(element.quantity,10)
            async function updateStock(){
                  await Products.findByIdAndUpdate(element.productId._id,{
                     stocks
                  })
            }
            updateStock()
           
           })
         await Cart.deleteMany({userId : userData.id })
           res.json({ success: true, redirectTo: '/profile?order=true'})
         
         
 
   } catch (error) {
      console.log("Order creating : "+error)
   }
})






//lookup
exports.lookup = asyncHandler (async (req,res)=>{
   try {
      // Cart.aggregate([
      //    {
      //       $lookup :{
      //          from : 'Products',
      //          localField : 'productId',
      //          foreignField : '_id',
      //          as : 'products'
      //       }
      //    }
      // ])
      // Cart.find().populate('productId')
      // .then((products)=>{
      //    p(products)
      //    res.send(products)
      // })
   await Cart.find()
  .populate('productId')
  .then((carts) => {
       res.send(carts);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error occurred') 
  });
         


   } catch (error) {
      p(error)
   }
})





//Testing Search
//GET
exports.search_page = asyncHandler(async(req,res)=>{ 
   try {
      res.render('user/searchTest') 
   } catch (error) {
      console.log(error)
   }
})



//router.post('/search')------->
 
exports.search = asyncHandler(async (req, res) => {
   try {
       let payload = req.body.payload.trim();
       console.log('Received payload:', payload);

       // Perform a case-insensitive search for documents where the 'name' field starts with the 'payload'
       let search = await CustomerDetails.find({name : { $regex: '^' + payload, $options: 'i' } }).limit(10).exec()

       // Send the search results (up to 10 matches) back to the client
       console.log('Sending response:', search);
       res.send({ payload: search });
   } catch (error) {
       console.error('Error:', error);
       res.status(500).send({ error: 'An error occurred while processing your request' });
       // You can customize the error response as needed.
   }
})