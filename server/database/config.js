
const mongoose = require('mongoose') 
mongoose.set('strictQuery', false)

const connectDB = async()=>{
    try {
        await mongoose.connect( "mongodb+srv://athulpr_WardrobeWhiz:l5oUJeLGBs0XSmK5@wardrobewhiz.maermy0.mongodb.net/WardrobeWhiz", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected")
    } catch (error) {
        console.log("Database is not connected Error :"+ error)
    }
}
module.exports = connectDB