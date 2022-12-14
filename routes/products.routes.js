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

const { protectSession } = require("../middlewares/auth.middlewares");
const {
  createProductValidator,
  createCategoriesValidator,
} = require("../middlewares/validators.middlewares");

// Utils
const { upload } = require("../utils/multer.util");

const productsRouter = express.Router();

//Products endpoints
productsRouter.get("/categories", getAllCategories);
productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", productExist, getProductById);

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.post(
  "/",
  upload.array("productImg", 5),
  createProductValidator,
  createProduct
);

productsRouter.patch("/:id", categoryExist, productExist, updateProduct);

productsRouter.delete("/:id", productExist, deleteProducts);

productsRouter.post("/categories", createCategoriesValidator, newCategory);

productsRouter.patch("/categories/:id", categoryExist, updateCategory);

module.exports = { productsRouter };
