'use strict'

const firebase = require('firebase');
const config = require('../config.json');
const os = require('os');
const path = require('path');
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const fs = require('fs');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: config.storage_config.projectId,
    keyFilename: config.storage_config.keyFilename
});
const bucket = storage.bucket(config.database_config.storageBucket)

/**
 * Upload image to firebase storage
 */
exports.uploadImageToStorage = function (req, res, next) {
    cors(req, res, function () {
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = {
                file: filepath,
                filename: filename,
                type: mimetype
            }
            file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on('field', function (fieldname, val) {
            Object.assign(uploadData, { albumName: val });
        });

        busboy.on('finish', function () {
            let options = {
                uploadType: 'media',
                destination: 'media/' + uploadData.albumName + '/' + removeSpecialCharacters(uploadData.filename) + '/image',
                metadata: {
                    metadata: {
                        contentType: uploadData.type
                    }
                }
            };
            bucket.upload(uploadData.file, options, function (err, upload) {
                if (err) {
                    console.error("Error Uploading Image - " + err);
                    return res.status(500).json({ error: err });
                }
                return res.status(200).json({
                    message: "Image: " + uploadData.filename + " uploaded successfully!"
                });
            });
        });

        busboy.end(req.rawBody);
    })
}


/**
 * Upload video to firebase storage
 */
exports.uploadVideoToStorage = function (req, res, next) {
    cors(req, res, function () {
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = {
                file: filepath,
                filename: filename,
                type: mimetype
            }
            file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on('field', function (fieldname, val) {
            Object.assign(uploadData, { albumName: val });
        });

        busboy.on('finish', function () {
            let options = {
                uploadType: 'media',
                destination: 'media/' + uploadData.albumName + '/' + removeSpecialCharacters(uploadData.filename) + '/video',
                metadata: {
                    metadata: {
                        contentType: uploadData.type
                    }
                }
            };
            bucket.upload(uploadData.file, options, function (err, upload) {
                if (err) {
                    console.error("Error Uploading Video - " + err);
                    return res.status(500).json({ error: err });
                }
                return res.status(200).json({
                    message: "Video: " + uploadData.filename + " uploaded successfully!"
                });
            });
        });

        busboy.end(req.rawBody);
    })
}

/**
 * Remove all special characters from name
 * @param {String} name 
 */
function removeSpecialCharacters(name) {
    return name.replace(/[\W_]/g, "-");
}