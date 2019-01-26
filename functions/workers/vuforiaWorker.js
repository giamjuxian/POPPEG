'use strict'

const config = require('../config.json');
const vuforia = require('vuforiajs');
const vuforia_config = config.vuforia_config;

var client = vuforia.client(vuforia_config);
var util = vuforia.util();

exports.uploadImageToVuforia = function (req, res, next) {
	var targetName = req.body.name;
	var width = 10;
	var targetImage = req.body.image;
	var target = {
		'name': targetName,
		'width': width,
		'image': targetImage,
		'active_flag': true,
	};
	client.addTarget(target, function (error, result) {
		if (error) {
			return res.status(404).json({ error: error });
		} else {
			return res.status(200).json({ success: "Image is successfully uploaded" });
		}
	});
}