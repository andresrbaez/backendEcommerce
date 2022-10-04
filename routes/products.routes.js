const express = require("express");

//controllers
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProducts,
  getAllCategories,
  newCategory,
  updateCategory,
} = require("../controllers/products.controller");

//middlewares
const {
  productExist,
  categoryExist,
} = require("../middlewares/products.middlewares");
const {} = require("../middlewares/auth.middlewares");
const {} = require("../middlewares/validators.middlewares");

const productsRoutes = express.Router();
//Products endpoints
productsRoutes.post("/", createProduct);
productsRoutes.get("/", getAllProducts);
productsRoutes.get("/:id", getProductById);
productsRoutes.patch("/:id", updateProduct);
productsRoutes.delete("/:id", deleteProducts);
productsRoutes.get("/categories", getAllCategories);
productsRoutes.post("/categories", newCategory);
productsRoutes.patch("/categories", updateCategory);
module.exports = { productsRoutes };
