'use strict'

const config = require('../config.json');
const request = require('request');
const easyar_config = config.easyar_config;
const crypto = require('crypto');
const EasyARSDK = require('easyar');
var farmer = EasyARSDK.farmer(easyar_config.serverUrl, easyar_config.cloudKey, easyar_config.cloudSecret);

exports.uploadImageToEasyAR = function(req, res, next) {
    farmer.createTarget({
        image: req.body.image,
        name: req.body.name,
        size: "20",
        meta: "",
        type: "ImageTarget"
    }).then(function(response) {
        console.log("Uploaded: " + response.result.targetId);
        return res.status(200).json({ success: "Image is successfully uploaded to EasyAR" , response: response.result});
    }).fail(function(error) {
        var errorMsg = JSON.parse(error.message);
        console.error("Error uploading image to  EasyAR - " + JSON.stringify(errorMsg));
        return res.status(400).json({ error: errorMsg });
    })
}