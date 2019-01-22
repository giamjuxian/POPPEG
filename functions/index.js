const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const vuforia = require('vuforiajs');
const firebase = require('firebase');

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

var client = vuforia.client({
    'accessKey': '96fc90be4ba8d32c31d9a613cab5dc46d54ba81d',
    'secretKey': 'e389e18534680afd9bc9649dde032779b6e528b3',
    'clientAccessKey': '876180953382a439ffe6b4f613294548c9a65f1b',
    'clientSecretKey': '84ab566d52203a407d0cda6ed7d63db38d4275f8',
});
var util = vuforia.util();

var config = {
	apiKey: "AIzaSyAywhDGO_S_UY6HX_tlPPpjrFU3mkO6bQE",
	authDomain: "refreshar-c9d2f.firebaseapp.com",
	databaseURL: "https://refreshar-c9d2f.firebaseio.com/",
	storageBucket: "refreshar-c9d2f.appspot.com"
};
firebase.initializeApp(config);

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
	        return res.status(404).json({error: error});
	    } else {
	        return res.status(200).json({success: "Image is successfully uploaded"});
	    }
	});
})

app.post('/addUrlsToDatabase', function(req, res, next) {
	var entries = req.body.entries;
	var bookName = req.body.bookName;
	if (!bookName || bookName == "") {
		bookName = "empty";
	}
	firebase.database().ref('targets/' + bookName).set({
		entries : entries
	});
	res.status(200).json({success: "URLS is successfully added to database"});
})

exports.app = functions.https.onRequest(app);
