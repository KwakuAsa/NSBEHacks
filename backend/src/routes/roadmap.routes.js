const express = require("express");
const router = express.Router();
const { generateRoadmap, getAllRoadMaps, completeTask } = require("../controllers/roadmap.controller");

router.post("/generate", generateRoadmap);
router.get("/:userId", getAllRoadMaps);
router.post("/:roadmapId/tasks/:taskId/complete", completeTask);


module.exports = router;