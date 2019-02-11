'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const express = require('express');
const engines = require('consolidate');
const config = require('./config.json');
const DatabaseWorker = require('./workers/databaseWorker');
const StorageWorker = require('./workers/storageWorker');
const VuforiaWorker = require('./workers/vuforiaWorker');
const EasyARWorker = require('./workers/easyARWorker')
const database_config = config.database_config;

admin.initializeApp(functions.config().firebase);
firebase.initializeApp(database_config);

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');


/**
 * Web Views
 */
app.get('/', function (req, res, next) {
	res.render('loginpage');
});

app.get('/upload', function (req, res, next) {
	res.render('uploadpage');
});

/**
 * APIs
 */
app.post('/uploadImageToVuforia', VuforiaWorker.uploadImageToVuforia);

app.post('/uploadImageToEasyAR', EasyARWorker.testEasyAR);

app.post('/addUrlsToDatabase', DatabaseWorker.uploadEntryToDatabase);

app.post('/uploadImageToStorage', StorageWorker.uploadImageToStorage);

app.post('/uploadVideoToStorage', StorageWorker.uploadVideoToStorage);

exports.app = functions.https.onRequest(app);
