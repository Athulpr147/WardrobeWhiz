const Cart = require('../model/cart')
const addToCart = async (userId,productId,color,size,quantity)=>{

    try {
        const existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            return  false 
        }
        const newCart = new Cart({
            userId,
            productId,
            color,
            size,
            quantity
         })
         await newCart.save()
         
         return true
    } catch (error) {
        console.error(error)
        return message = {error : true , sucess : false}
    }
 }
 module.exports = addToCart
 