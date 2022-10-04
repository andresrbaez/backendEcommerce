//Models
const { ProductsInCart } = require("../models/productsInCart.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");

const addProductInCar = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const addproduct = await ProductsInCart.create({
    cartId: 1,
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
  const { producInCar } = req;

  await producInCar.update({ status: "removed" });

  res.status(204).json({ status: "success" });
});

const purchasePropductInCar = catchAsync(async (req, res, next) => {
  //Atencion en esta seccion,
  //Primero restar la quantity, actualizar el producto y la cantidad en stoke
  //calcular el precio total
  //marcar producto con status purchased
  //crear registro o bien, crear con lo anterior el modelo order
});

module.exports = {
  addProductInCar,
  updateProductIncar,
  deleteProductInCar,
  purchasePropductInCar,
};
