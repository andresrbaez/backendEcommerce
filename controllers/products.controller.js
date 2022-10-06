//Models
const { Product } = require("../models/product.model");
const { Categories } = require("../models/categories.model");
const { User } = require("../models/user.model");
const { ProductImg } = require("../models/productImg.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");
const {
  storage,
  uploadProductImgs,
  getProductImgsUrls,
} = require("../utils/firebase.util");
const { AppError } = require("../utils/appError.util");

const createProduct = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { title, description, quantity, price, categoryId } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    categoryId,
    price,
    userId: sessionUser.id,
  });

  // const { title, description, price, categoryId, quantity } = req.body;
  // const { category } = req;

  // if (categoryId === category.id) {
  //   const newProduct = await Product.create({
  //     title,
  //     description,
  //     price,
  //     categoryId,
  //     quantity,
  //   });
  // } else {
  //   return next(new AppError("Category not found", 400));
  // }

  await uploadProductImgs(req.files, newProduct.id);

  res.status(201).json({
    status: "success",
    data: { newProduct },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: "active" },
    include: [
      { model: Categories, attributes: ["name"] },
      { model: User, attributes: ["username", "email"] },
      {
        model: ProductImg,
      },
    ],
  });

  const productsWithImgs = await getProductImgsUrls(products);

  res.status(200).json({
    status: "success",
    data: { products: productsWithImgs },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;
  await Product.findOne({});

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, quantity, price } = req.body;

  await product.update({
    title,
    description,
    quantity,
    price,
  });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const deleteProducts = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: "removed" });

  res.status(200).json({ status: "success" });
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

  if (name.length === 0) {
    return next(new AppError("Name cannot be empty", 400));
  }

  const newCategory = await Categories.create({ name });

  res.status(201).json({
    status: "success",
    data: { newCategory },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { newName } = req.body;
  const { id } = req.params;

  const category = await Categories.findOne({
    where: { id, status: "active" },
  });

  if (!category) {
    return next(new AppError("Category does not exits with given id", 404));
  }

  if (newName.length === 0) {
    return next(new AppError("The updated name cannot be empty", 400));
  }

  await category.update({ name: newName });

  res.status(200).json({ status: "success" });
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
