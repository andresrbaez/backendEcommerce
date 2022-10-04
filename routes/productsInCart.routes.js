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

const productsInCartRouter = express.Router();

//Products in cart endpoints
productsInCartRouter.post("/add-product", addProductInCar);
productsInCartRouter.patch("/update-product", updateProductIncar);
productsInCartRouter.delete("/:productid", deleteProductInCar);
productsInCartRouter.post("/purchase", purchasePropductInCar);

module.exports = { productsInCartRouter };
