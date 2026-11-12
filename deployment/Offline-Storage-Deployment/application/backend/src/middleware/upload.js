
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Configure storage for uploaded files
function createStorage(folderName) {
    const destination = path.join(
        __dirname,
        "../../uploads",
        folderName
    );

    fs.mkdirSync(destination, { recursive: true });

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },

        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            const uniqueName = crypto.randomUUID() + extension;

            cb(null, uniqueName);
        }
    });
}

// Document uploads
const documentUpload = multer({
    storage: createStorage("documents"),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

// Audio uploads
const audioUpload = multer({
    storage: createStorage("audio"),
    limits: {
        fileSize: 500 * 1024 * 1024
    }
});

module.exports = {
    documentUpload,
    audioUpload
};
