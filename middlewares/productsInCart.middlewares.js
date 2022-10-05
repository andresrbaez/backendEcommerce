//Models
const { ProductsInCart } = require("../models/productsInCart.model");
const { Cart } = require("../models/cart.model");
const { Product } = require("../models/product.model");
const { Order } = require("../models/order.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

//Functions of endpoints
const cartExist = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const userId = sessionUser.id;

  const cartId = await Cart.findOne({ where: { userId, status: "active" } });

  if (!cartId) {
    await Cart.create({
      userId,
    });
  } else {
    return next(new AppError("you have another cart active", 400));
  }

  req.cartId = cartId;
  next();
});

const maxItemsLimit = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const id = productId;
  const product = await Product.findOne({ where: { id } });

  if (quantity > product.quantity) {
    return next(new AppError("Quantity not available", 400));
  }

  next();
});

const productAddExist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await ProductsInCart.findOne({ where: { productId } });

  if (product) {
    return next(new AppError("Product already exist", 400));
  }

  const productRemoved = product.findOne({
    where: { productId, status: "removed" },
  });

  if (productRemoved) {
    await productRemoved.update({ status: "active" });
  }

  next();
});

const updateProductStatus = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;

  if (quantity === 0) {
    return await ProductsInCart.update({ status: "removed" });
  }

  next();
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.param;

  const productInCar = await ProductsInCart.findOne({
    where: { productId },
  });

  if (!productInCar) {
    return next(new AppError("Product in car not found", 400));
  }

  // req.anyPropName = 'anyValue'
  req.productInCar = productInCar;
  next();
});

const buyProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const userId = sessionUser.id;

  const cartExist = await Cart.findOne({
    where: { userId, status: "active" },
    include: {
      model: ProductsInCart,
    },
  });

  if (!cartExist) {
    return next(new AppError("You not have a cart with products", 400));
  }

  const productId = cartExist.productId;
  const lastQuantity = await Product.findOne({ where: { productId } });
  const newQuantity = cartExist.quantity - lastQuantity.quantity;

  await lastQuantity.update({ quantity: newQuantity });

  const totalPrice = cartExist.quantity * lastQuantity.price;

  await ProductsInCart.update({ status: "purchased" });
  await cartExist.update({ status: "purchased" });

  req.totalPrice = totalPrice;
  req.cartExist = cartExist;
  next();
});

module.exports = {
  cartExist,
  maxItemsLimit,
  productAddExist,
  updateProductStatus,
  deleteProduct,
  buyProducts,
};
