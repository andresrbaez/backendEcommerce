const { body, validationResult } = require("express-validator");

// Utils
const { AppError } = require("../utils/appError.util");

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join(". ");

    return next(new AppError(message, 400));
  }
  next();
};

const createUserValidators = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email").isEmail().withMessage("Must provide a valid email"),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  checkValidations,
];

const createProductValidator = [
  body("title")
    .isString()
    .withMessage("title must be a string")
    .notEmpty()
    .withMessage("title cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Title not exceed the 20 characters"),
  body("description")
    .isString()
    .withMessage("description must be a string")
    .notEmpty()
    .withMessage("description cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title not exceed the 200 characters"),
  body("price")
    .isNumeric()
    .withMessage("price must be a number")
    .notEmpty()
    .withMessage("price cannot be empty"),
  body("categoryId")
    .isNumeric()
    .withMessage("categoryId must be a number")
    .notEmpty()
    .withMessage("categoryId cannot be empty"),
  body("quantity")
    .isNumeric()
    .withMessage("quantity must be a number")
    .notEmpty()
    .withMessage("quantity cannot be empty"),
];

const createCategoriesValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 15 })
    .withMessage("name not exceed the 15 characters"),
];

module.exports = {
  createUserValidators,
  createProductValidators,
  createCategoriesValidator,
};
