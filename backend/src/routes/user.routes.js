const express = require("express");
const router = express.Router();
const { updateUserProfile } = require("../controllers/user.controller");

router.patch("/:id", updateUserProfile);

module.exports = router;