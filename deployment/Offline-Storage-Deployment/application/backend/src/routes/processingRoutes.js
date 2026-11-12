
const express = require("express");
const router = express.Router();

const {
    saveProcessingRecord,
    getAllRecords,
    getRecordById,
    downloadInputFile,
    getRecordOutput,
    searchRecords,
    deleteRecord
} = require("../controllers/processingController");

const {
    documentUpload,
    audioUpload
} = require("../middleware/upload");

// Get all processing records
router.get("/", getAllRecords);
router.get("/search", searchRecords);
router.get("/:id/input", downloadInputFile);
// Get processed output
router.get("/:id/output", getRecordOutput);
router.get("/:id", getRecordById);
router.delete("/:id", deleteRecord);

// Document upload API
router.post(
    "/documents",
    documentUpload.single("inputFile"),
    (req, res, next) => {
        req.body.type = "document";
        next();
    },
    saveProcessingRecord
);

// Audio upload API
router.post(
    "/audio",
    audioUpload.single("inputFile"),
    (req, res, next) => {
        req.body.type = "audio";
        next();
    },
    saveProcessingRecord
);

module.exports = router;
