const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
// const errorHandler = require("./middleware/error.middleware");


const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

//app.use(errorHandler);no

module.exports = app;