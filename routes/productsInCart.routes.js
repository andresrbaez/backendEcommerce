const express = require("express");

//Controllers
const {
  addProductInCar,
  updateProductIncar,
  deleteProductInCar,
  purchasePropductInCar,
} = require("../controllers/productsInCart.controller");

//Middlewares
const {} = require("../middlewares/productsInCart.middlewares");
const {} = require("../middlewares/auth.middlewares");
const {} = require("../middlewares/validators.middlewares");

const productsInCartRoutes = express.Router();

//Products in cart endpoints
productsInCartRoutes.post("/add-product", addProductInCar);
productsInCartRoutes.patch("/update-product", updateProductIncar);
productsInCartRoutes.delete("/:productid", deleteProductInCar);
productsInCartRoutes.post("/purchase", purchasePropductInCar);

module.exports = { productsInCartRoutes };
