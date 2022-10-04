const express = require("express");

// Routers
const { usersRouter } = require("./routes/users.routes");
const { productsRouter } = require("./routes/products.routes");
const { productsInCartRouter } = require("./routes/productsInCart.routes");

// Controllers
const { globalErrorHandler } = require("./controllers/error.controller");

// Init our Express app
const app = express();

// Enable Express app to receive JSON data
app.use(express.json()); // Middleware

// Add security headers
app.use(helmet())

// Compress response
app.use(compression())

if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
} else if (process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'))
}

// Define endpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} doesn't exists in our server`,
  });
});

module.exports = { app };
