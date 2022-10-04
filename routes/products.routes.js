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

// Utils
const { upload } = require('../utils/multer.util')

const productsRouter = express.Router();

// Protecting below endpoints
productsRouter.use(protectSession);


//Products endpoints
productsRouter.post("/", upload.array('productImg', 5), createProduct);

productsRouter.get("/", getAllProducts);

productsRouter.get("/:id", getProductById);

productsRouter.patch("/:id", updateProduct);

productsRouter.delete("/:id", deleteProducts);

productsRouter.get("/categories", getAllCategories);

productsRouter.post("/categories", newCategory);

productsRouter.patch("/categories", updateCategory);


module.exports = { productsRouter };
