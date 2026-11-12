
const ProcessingRecord = require("../models/ProcessingRecord");
const crypto = require("crypto");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Helper: safely delete an uploaded file
async function deleteUploadedFile(req) {
    if (req.file) {
        try {
            await fs.promises.unlink(req.file.path);
            console.log("Uploaded file deleted successfully");
        } catch (error) {
            console.error("File cleanup failed:", error.message);
        }
    }
}

// Save processing record
exports.saveProcessingRecord = async (req, res) => {
    try {
        const {
            sourceJobId,
            type,
            outputFormat,
            outputData
        } = req.body;

        // Check uploaded file
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Please upload an input file"
            });
        }

        // Validate processing type
        if (!["document", "audio"].includes(type)) {
            await deleteUploadedFile(req);

            return res.status(400).json({
                status: "error",
                message: "Type must be document or audio"
            });
        }

        // Validate output data
        if (!outputFormat || outputData === undefined) {
            await deleteUploadedFile(req);

            return res.status(400).json({
                status: "error",
                message: "Output format and output data are required"
            });
        }

        let parsedOutputData = outputData;

        // Convert JSON string into JavaScript object
        if (outputFormat === "json") {
            try {
                parsedOutputData = JSON.parse(outputData);
            } catch (error) {
                await deleteUploadedFile(req);

                return res.status(400).json({
                    status: "error",
                    message: "Invalid JSON output data"
                });
            }
        }

        

        const processingId = crypto.randomUUID();

        const record = await ProcessingRecord.create({
            processingId,
            sourceJobId,
            type,
            originalFilename: req.file.originalname,
            inputPath: req.file.path,
            outputFormat,
            outputData: parsedOutputData,
            status: "completed"
        });

        res.status(201).json({
            status: "success",
            message: "File and output saved successfully",
            data: record
        });

    } catch (error) {
        console.error("Save processing error:", error.message);

        await deleteUploadedFile(req);

        return res.status(500).json({
            status: "error",
            message: "Failed to save processing record"
        });
    }
};

// Get all processing records
exports.getAllRecords = async (req, res) => {
    try {
        const records = await ProcessingRecord.find()
            .sort({ createdAt: -1 });

        res.json({
            status: "success",
            totalRecords: records.length,
            data: records
        });

    } catch (error) {
        console.error("Fetch error:", error);

        res.status(500).json({
            status: "error",
            message: "Unable to fetch records"
        });
    }
};

// Get one record by ID
exports.getRecordById = async (req, res) => {
    try {
        const record = await ProcessingRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                status: "error",
                message: "Record not found"
            });
        }

        res.json({
            status: "success",
            data: record
        });

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Invalid record ID"
        });
    }
};

// Download original input file
exports.downloadInputFile = async (req, res) => {
    try {
        const record = await ProcessingRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                status: "error",
                message: "Record not found"
            });
        }

        const filePath = path.resolve(record.inputPath);

        // Ensure the file is inside the uploads folder
        const uploadsDirectory = path.resolve(__dirname, "../../uploads");

        if (
            !filePath.startsWith(uploadsDirectory + path.sep) ||
            !fs.existsSync(filePath)
        ) {
            return res.status(404).json({
                status: "error",
                message: "Original file not found"
            });
        }

        res.download(filePath, record.originalFilename);

    } catch (error) {
        console.error("Download error:", error);

        res.status(500).json({
            status: "error",
            message: "Unable to download file"
        });
    }
};

// Get processed output of one record
exports.getRecordOutput = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid record ID"
            });
        }

        const record = await ProcessingRecord.findById(id);

        if (!record) {
            return res.status(404).json({
                status: "error",
                message: "Processing record not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                processingId: record.processingId,
                type: record.type,
                outputFormat: record.outputFormat,
                outputData: record.outputData,
                status: record.status,
                processedAt: record.processedAt
            }
        });

    } catch (error) {
        console.error("Get output error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to retrieve processed output"
        });
    }
};

// Search and filter processing records
exports.searchRecords = async (req, res) => {
    try {
        const {
    search,
    type,
    status,
    fromDate,
    toDate,
    sort = "newest",
    page = 1,
    limit = 10
} = req.query;

        const filter = {};
        // Validate type
if (type && !["document", "audio"].includes(type)) {
    return res.status(400).json({
        status: "error",
        message: "Invalid type. Allowed values: document, audio"
    });
}

// Validate status
if (status && !["completed", "failed"].includes(status)) {
    return res.status(400).json({
        status: "error",
        message: "Invalid status. Allowed values: completed, failed"
    });
}

// Validate sorting
if (!["newest", "oldest"].includes(sort)) {
    return res.status(400).json({
        status: "error",
        message: "Invalid sort. Allowed values: newest, oldest"
    });
}
        
// Filter records by processing date
if (fromDate || toDate) {
    filter.processedAt = {};

    if (fromDate) {
        const startDate = new Date(fromDate);

        if (isNaN(startDate.getTime())) {
            return res.status(400).json({
                status: "error",
                message: "Invalid fromDate"
            });
        }

        filter.processedAt.$gte = startDate;
    }

    if (toDate) {
        const endDate = new Date(toDate);

        if (isNaN(endDate.getTime())) {
            return res.status(400).json({
                status: "error",
                message: "Invalid toDate"
            });
        }

        // Include the entire ending date
        endDate.setUTCHours(23, 59, 59, 999);

        filter.processedAt.$lte = endDate;
    }

    if (
        fromDate &&
        toDate &&
        new Date(fromDate) > new Date(toDate)
    ) {
        return res.status(400).json({
            status: "error",
            message: "fromDate cannot be after toDate"
        });
    }
}


        // Filter by document or audio
        if (type && ["document", "audio"].includes(type)) {
            filter.type = type;
        }

        // Filter by processing status
        if (status && ["completed", "failed"].includes(status)) {
            filter.status = status;
        }

        // Search by filename or processing ID
        if (search) {
            const safeSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { originalFilename: { $regex: safeSearch, $options: "i" } },
                { processingId: { $regex: safeSearch, $options: "i" } },
                { sourceJobId: { $regex: safeSearch, $options: "i" } }
            ];
        }

        // Validate page
if (!Number.isInteger(Number(page)) || Number(page) < 1) {
    return res.status(400).json({
        status: "error",
        message: "Page must be a positive integer"
    });
}

// Validate limit
if (
    !Number.isInteger(Number(limit)) ||
    Number(limit) < 1 ||
    Number(limit) > 100
) {
    return res.status(400).json({
        status: "error",
        message: "Limit must be an integer between 1 and 100"
    });
}

const currentPage = Number(page);
const pageLimit = Number(limit);
        const totalRecords = await ProcessingRecord.countDocuments(filter);

        const records = await ProcessingRecord.find(filter)
            .sort({ createdAt: sort === "oldest" ? 1 : -1 })
            .skip((currentPage - 1) * pageLimit)
            .limit(pageLimit);

        res.status(200).json({
            status: "success",
            totalRecords,
            currentPage,
            totalPages: Math.ceil(totalRecords / pageLimit),
            data: records
        });

    } catch (error) {
        console.error("Search error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Unable to search records"
        });
    }
};
// Delete processing record and its original file
exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid record ID"
            });
        }

        // Find record
        const record = await ProcessingRecord.findById(id);

        if (!record) {
            return res.status(404).json({
                status: "error",
                message: "Record not found"
            });
        }

        // Delete original uploaded file safely
        const filePath = path.resolve(record.inputPath);
        const uploadsDirectory = path.resolve(__dirname, "../../uploads");

        if (
            filePath.startsWith(uploadsDirectory + path.sep) &&
            fs.existsSync(filePath)
        ) {
            await fs.promises.unlink(filePath);
        }

        // Delete database record
        await ProcessingRecord.findByIdAndDelete(id);

        return res.status(200).json({
            status: "success",
            message: "Record and original file deleted successfully"
        });

    } catch (error) {
        console.error("Delete error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Unable to delete record"
        });
    }
};
