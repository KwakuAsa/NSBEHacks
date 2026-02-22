const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth.routes");
// const errorHandler = require("./middleware/error.middleware");

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

//app.use(errorHandler);no

module.exports = app;