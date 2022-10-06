//Models
const { ProductsInCart } = require("../models/productsInCart.model");
const { Cart } = require("../models/cart.model");
const { Order } = require("../models/order.model");
const { Product } = require("../models/product.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const addProductInCar = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, quantity } = req.body;

  // Validate that the requested qty doesnt exceed the available qty
  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("Product does not exists", 400));
  } else if (quantity > product.quantity) {
    return next(
      new AppError(`This product only has ${product.quantity} items.`, 400)
    );
  }

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    // Assign cart to user (create cart)
    const newCart = await Cart.create({ userId: sessionUser.id });

    await ProductsInCart.create({ cartId: newCart.id, productId, quantity });
  } else {
    // Cart already exists
    const productInCart = await ProductsInCart.findOne({
      where: { productId, cartId: cart.id },
    });

    if (!productInCart) {
      // Add product to current cart
      await ProductsInCart.create({ cartId: cart.id, productId, quantity });
    } else if (productInCart.status === "active") {
      return next(
        new AppError("This product is already active in your cart", 400)
      );
    } else if (productInCart.status === "removed") {
      await productInCart.update({ status: "active", quantity });
    }
  }

  res.status(200).json({ status: "success" });

  // });
});

const updateProductIncar = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, newQty } = req.body;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    return next(new AppError("You do not have a cart active.", 400));
  }

  // Validate that requested qty doesnt exceed the available qty
  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("Product does not exists", 404));
  } else if (newQty > product.quantity) {
    return next(
      new AppError(`This product only has ${product.quantity} items.`, 400)
    );
  } else if (0 > newQty) {
    return next(new AppError("Cannot send negative values", 400));
  }

  const productInCart = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId, status: "active" },
  });

  if (!productInCart) {
    return next(new AppError("This product is not in your cart", 404));
  }

  if (newQty === 0) {
    // Remove product from cart
    await productInCart.update({ quantity: 0, status: "removed" });
  } else if (newQty > 0) {
    await productInCart.update({ quantity: newQty });
  }

  res.status(200).json({
    status: "success",
  });
  // const { productId, quantity } = req.body;

  // const updateProduct = await ProductsInCart.update({
  //   productId,
  //   quantity,
  // });

  // res.status(200).json({
  //   status: 'success',
  //   data: { updateProduct },
  // });
});

const deleteProductInCar = catchAsync(async (req, res, next) => {
  const { productInCar } = req;

  await productInCar.update({ quantity: 0, status: "removed" });

  res.status(204).json({ status: "success" });
});

const purchasePropductInCar = catchAsync(async (req, res, next) => {
  //const { neworder } = req;
  /*const { sessionUser } = req;
  const { productId } = req;
  const { lastQuantity } = req;
  const { cartExist } = req;

  const totalBuy = productId.quantity * lastQuantity.price;

  const newOrder = await Order.create({
    userId: sessionUser.id,
    cartId: cartExist.id,
    totalprice: totalBuy,
  });

  res.status(204).json({
    status: "success",
    data: { newOrder },
  });*/
  // -------------- new ofrm ------------------- //
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
    include: {
      model: ProductsInCart,
      status: "active",
      include: { model: Product },
    },
  });

  if (!cart) {
    return next(new AppError("This user doesn't have a cart", 400));
  }

  let totalPrice = 0;
  const cartPromises = cart.productInCarts.map(async (ProductsInCart) => {
    await ProductsInCart.update({ status: "purchased" });

    const productPrice = ProductsInCart.product.price * ProductsInCart.quantity;

    totalPrice += productPrice;

    const newQty = ProductsInCart.product.quantity - ProductsInCart.quantity;

    await productInCarts.product.update({ quantity: newQty });
  });

  await Promise.all(cartPromises);

  await cart.update({ status: "purchase" });

  const newOrder = await Order.create({
    cartId: cart.id,
    userId: sessionUser.id,
    totalPrice,
  });

  res.status(200).json({
    status: "success",
    data: { newOrder },
  });
});

module.exports = {
  addProductInCar,
  updateProductIncar,
  deleteProductInCar,
  purchasePropductInCar,
};
