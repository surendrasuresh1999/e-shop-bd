const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");


const createProduct = async(reqData)=>{
    let topLevel = await Category.findOne({name:reqData.topLavelCategory})
    
    if(!topLevel){
        topLevel = new Category({
            name:reqData.topLavelCategory,
            level:1
        })
        await topLevel.save()
    }
    // console.log("hello top",topLevel);

    let secondLevel = await Category.findOne({
        name: reqData.secondLavelCategory,
        parentCategory: topLevel._id,
    })

    if(!secondLevel){
        secondLevel = new Category({
            name:reqData.secondLavelCategory,
            parentCategory:topLevel._id,
            level:2
        })
        await secondLevel.save()

    }
    // console.log("second level",secondLevel)

    let thirdLevel = await Category.findOne({
        name: reqData.thirdLavelCategory,
        parentCategory: secondLevel._id,
    })

    if(!thirdLevel){
        thirdLevel = new Category({
            name:reqData.thirdLavelCategory,
            parentCategory:secondLevel._id,
            level:3
        })
        await thirdLevel.save()
    }
    // console.log("third level",thirdLevel)

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
    // console.log("product created successfull",product)
    return await product.save();
}

const deleteProduct = async(productId)=>{
    // console.log("product received to the backend",productId)
    // const product = await findProductById(productId);

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

    return product;
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
            return {content:[],currentPage:1,totalPages:0}
        }
    }

    // white,black,orange,red,blue the 100 line will create like this
    if(color){
        const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
        const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"),"i"):null;

        query = query.where("color").regex(colorRegex);
        
    }

    if(sizes){
        const sizeSet = new Set(sizes);
        query.query.where("sizes.name").in([...sizeSet])
        
    }

    if(minPrice && maxPrice){
        query = query.where("price").gte(minPrice).lte(maxPrice)
    }

    if(minDiscount){
        query = query.where("discountPersent").gte(minDiscount);

    }

    if(stock){
        if(stock === "in_stock"){
            query = query.where("quantity").gt(0);
        }
        else if(stock === "out_of_stock"){
            query = query.where("quantity").gt(1);
        }
    }

    if(sort){
        const sortDirection = sort === "price_hight" ? -1 : 1;
        query = query.sort({discountedPrice:sortDirection})
    }

    const totalProducts = await Product.countDocuments(query);
  
    const skip = (pageNumber - 1) * pageSize;

    query = query.skip(skip).limit(pageSize);

    const products = await query.exec();

    const totalPages = Math.ceil(totalProducts/pageSize);
   

    return {content:products,currentPage:1,totalPages}

}

const createMultipleProducts = async(products) => {
    for(let product of products){
        await createProduct(product);
    }
}

module.exports ={
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProducts,
}