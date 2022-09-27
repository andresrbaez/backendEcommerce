// Models
const { User } = require('./user.model');
const { Cart } = require('./cart.model');
const { Categories } = require('./categories.model');
const { Order } = require('./order.model');
const { Product } = require('./product.model');
const { ProductImg } = require('./productImg.model');
const { ProductsInCart } = require('./productsInCart.model');

const initModels = () => {
  // 1 User <---> M Order
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User);

  // 1 User <---> M Products
  User.hasMany(Product, { foreignKey: 'userId' });
  Product.belongsTo(User);

  // 1 Product <---> M ProductImg
  Product.hasMany(ProductImg, { foreignKey: 'productId' });
  ProductImg.belongsTo(Product);

  // 1 ProductsInCart <---> M ProductImg
  ProductsInCart.hasMany(ProductImg, { foreignKey: 'productId' });
  ProductImg.belongsTo(ProductsInCart);

  // 1 Cart <---> M ProductsInCart
  Cart.hasMany(ProductsInCart, { foreignKey: 'cartId' });
  ProductsInCart.belongsTo(Cart);

  // 1 Product <---> 1 Categories
  Product.hasOne(Categories, { foreignKey: 'categoryId' });
  Categories.belongsTo(Product);

  // 1 Order <---> 1 Cart
  Order.hasOne(Cart, { foreignKey: 'cartId' });
  Cart.belongsTo(Order);

  // 1 User <---> 1 Cart
  User.hasOne(Cart, { foreignKey: 'userId' });
  Cart.belongsTo(User);
};

module.exports = { initModels };
