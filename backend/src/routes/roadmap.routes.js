const express = require("express");
const router = express.Router();
const { generateRoadmap, getAllRoadMaps } = require("../controllers/roadmap.controller");

router.post("/generate", generateRoadmap);
router.get("/:userId", getAllRoadMaps);


module.exports = router;