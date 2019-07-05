'use strict'

const config = require('../config.json')
const request = require('request')
const crypto = require('crypto')
const EasyARSDK = require('easyar')
const SlackWorker = require('./slackWorker')

var easyar_config
var farmer
if (process.env.GCP_PROJECT == "poppeg-95e96") {
    easyar_config = config.easyar_config
    farmer = EasyARSDK.farmer(easyar_config.serverUrl, easyar_config.cloudKey, easyar_config.cloudSecret)
} else if (process.env.GCP_PROJECT == "poppeg-staging") {
    easyar_config = config.staging_easyar_config
    farmer = EasyARSDK.farmer(easyar_config.serverUrl, easyar_config.cloudKey, easyar_config.cloudSecret)
}

/**
 * Upload image to EasyAR in base64 formats
 */
exports.uploadImageToEasyAR = function (req, res, next) {
    farmer.createTarget({
        image: req.body.image,
        name: req.body.name,
        size: "20",
        meta: "",
        type: "ImageTarget"
    }).then(function (response) {
        console.log("Uploaded: " + response.result.targetId)
        return res.status(200).json({ success: "Image is successfully uploaded to EasyAR", response: response.result })
    }).fail(function (error) {
        var errorMsg = JSON.parse(error.message)
        console.error("Error uploading image to EasyAR - " + JSON.stringify(errorMsg))
        SlackWorker.sendErrorToSlack("Error uploading image to EasyAR - " + JSON.stringify(errorMsg))
        return res.status(400).json({ error: errorMsg })
    })
}