const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
// const errorHandler = require("./middleware/error.middleware");


const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//app.use("/api/resumes", resumeRoutes);
//app.use(errorHandler);no

module.exports = app;