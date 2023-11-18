
const mongoose = require('mongoose') 
mongoose.set('strictQuery', false)

const connectDB = async()=>{
    try {
         await mongoose.connect(process.env.MongoDB_URI)
        console.log("Database connected")
    } catch (error) {
        console.log("Database is not connected Error :"+ error)
    }
}
module.exports = connectDB