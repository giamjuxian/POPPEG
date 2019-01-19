const functions = require('firebase-functions');
const express = require('express');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// load module
var vuforia = require('vuforiajs');

// init client with valid credentials
var client = vuforia.client({
    'accessKey': '4734be8d373164570b5ea5f5421c47df2845a64e',
    'secretKey': '7d0ea5b4190bc98dca2ed81f6384b069ae641610',
    'clientAccessKey': '0f207cbf4f3fab96dd48ea99e3a042bc798d9b0c',
    'clientSecretKey': 'f25ae10ca341c69c354e30a9c429b521020fc46e',
});

// util for base64 encoding and decoding
var util = vuforia.util();

const app = express();

app.post('/vuforiaUpload', function(req, res, next) {
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
	        res.status(404).json({error: error});
	    } else {
	        res.status(200).json({success: "Image is successfully uploaded"});
	    }
	});
})

exports.app = functions.https.onRequest(app);
