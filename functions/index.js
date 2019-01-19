'use strict'

const functions = require('firebase-functions')
const express = require('express')
const multer = require('multer')
const databaseWorker = require('./databaseWorker')
const upload = multer({dest: '../uploads/'})
const app = express()

var admin = require("firebase-admin")
var serviceAccount = require("../refreshar-c9d2f-firebase-adminsdk-5rxen-5c249a3823.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://refreshar-c9d2f.firebaseio.com"
});

app.post('/sendImageToDatabase', upload.single('productImage'), databaseWorker.uploadImage)

exports.app = functions.https.onRequest(app);
