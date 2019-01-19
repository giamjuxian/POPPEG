const functions = require('firebase-functions');
const express = require('express');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const app = express();

app.get('/hello', function(req, res) {
	res.send("Hello Clarence");
})

app.get('/clarence', function(req, res) {
	res.send("Hello Jeffrey")
})

exports.app = functions.https.onRequest(app);
