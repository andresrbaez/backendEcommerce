const express = require("express");

//Controllers
const {
  addProductInCar,
  updateProductIncar,
  deleteProductInCar,
  purchasePropductInCar,
} = require("../controllers/productsInCart.controller");

//Middlewares
const {
  deleteProduct,
  buyProducts,
} = require("../middlewares/productsInCart.middlewares");
const { protectSession } = require("../middlewares/auth.middlewares");

const productsInCartRouter = express.Router();

productsInCartRouter.use(protectSession);

//Products in cart endpoints
productsInCartRouter.post("/add-product", addProductInCar);
productsInCartRouter.patch("/update-product", updateProductIncar);
productsInCartRouter.delete("/:id", deleteProduct, deleteProductInCar);
productsInCartRouter.post("/purchase", purchasePropductInCar);

module.exports = { productsInCartRouter };
