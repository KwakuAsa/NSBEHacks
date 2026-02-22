const express = require("express");
const router = express.Router();
const { runExplore, getExploreResult } = require("../controllers/explore.controller");

router.post("/run", runExplore);
router.get("/:sessionId", getExploreResult);

module.exports = router;