'use strict'

const config = require('../config.json')
const request = require('request')
const easyar_new_config = config.easyar_new_config
const crypto = require('crypto')
const EasyARSDK = require('easyar')
const SlackWorker = require('./slackWorker')
var farmer = EasyARSDK.farmer(easyar_new_config.serverUrl, easyar_new_config.cloudKey, easyar_new_config.cloudSecret)

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