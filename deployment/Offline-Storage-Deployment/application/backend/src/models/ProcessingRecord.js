const mongoose = require("mongoose");

const processingRecordSchema = new mongoose.Schema(
    {
        processingId: {
            type: String,
            required: true,
            unique: true
        },

        sourceJobId: {
            type: String,
            default: null
        },

        type: {
            type: String,
            enum: ["document", "audio"],
            required: true
        },

        originalFilename: {
            type: String,
            required: true
        },

        inputPath: {
            type: String,
            required: true
        },

        outputFormat: {
            type: String,
            required: true
        },

        outputData: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        status: {
            type: String,
            enum: ["completed", "failed"],
            default: "completed"
        },

        processedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ProcessingRecord",
    processingRecordSchema
);