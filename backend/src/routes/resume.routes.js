const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const {
    uploadResume,
    listResumes,
    getResumeDownloadUrl,
    setCurrentResume
} = require("../controllers/resume.controller");

//upload a resume file for a user
router.post("/:userId", upload.single("resume"), uploadResume);

//list all resumes for a user
router.get("/:userId", listResumes);

//set one resume as current
router.patch("/:userId/current/:resumeId", setCurrentResume);

//get signed URL to download a resume
router.get("/:userId/download/:resumeId", getResumeDownloadUrl);

module.exports = router;