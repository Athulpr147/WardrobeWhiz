const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const CustomerDetails = require('../model/customer')
const Catagories = require('../model/categories')
const Products = require('../model/products')
const Admin = require('../model/admin')
const Orders = require('../model/orders')
const Banner = require('../model/banner')
const Coupons = require('../model/coupon')
const Wallet = require('../model/wallet')
const subCatagory = require('../model/subCatagory')

const p = require('../modules/console')
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const moment = require('moment')
const categories = require('../model/categories')
const { forEach, isError } = require('lodash')
// const subCatagory = require('../model/subCatagory')




//Admin Login page =>GET\
exports.admin_loginPAge = asyncHandler (async(req,res)=>{
    try {
        const validate = ""
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('admin/login_signup',{validate})
    } catch (error) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.send("Something went Wrong "+error)
    }
})
//Admin LOgin =>POST+
exports.admin_login = asyncHandler(async(req,res)=>{
    try {
        const {email , password } = req.body
        //Validation
        if(!email || email === " " || email.length ===0 || !password || password === ' ' || password.length === 0){
        const validate = "Fields Cant be Empty";
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.status(500).render('admin/login_signup',{validate}) ;  return }
        const admin = await Admin.findOne({email : email})
        if(!admin){ const validate = "Admin not registered";
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.status(500).render('admin/login_signup',{validate}); return } 
        //Compairing password
        const comparePassword = await bcrypt.compare(password,admin.password)
        if(!comparePassword){ const validate = "Password not matching";
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.status(500).render('admin/login_signup',{validate}) ; return}    
        //Validation Complete
        //Creating Token
        const adminData = {
            id : admin._id,
            name : admin.name,
            email : admin.email
        }

        const adminToken = jwt.sign(adminData , "adminToken123" ,{expiresIn : "500m"})
        res.cookie("adminToken",adminToken ,{httpOnly : true})

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.redirect('/admin/')          

    } catch (error) {
        console.log("Error in login "+error)
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        const validate = "Something went wrong"
        res.redirect('/admin/')
    }
})

//Admin register POST
exports.add_admin = asyncHandler  (async (req,res)=>{
   try{
    const {name , email , password } = req.body
    if(name === " " || name.length === 0 || email === " " || email.length === 0 || password === " "|| password.lenght === 0){
        
        res.send("Input cant be empty")
        return
    }
    const isEmail = await Admin.findOne({email : email})
    
    if(isEmail){
        
        res.send("Email alredy registerwed")
        return
    }
    const hashPassword = await bcrypt.hash(password,10)
    const admin = new Admin({
        name,
        email,
        password : hashPassword
    })
    await admin.save()
    res.send("reg sucess")
   }catch (error){

  res.json("NOT REGISTERED" +error)
   }
})
// Admin Signout
exports.signout = asyncHandler(async (req, res) => {
    try {
        // Clear the 'adminToken' cookie
        res.clearCookie('adminToken');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, private');
        res.setHeader('Expires', '0');
        res.setHeader('Pragma', 'no-cache');

        // Redirect to the admin login page
        res.redirect('/admin/login')
    } catch (error) {
        console.error('Error during signout:', error)
        res.status(500).send('Unable to log out: ' + error.message)
    }
})










// Dashboard Page
exports.admin_home = asyncHandler(async (req,res)=>{ 
    try {
        //User Count
        const users = await CustomerDetails.find()
        //This month income
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
        const orders = await Orders.find({
            status: 'Delivered',
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          }).populate('products.productId')
          const totalOrderThisMonth = orders.length
          const thisMonthCollection = orders.reduce((total, order) => total + order.finalPrice, 0 )
          //Todays Orders 
          const startOfDay = moment().startOf('day').toDate()
          const endOfDay = moment().endOf('day').toDate()

          const OrdersToday = await Orders.find({
            status: 'Delivered',
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            }
          }).populate('products.productId')
            const TodaysCollections = OrdersToday.reduce((total,OrdersToday) => total + OrdersToday.finalPrice , 0)
          //Last Month 
          const lastMonthStart = moment().subtract(1,'months').startOf('month').toDate()
          const lastMonthEnd = moment().subtract(1,'months').startOf('month').toDate()

          const lastMonth = await Orders.find({
            status: 'Delivered',
            createdAt: {
              $gte: lastMonthStart,
              $lte: lastMonthEnd,
            },
          }).populate('products.productId');
          const lastMonthOrders = lastMonth.length
          const lastMonthCollection = lastMonth.reduce((total,lastMonth)=> total + lastMonth.finalPrice , 0 )
           

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')

        res.render('admin/dashboard',{users ,
             totalOrderThisMonth ,
              thisMonthCollection,
              TodaysCollections ,
              lastMonthCollection,
              lastMonthOrders})

    } catch (error) {
        res.send('Admin Dashboard not load'+error) 
    }
})
//Fetch topSelling chart for dashboard
exports.topSelling = asyncHandler(async(req,res)=>{
    try{
        const topSelling = await subCatagory.find().sort({count : -1}).limit(9)
        let label = []
        let data = []
      topSelling.forEach(topSelling =>{
        label.push(topSelling.name)
        data.push(topSelling.count)
      }) 
      res.send({sucess : true ,label , data})
    }catch(err){
        console.log(err)
        res.send({sucess : false ,label : 'error', data : 'error'})
    }
})
// fetching catagory income
exports.fetch_sales_income = asyncHandler(async(req,res)=>{
    try{
        let WomensTotal = 0
        let MensTotal = 0
        let KidsTotal = 0
        // const cata = await Catagories.find()
        const orders = await Orders.find({status:'Delivered'})
        .populate('products.productId')
        for (let product_ of orders){
            for(let product of product_.products){ 

                  if(product.productId.category === 'Kids'){
                    KidsTotal = KidsTotal + product_.finalPrice   
                  }  
                  if(product.productId.category === 'Mens'){
                    MensTotal = MensTotal + product_.finalPrice
                  }
                  if(product.productId.category === 'Womens'){
                    WomensTotal = WomensTotal + product_.finalPrice
                  }
            }
        }
        const label = ['Mens','Womens','Kids'] 
        const data = [MensTotal,WomensTotal,KidsTotal]
        res.send({
            sucess : true,
            label,
            data 
        })
        p(label)
        p(data)
    }catch(err){
        console.log(err)
    }
})


//Show Users =>GET
exports.show_users = asyncHandler(async (req,res)=>{
    try {
        const CustomerDetails = require('../model/customer')
        const userDetails = await CustomerDetails.find().sort({ createdAt: -1}).exec()
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('admin/users',{userDetails})
    } catch (error) {
      res.send('admin view users not load')   
    }
})
//User Search POST
exports.search = asyncHandler(async(req,res)=>{
    try {
        
        let payload = req.body.payload.trim()
        console.log("Got data")
        let search = await CustomerDetails.find({name : { $regex: '^' + payload, $options: 'i' } }).limit(10).exec();
        res.send({ payload: search });
    } catch (error) {
        console.log("Search data not found "+ error)
    }
}) 
//User Profile  => GET
exports.user_profile = asyncHandler(async(req,res)=>{
    try {
        const userId = req.params.id
        const user = await CustomerDetails.findOne({_id : userId})
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('admin/userDetails',{user})
    } catch (error) {
        console.log("User profile is not loaded =>"+error)
        res.redirect("/admin/")
    }
})
//Edit User  => PUT (POST)
exports.edit_user = asyncHandler (async(req,res)=>{
   try {
    const userId = req.params.id
    const {name , email , phone , blocked} = req.body
    const user  = await CustomerDetails.findOne({_id : userId})
    console.log(user)
    await CustomerDetails.updateMany({_id : userId},{
        $set:{
            name : name,
            email : email,
            phone : phone,
            blocked : blocked 
        }
    })
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.redirect(`/admin/userProfile/${userId}`)
    console.log("Edit sucess")
   } catch (error) {
    console.log("req not sucess")
    res.redirect('/admin/')
   }

})
//Delete Users  => DELETE (POST)
exports.delete_user = asyncHandler(async(req,res)=>{
    try {
        const userId = req.params.id
        await CustomerDetails.deleteOne({_id : userId})
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.redirect('/admin/users')
    } catch (error) {
        console.log(" Not Deleted ")
        res.redirect(/admin/)
    }
})
//Add user =>POST
exports.add_user = asyncHandler (async(req,res)=>{
    try {
        const {name , email , phone , password } = req.body
        const userEmail = await CustomerDetails.findOne({email : email})
        const userPhone = await CustomerDetails.findOne({phone : phone})
        if(userEmail || userPhone){
            const validate = "User already Exist "
        }
        const newUser = new CustomerDetails({
            name ,
            email,
            phone
        })
        await newUser.save()
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.redirect('/admin/users')
    } catch (error) {
        res.send('Cant add new user')
    }
})



//Show all products => GET
exports.products = asyncHandler(async(req,res)=>{
    try {
        const allProducts = await Products.find().sort({ createdAt: -1 }).exec()
        const catagories = await Catagories.find().sort({ createdAt: -1 }).exec()
        const mensCatagory = await Products.find({category : "Mens" }).sort({ createdAt: -1 }).exec()
        const womensCatagory = await Products.find({category : "Womens" }).sort({ createdAt: -1 }).exec()
        const kidsCatagory = await Products.find({category : "Kids" }).sort({ createdAt: -1 }).exec()
        const subcatagory = await subCatagory.find().sort({createdAt : -1})
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')

        res.render('admin/products',{ allProducts ,
             catagories ,
              mensCatagory ,
              womensCatagory ,
               kidsCatagory ,
               subcatagory })
    } catch (error) {
        console.log("admin  Products page not load"+error)
        res.redirect('/admim/')
    }
})
//View one Product Page => GET (POST)
exports.view_product = asyncHandler(async(req,res)=>{
    try {
        const productDetails = req.params.id
        const product = await Products.findOne({_id : productDetails})
        const catagories = await Catagories.find()
        const subcatagory = await subCatagory.find().sort({createdAt : -1})
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('admin/viewProduct',{ product , catagories , subcatagory })
        console.log(product.discountPrice)
    } catch (error) {
        console.log("Cant open product")
        res.status(500).redirect('/admin/')
    }
})
//Add products  => POST
exports.addProduct = asyncHandler(async(req,res)=>{
    try {
        const uploadedFiles = req.files
        const image = []
        uploadedFiles.forEach(element => {
           image.push(element.filename)
         })
         console.log("To array "+image)
        const{ name,brand,category,sub_category,price,size,decription,stocks,colors,discountPrice,discount } = req.body
        const product = await Products.find()
       
        
        const newProduct = new Products({
            name, 
            brand,
            category,
            sub_category,
            price,
            size,
            image,
            colors,
            stocks,
            decription,
            discount,
            discountPrice
        })
        await newProduct.save()
        console.log(discountPrice+" "+discount)
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.redirect('/admin/products')

    } catch (error) {
        console.log(error)
        res.status(500).redirect('/admin/')
    }
})
//Edit Product  => PUT
exports.edit_product = asyncHandler(async(req,res)=>{
    try {
        const product_id = req.params.id
        const{ name,brand,category,sub_category,price,size,decription,stocks,colors,discountPrice,discount ,blocked} = req.body
        const product = await Products.findOne({_id : product_id})
        const {image1, image2,image3,image4} = req.files
        const image = []
        
        if(image1){ image.push(image1[0].filename) }else{  image.push(product.image[0])  }
        if(image2){ image.push(image2[0].filename) }else{  image.push(product.image[1])  }
        if(image3){ image.push(image3[0].filename) }else{  image.push(product.image[2])  }
        if(image4){ image.push(image4[0].filename) }else{  image.push(product.image[3])  }
           
        console.log(image)
        await Products.updateMany({_id : product_id},{
            $set:{
                name : name,
                brand : brand,
                category : category,
                sub_category : sub_category ,
                price:price,
                size:size,
                decription:decription,
                stocks:stocks,
                colors:colors,
                image : image,
                discountPrice : discountPrice,
                discount : discount,
                blocked : blocked
            }
        })
        
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.redirect(`/admin/products/viewProduct/${product_id}`)
        
    } catch (error) {
        console.log("Cant edit :"+error)
        res.status(500).redirect(`/admin/`)
    }
})
//Create new Catagories => POST
exports.add_catagories = asyncHandler(async(req,res)=>{
    try {
        const {name,description} = req.body
        const catagories = await Catagories.findOne({name : name})
        if(catagories){
            console.log('cata aleady listed')
            res.redirect('/admin/')
            return
        }
        const catagorie = new Catagories({
            name : name,
            description : description
        })
        await catagorie.save()
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.redirect('/admin/product')

    } catch (error) {
        console.log("Not created new catagorie :"+error)
        res.redirect("/adimin/")
    }
})
//Create new sub catagory
exports.new_subcata = asyncHandler(async(req,res)=>{
    try{
        const name = req.body.name
        const isAlready = await subCatagory.findOne({name : name})
        if(isAlready){
            const catagory = await subCatagory.find().sort({createdAt : -1})
            let message = 'Catagory already there'
            res.send({catagory : catagory , message })
            return
        }
        const newCatagory = new subCatagory({
            name
        })
        await newCatagory.save()
        const catagory = await subCatagory.find().sort({createdAt : -1})
        let message = 'Saved'
    res.send({catagory : catagory , message })
    }catch(err){
        console.log(err)
        const catagory = await subCatagory.find().sort({createdAt : -1})
        let message = 'Something wrong..'
        res.send({ message })
    }
})
// Delete Product DELETE(POST)
exports.delete_product = asyncHandler(async(req,res)=>{
    try {
         const id = req.params.id
         await Products.findByIdAndDelete({_id : id}) 
         res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
         res.redirect('/admin/products')            
        console.log(id)                 
    } catch (error) {
        console.log("Cant delete : "+ error)
    }
})



//Orders details => GET
exports.orders = asyncHandler(async (req,res)=>{
    try {
        const allOrders = await Orders.find()
        .populate([
            {path : 'products.productId' },
            {path : 'orderAddress' },
            {path : 'userId' }
        ])
        .sort({ createdAt: -1 })
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('admin/orders',{ allOrders})
    } catch (error) {
        res.send('Admin orders page not load'+error) 
    }
})
//View order details
exports.show_order = asyncHandler(async(req,res)=>{
    try{
        const orderId = req.params.id
        const order = await Orders.findOne({_id : orderId})
        .populate('products.productId')
        .populate('orderAddress')
        .populate('userId')
    res.render('admin/viewOrder', {order} )
    }catch(err){
        console.log("show order err  "+err)
    }
})
//Change order status
exports.change_status_ = asyncHandler(async(req,res)=>{ 
    try{
        const status = req.params.status
        const orderId = req.params.id
        let completed  = false
        let deliveredDate = '0/0/0000'
        if(status == 'Delivered'){
            const currentDate = new Date();
            const date = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear}`
            completed = true

            const orders = await Orders.find({_id : orderId}).populate('products.productId')
        for (const element of orders){
            const product = element.products
            for(const innerElement of product){
                const product = innerElement.productId
                const subcata = await subCatagory.findOne({ name :product.sub_category })
                const count = subcata.count += 1
                await subCatagory.findByIdAndUpdate(subcata._id,{count})
            }
        }
        }
        await Orders.findByIdAndUpdate(orderId,{
            status : status,
            completed : completed,
            deliveredDate : deliveredDate
        })
        
        res.redirect(`/admin/showOrder/${orderId}`) 
         
    }catch(err){ 
console.log(err)
    }
})
//Refund MOney
exports.refund_money = asyncHandler(async(req,res)=>{
    try{
        const orderId = req.params.id
        const amount = req.body.amount
        const order = await Orders.findOne({_id : orderId})
        const wallet = await Wallet.findOne({userId : order.userId}).populate('userId')
        let newbalance = parseInt(wallet.balance,10) + parseInt(amount,10)
        await Wallet.findByIdAndUpdate(wallet._id,{
            balance : newbalance
        })
        await Orders.findByIdAndUpdate(orderId ,{
            refunded : true
        })
        res.redirect(`/admin/showOrder/${orderId}`)
    }catch(err){ 
        res.send(err)
    }
})

//Coupons => GET
exports.coupons = asyncHandler (async(req,res)=>{
    try {
        const coupons = await Coupons.find()
        const message = " "
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        const currentDate = new Date()
        res.render('admin/manageCoupons',{message , coupons ,currentDate})
    } catch (error) {
        res.send("Admin coupen not load")
    }
    
})
//Coupon POST Add coupons\
exports.add_coupons = asyncHandler (async(req,res)=>{
    try {
        const {coupon , discount , date , minPurchase} = req.body
        const coupons = await Coupons.find()
        coupons.forEach(element =>{
            if(coupon === element.coupon) {
                const message = "Coupon already exist"
                res.redirect(`/admin/coupons?message=${message}`)
                return   }
        })

        const add = new Coupons({
            coupon,
            discount,
            expireDate : date,
            minPurchase
        })
        await add.save()
        const message = "Coupon saved"
        res.redirect(`/admin/coupons?message=${message}`)
    } catch (error) {
        console.log(error)
    }
})
//Delete Coupon
exports.deleteCoupon = asyncHandler(async(req,res)=>{
    try{
        const id = req.params.id
        await Coupons.findByIdAndDelete(id)
        const message = "Deleting sucess"
        res.redirect(`/admin/coupons?message=${message}`)
    }catch(err){
        console.log(err)
    }
})



//Sales Report =>GET
exports.sales_report = asyncHandler(async(req,res)=>{
 try {
    const orders = await Orders.find({status : 'Delivered' , refunded : false})
    .populate('orderAddress')
    .populate('products.productId')
    .sort({createdAt : -1})
    
   let  deliveryDate
    let orderReport = []
    let TotalPrice = 0
    orders.forEach(element =>{
        let products = []
        element.products.forEach(ele =>{
            products.push(ele.productId.name)
        })
        let date = new Date(element.createdAt)
        deliveryDate = new Date(element.updatedAt)
        orderReport.push({
            orderId : element.orderId,
            paymentId : element.paymentId,
            customerName : element.orderAddress.name,
            price : element.finalPrice,
            products : products ,
            order_date : `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
            delivery_date : `${deliveryDate.getDate()}-${deliveryDate.getMonth()}-${deliveryDate.getFullYear()}`,
            delivery_fullDate : element.updatedAt
        }) 
        TotalPrice = TotalPrice + element.finalPrice
    })
    p(orderReport)
    orderReport
    const today = new Date();
const oneWeekAgo = new Date(today);
oneWeekAgo.setDate(today.getDate() - 7);
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(today.getMonth() - 1);

let todayTotalPrice = 0
let thisWeekTotalPrice = 0
let thisMonthTotalPrice = 0

// Filter orderReport for "today," "this week," and "this month"
const todayOrders = orderReport.filter((order) => {
  const deliveryDate = new Date(order.delivery_fullDate)
  if(deliveryDate.toDateString() === today.toDateString()){
  todayTotalPrice = todayTotalPrice + order.price
  }
  return deliveryDate.toDateString() === today.toDateString()
 
});

const last7DaysOrders = orderReport.filter((order) => {
  const deliveryDate = new Date(order.delivery_fullDate);
  if(deliveryDate >= oneWeekAgo && deliveryDate <= today){
    thisWeekTotalPrice = thisWeekTotalPrice + order.price
  }
  
  return (
    deliveryDate >= oneWeekAgo && deliveryDate <= today
  );
 
});

const last30DaysOrders = orderReport.filter((order) => {
  const deliveryDate = new Date(order.delivery_fullDate);
  if(deliveryDate >= oneMonthAgo && deliveryDate <= today){
  thisMonthTotalPrice = thisMonthTotalPrice + order.price
  }
  return (
    deliveryDate >= oneMonthAgo && deliveryDate <= today
  )
  
})
    

   
    

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private') 
    res.render('admin/sales',{
        orderReport,TotalPrice,
        todayOrders,todayTotalPrice,
        last7DaysOrders,thisWeekTotalPrice,
        last30DaysOrders , thisMonthTotalPrice
    })
 } catch (error) {
    res.send("adminsales page not rendered : "+error)
    p(error)
 }
})

//fetching sales data
exports.fetch_sales_report = asyncHandler(async(req,res)=>{
    try {
       const orders = await Orders.find({status : 'Delivered' , refunded : false})
       .populate('orderAddress')
       .populate('products.productId')
       .sort({createdAt : -1})
       
      let  deliveryDate
       let orderReport = []
       let TotalPrice = 0
       orders.forEach(element =>{
           let products = []
           element.products.forEach(ele =>{
               products.push(ele.productId.name)
           })
           let date = new Date(element.createdAt)
           deliveryDate = new Date(element.updatedAt)
           orderReport.push({
               orderId : element.orderId,
               paymentId : element.paymentId,
               customerName : element.orderAddress.name,
               price : element.finalPrice,
               products : products ,
               order_date : `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
               delivery_date : `${deliveryDate.getDate()}-${deliveryDate.getMonth()}-${deliveryDate.getFullYear()}`,
               delivery_fullDate : element.updatedAt
           }) 
           TotalPrice = TotalPrice + element.finalPrice
       })
       p(orderReport)
       orderReport
       const today = new Date();
   const oneWeekAgo = new Date(today);
   oneWeekAgo.setDate(today.getDate() - 7);
   const oneMonthAgo = new Date(today);
   oneMonthAgo.setMonth(today.getMonth() - 1);
   
   let todayTotalPrice = 0
   let thisWeekTotalPrice = 0
   let thisMonthTotalPrice = 0
   
   // Filter orderReport for "today," "this week," and "this month"
   const todayOrders = orderReport.filter((order) => {
     const deliveryDate = new Date(order.delivery_fullDate)
     if(deliveryDate.toDateString() === today.toDateString()){
     todayTotalPrice = todayTotalPrice + order.price
     }
     return deliveryDate.toDateString() === today.toDateString()
    
   });
   
   const last7DaysOrders = orderReport.filter((order) => {
     const deliveryDate = new Date(order.delivery_fullDate);
     if(deliveryDate >= oneWeekAgo && deliveryDate <= today){
       thisWeekTotalPrice = thisWeekTotalPrice + order.price
     }
     
     return (
       deliveryDate >= oneWeekAgo && deliveryDate <= today
     );
    
   });
   
   const last30DaysOrders = orderReport.filter((order) => {
     const deliveryDate = new Date(order.delivery_fullDate);
     if(deliveryDate >= oneMonthAgo && deliveryDate <= today){
     thisMonthTotalPrice = thisMonthTotalPrice + order.price
     }
     return (
       deliveryDate >= oneMonthAgo && deliveryDate <= today
     )
     
   })
       
   
      
       
   
       res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private') 
       res.send({
        sucess : true ,
        orderReport,TotalPrice,
           todayOrders,todayTotalPrice,
           last7DaysOrders,thisWeekTotalPrice,
           last30DaysOrders , thisMonthTotalPrice
       })
    } catch (error) {
       res.send({
        sucess : true ,
        error : error
       })
       p(error)
    }
   })



//banner management =>GET
exports.shop_banner = asyncHandler(async(req,res)=>{
    try {
       
        const main = await Banner.findOne({name : "main"})
        const mens = await Banner.findOne({name : "mens"})
        const womens = await Banner.findOne({name : "womens"})
        const kids = await Banner.findOne({name : "kids"})
    
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('admin/banner',{ main  , mens , womens  , kids })
        console.log(main.image)
    } catch (error) {
        
    }
})
//Banner Manage +> PUT
exports.change_banner = asyncHandler(async(req,res)=>{
    try {
    
    const bannerId = req.params.id
    const {main , mens , womens , kids} = req.files
    const banner = await Banner.findOne({_id : bannerId})
    let image = null
        if(main){image = main[0].filename } 
        if(mens){image = mens[0].filename }
        if(womens){image = womens[0].fileanme}
        if(kids){image = kids[0].filename}
            if(!main && !mens && !womens && !kids){
                console.log("Please select image")
                res.redirect('/admin')
            }
            await Banner.findByIdAndUpdate(bannerId , {
                image : image
            }) 
    
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      res.redirect('/admin/banner')
         res.json(image)
    } catch (error) {
        console.log("errrrrrrrrrrrrrrror") 
        console.log(error)  
    }
})





//Admin Profile  => GET
exports.admin_profile = asyncHandler(async (req,res)=>{
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render('admin/profile')
    } catch (error) {
        
    }
})


 






// For Testing purpose
exports.test = asyncHandler(async(req,res)=>{
    try {

        res.render('admin/test')
    } catch (error) { 
        res.send(error)
    }
})