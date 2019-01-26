const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const vuforia = require('vuforiajs');
const firebase = require('firebase');
const engines = require('consolidate');
const config = require('./config.json');
const database_config = config.database_config;
const vuforia_config = config.vuforia_config;

admin.initializeApp(functions.config().firebase);
firebase.initializeApp(database_config);
var client = vuforia.client(vuforia_config);
var util = vuforia.util();

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', function (req, res, next) {
	res.render('login');
});

app.get('/uploadpage', function (req, res, next) {
	res.render('collections');
});

app.post('/vuforiaUpload', function (req, res, next) {
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
});

app.post('/addUrlsToDatabase', function (req, res, next) {
	var entries = req.body.entries;
	var bookName = req.body.bookName;
	if (!bookName || bookName == "") {
		bookName = "empty";
	}
	firebase.database().ref('targets/' + bookName).set({
		entries: entries
	})
	res.status(200).json({ success: "URLS is successfully added to database" });
});

app.get('/hello', function (req, res, next) {
	return res.status(200).send("Hello");
});

exports.app = functions.https.onRequest(app);
