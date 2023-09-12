const Review = require("../models/review.model.js");
const productService = require("../services/product.service.js");

const createReview = async(reqData, user)=>{
    const product = await productService.findProductById(reqData.productId);

    const review = new Review({
        user:user._id,
        product:product._id,
        review: reqData.review,
        createdAt:new Date(),
    })

    await product.save();
     
    return await review.save();

}

const getAllReviews = async(productId) => {
    // 23nd line is different in the youtube video timeline is 1:29:45 they used findProductById(reqData.productId)
    // but my doubt is we are not sending reqData we are just sending productId 
    const product = await productService.findProductById(productId)

    return await Review.find({product:productId}).populate("user");

}

module.exports = {
    createReview,
    getAllReviews
}