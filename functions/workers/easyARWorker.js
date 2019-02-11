'use strict'

const config = require('../config.json');
const request = require('request');
const easyar_config = config.easyar_config;
const crypto = require('crypto');
const EasyARSDK = require('easyar');
var farmer = EasyARSDK.farmer(easyar_config.serverUrl, easyar_config.cloudKey, easyar_config.cloudSecret)

function genSign(params, appSecret) {
    var paramsStr = Object.keys(params).sort().map(function(key) {
        return key+params[key];
    }).join('') + appSecret;

    return crypto.createHash('sha1').update(paramsStr).digest('hex');
}

function signParams(params, appKey, appSecret) {
    params.timestamp = Math.floor(Date.now() / 1000);
    params.appKey = appKey;
    params.signature = genSign(params, appSecret);
    return params;
};

exports.uploadImageToEasyAR = function (req, res, next) {
    var params = {
        image: req.body.image,
        name: req.body.name,
        size: "20",
        meta: "JSON text",
        type: "ImageTarget",
    }
    var signedParams = signParams(params, easyar_config.cloudKey, easyar_config.cloudSecret);
    console.warn(signedParams);
    request({
        url: easyar_config.serverUrl + "/targets/",
        qs: signedParams,
        method: 'POST'
    }, function (error, response, body) {
		if (error) {
            console.trace(error);
			return res.status(404).json({ error: error });
		} else {
            console.trace(response.body);
			return res.status(200).json({ success: "Image is successfully uploaded to EasyAR" , response: response});
		}
    });
}

exports.testEasyAR = function(req, res, next) {
    farmer.createTarget({
        image: req.body.image,
        name: req.body.name,
        size: "20",
        meta: "",
        type: "ImageTarget"
    }).then(function(response) {
        console.warn(response.result.targetId);
        return res.json({});
    }).fail(function(err) {
        console.error(err);
        return res.json({});
    })
}