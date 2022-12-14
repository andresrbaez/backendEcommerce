const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Product } = require("../models/product.model");
const { Order } = require("../models/order.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const getAllUsers = catchAsync(async (req, res, next) => {

  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (role !== "admin" && role !== "normal") {
    return next(new AppError("Invalid role", 400));
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role
  });

  // Remove password from response
  newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user } = req;

  await user.update({ email, password });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or password doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate Json Web Token (payload, secretOrPrivateKey, options)
  // Gen random jwt sign:
  // require('crypto').randomBytes(64).toString('hex')
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});

const getAllProductsCreated = catchAsync(async (req, res, next) => {
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

const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll({
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findAll({
    where: { id, status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  getAllProductsCreated,
  getAllOrders,
  getOrderById,
};
