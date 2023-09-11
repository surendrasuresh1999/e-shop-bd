const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user.controller.js");

router.get("/profile",userControllers.getUserProfile)
router.get("/",userControllers.getAllUsers);

module.exports = router;