const CartItem = require("../models/cartItem.model.js");
const UserService = require("../services/user.service.js");

const updateCartItem = async(userId, cartItemId, cartItemData) => {

    try {
       const item = await findCartItemById(cartItemId)
       const user = await UserService.findUserById(item.userId)
       
       if(!user){
        throw new Error("user not found :",userId)
       }

       if(user._id.toString() === userId.toString()){
        
        item.quantity = cartItemData.quantity;
        item.price = item.quantity * item.product.price;
        item.discountedPrice = item.quantity*item.product.discountedPrice;
        
        const updatedCartItem = await item.save();
        
        return updatedCartItem;
       }
       
       else{
        throw new Error("you can't update this cart item")
       }
    } 
    catch (error) {
        throw new Error(error.message)
    }
}

const removeCartItem = async(userId,cartItemId) => {

    const cartItem = await findCartItemById(cartItemId);
    const user = await UserService.findUserById(userId);

    if(user._id.toString() === cartItem.userId.toString()){
        return await CartItem.findByIdAndDelete(cartItemId)
    }

    throw new Error("you cant remove another user's item");
}

const findCartItemById = async(cartItemId) => {
    // console.log(cartItemId)
    const cartItem = await CartItem.findById(cartItemId).populate("product");
    if(cartItem){
        return cartItem
    }
    else{
        throw new Error("cartItem not found with id surendra", cartItemId)
    }
}

module.exports = {updateCartItem,removeCartItem,findCartItemById}