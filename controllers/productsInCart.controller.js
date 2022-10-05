//Models
const { ProductsInCart } = require("../models/productsInCart.model");
const { Cart } = require("../models/cart.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");

const addProductInCar = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cartId } = req;

  const addproduct = await ProductsInCart.create({
    cartId: cartId.id,
    productId,
    quantity,
  });

  res.status(201).json({
    status: "success",
    data: { addproduct },
  });
});

const updateProductIncar = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const updateProduct = await ProductsInCart.update({
    productId,
    quantity,
  });

  res.status(200).json({
    status: "success",
    data: { updateProduct },
  });
});

const deleteProductInCar = catchAsync(async (req, res, next) => {
  const { productInCar } = req;

  await productInCar.update({ quantity: 0, status: "removed" });

  res.status(204).json({ status: "success" });
});

const purchasePropductInCar = catchAsync(async (req, res, next) => {
  const { neworder } = req;
  const { sessionUser } = req;
  const { totalPrice } = req;
  const { cartExist } = req;

  await neworder.create({
    userId: sessionUser.id,
    cartId: cartExist.id,
    totalprice: totalPrice,
  });
});

module.exports = {
  addProductInCar,
  updateProductIncar,
  deleteProductInCar,
  purchasePropductInCar,
};
