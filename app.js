const express = require('express')
const app = express()
require('dotenv').config()
const connectDB = require('./server/database/config') 
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const path = require('path')

//PORT NUMBER 
const PORT = process.env.PORT || 7070   
//CONNECTING DATABASE
 connectDB()
//MIDDLEWARES
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({extended : true})) 
app.use(express.static('public'))
app.use(cookieParser())


// app.set('views', path.join(__dirname, 'views/admin'))
// app.set('views', path.join(__dirname, 'views/user'))
app.set('view engine','ejs')


//User routes
app.use('/',require('./server/routes/userRoutes')) 
//Admin routes
app.use('/admin',require('./server/routes/adminRoutes'))
// 404
app.get('*',(req,res)=>{
    res.send("Oops 404")
})

app.listen(process.env.PORT,()=>{
 console.log(`Server started on http://localhost:${PORT}`) 
})