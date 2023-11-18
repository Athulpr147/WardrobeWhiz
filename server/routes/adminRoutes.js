const express = require('express')
const app = express()
const multer = require('multer')
const router = express.Router()
const controller = require('../controller/adminController')
const storage = require('../modules/uploadImage')
const isAdminLogined = require('../middleware/isAdminAuthorized')
const isAdminLogged = require('../middleware/isAdminLogged')

const upload = multer({storage: storage})
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


// Admin Login page
router.get('/login', isAdminLogged, controller.admin_loginPAge) 
router.post('/login', controller.admin_login)
// Admin Register
router.post('/addAdmin', controller.add_admin)
// Admin signout
router.post('/signout', isAdminLogined, controller.signout)


// Dashboard overview page
router.get('/', isAdminLogined, controller.admin_home)   


// User related------------------------------------->
// User management page
router.get('/users', isAdminLogined, controller.show_users) 
// User search
router.post('/search', isAdminLogined, controller.search)

router.post('/new_subCatagories',controller.new_subcata)

// Show Orders page 
router.get('/orders', isAdminLogined, controller.orders)
router.get('/showOrder/:id',isAdminLogined,controller.show_order) 
//update order status
router.get('/changestatus/:status/:id',controller.change_status_)

router.post('/refund/:id',isAdminLogined , controller.refund_money)


// Show user Profile
router.get('/userProfile/:id', isAdminLogined, controller.user_profile)
// Edit user profile
router.put('/editUser/:id', isAdminLogined, controller.edit_user)
// Delete User
router.delete('/delete_user/:id', isAdminLogined, controller.delete_user)
// Add new User
router.post('/addUser', isAdminLogined, controller.add_user) 



// Products related---------------------------------->
// Show all products page
router.get('/products', isAdminLogined, controller.products)
// Create new product Catagory
router.post('/createCatagory', isAdminLogined, controller.add_catagories)
//Create Sub catagorie
router.get
// Add new Product
router.post('/addProduct', isAdminLogined, upload.array('image', 4), controller.addProduct)
// View Products
router.get('/products/viewProduct/:id', isAdminLogined, controller.view_product)
// Edit and Update Products
router.put('/editProducts/:id', isAdminLogined, upload.fields([
    {
        name: 'image1',
        maxCount: 1
    }, {
        name: 'image2',
        maxCount: 1
    }, {
        name: 'image3',
        maxCount: 1
    }, {
        name: 'image4',
        maxCount: 1
    }
]), controller.edit_product)
// deleteProduct = DELETE
router.get('/delete_product/:id', isAdminLogined, controller.delete_product)


// / Coupons management page (GET)
router.get('/coupons', isAdminLogined, controller.coupons)
// Coupons management page (POST)
router.post('/addcoupon',isAdminLogined,controller.add_coupons)
//Delete Coupon
router.get('/deleteCoupon/:id',isAdminLogined, controller.deleteCoupon)



//Orders

// Sales Report page
router.get('/sales_report', isAdminLogined, controller.sales_report)
//fetch sale sdata
router.get('/fetch_sales_report',isAdminLogined,controller.fetch_sales_report)
//fetch topSelling products
router.get('/topSelling',isAdminLogined,controller.topSelling)
router.get('/revenueChart',isAdminLogined,controller.fetch_sales_income)



// Banner manage page
router.get('/banner', isAdminLogined, controller.shop_banner)

router.put('/banner/:id', upload.fields([
    {
        name: 'main',
        maxCount: 1
    }, {
        name: 'mens',
        maxCount: 1
    }, {
        name: 'womens',
        maxCount: 1
    }, {
        name: 'kids',
        maxCount: 1
    }
]), controller.change_banner)
// Admin profile
router.get('/profile', isAdminLogined, controller.admin_profile)


router.get('/test', controller.test)


module.exports = router
