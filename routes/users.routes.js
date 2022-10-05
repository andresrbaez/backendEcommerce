const express = require("express");
//const { body, validationResult } = require('express-validator');

// Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  getAllProductsCreated,
  getAllOrders,
  getOrderById,
} = require("../controllers/users.controller");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares");
const {
  protectSession,
  protectUsersAccount,
  protectAdmin,
} = require("../middlewares/auth.middlewares");
const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");

const usersRouter = express.Router();

// Users endpoints
usersRouter.post("/", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

// Users endpoints
usersRouter.get("/me", getAllProductsCreated);

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.get("/orders", );

usersRouter.get("/orders/:id", );


module.exports = { usersRouter };
