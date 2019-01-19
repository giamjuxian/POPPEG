'use strict'

var functions = require('firebase-functions')
var express = require('express')
var multer = require('multer')
var bodyParser = require('body-parser');
var databaseWorker = require('./databaseWorker')
var app = express()
var admin = require("firebase-admin")
var serviceAccount = require("../refreshar-c9d2f-firebase-adminsdk-5rxen-5c249a3823.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://refreshar-c9d2f.firebaseio.com"
});

app.use(bodyParser.urlencoded({extended: true}))

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })

// app.post('/sendImageToDatabase', upload.single('productImage'), function(req, res, next) {

// 	var file = req.file
// 	var fileName = req.body.fileName
// 	console.log("FILE", req.file);
// 	console.log("FILE NAME", fileName);
// 	return res.json({"fileName" : fileName});
// })

app.post('/profile', upload.single('avatar'), function (req, res, next) {
	console.log(req.files)
	res.send("Hello");
})

exports.app = functions.https.onRequest(app);
