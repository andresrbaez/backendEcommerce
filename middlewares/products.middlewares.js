//Models
const { Product } = require("../models/product.model");
const { Categories } = require("../models/categories.model");

//utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const productExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, status: 'active' },
  });

  //  If user doesn't exist, send error message
  if (!product) {
    return next(new AppError("Could not find product by given id", 404));
  }
  // req.anyPropName = 'anyValue'
  req.product = product;
  next();
});

const categoryExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Categories.findOne({
    where: { id },
  });

  //  If user doesn't exist, send error message
  if (!category) {
    return next(new AppError("Category not found", 400));
  }
  // req.anyPropName = 'anyValue'
  req.category = category;
  next();
});

module.exports = {
  productExist,
  categoryExist,
};
