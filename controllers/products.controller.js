//Models
const { Product } = require("../models/product.model");
const { Categories } = require("../models/categories.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, categoryId, quantity } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    price,
    categoryId,
    quantity,
  });

  res.status(201).json({
    status: "success",
    data: { newProduct },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOne({
    where: { id },
  });

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;
  const { product } = req;

  await product.update({
    title,
    description,
    price,
    quantity,
  });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const deleteProducts = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Categories.findAll({
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

const newCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const categorie = await Categories.create({ name });

  res.status(201).json({
    status: "success",
    data: { categorie },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { category } = req;

  await category.update({ name });

  res.status(200).json({
    status: "success",
    data: { category },
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProducts,
  getAllCategories,
  newCategory,
  updateCategory,
};
