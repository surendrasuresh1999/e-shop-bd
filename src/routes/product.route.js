const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller.js");
const authenticate = require("../middleware/authenticate.js");

router.get("/", authenticate, productController.getAllProducts);
router.get("/:id", authenticate, productController.findProductById);

module.exports = router;