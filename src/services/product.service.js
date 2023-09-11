const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");


const createProduct = async(reqData)=>{
    let topLevel = await Category.findOne({name:reqData.topLevelCategory})

    if(!topLevel){
        topLevel = new Category({
            name:reqData.topLevelCategory,
            lavel:1
        })
    }

    let secondLevel = await Category.findOne({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id,
    })

    if(!secondLevel){
        secondLevel = new Category({
            name:reqData.secondLevelCategory,
            parentCategory:topLevel._id,
            level:2
        })
    }

    let thirdLevel = await Category.findOne({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
    })

    if(!thirdLevel){
        thirdLevel = new Category({
            name:reqData.thirdLevelCategory,
            parentCategory:secondLevel._id,
            level:3
        })
    }

    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrice: reqData.discountedPrice,
        discountPersent: reqData.discountPersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: reqData.price,
        sizes: reqData.size,
        quantity: reqData.quantity,
        category: thirdLevel._id,
    })

    return await product.save();
}

const deleteProduct = async(productId)=>{
    const product = await findProductById(productId);

    await Product.findByIdAndDelete(productId);

    return "Product deleted Successfully";

}

const updateProduct = async(productId,reqData) => {
    return await Product.findByIdAndUpdate(productId,reqData);
}

const findProductById = async(productId) => {
    const product = await Product.findById(productId).populate("category").exec();
    if(!product){
        throw new Error("Product not found with id: "+ productId);
    }

    return prodcut;
}

const getAllProducts = async(reqQuery) => {
    let {category,color,sizes,minPrice,maxPrice,minDiscount,sort,stock,pageNumber,pageSize} = reqQuery;

    pageSize = pageSize || 10;
    
    let query = Product.find().populate("category");

    if(category){
        const existCategory = await Category.findOne({name:category});
        if(existCategory){
            query = query.where("category").equals(existCategory._id);

        }
        else{
            return {conten:[],currentPage:1,totalPages:0}
        }
    }

    // white,black,orange,red,blue the 100 line will create like this
    if(color){
        const colorSet = new Set(color.split(",").map(color => color.trim().toLowercase()));
        const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"),"i"):null;

        query = query.where("color").regex(colorRegex);
        
    }
}