const userService = require("../services/user.service.js");
const AddressModel = require("../models/address.model.js")
const getUserProfile = async(req,res)=>{
    try {
        const jwt = req.headers.authorization?.split(" ")[1];

        if(!jwt){
            return res.status(404).send({error:"token not found"})
        }
        const user = await userService.getUserProfileByToken(jwt);
        const addressData = await AddressModel.find();
        const userFullInformation = {user:user,address:addressData}
        // console.log("addressData information========>",userFullInformation)
        return res.status(200).send(userFullInformation);
    } 
    catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const getAllUsers = async(req,res) => {
    try {
        const users = await userService.getAllUsers()
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = {
    getUserProfile,
    getAllUsers
};