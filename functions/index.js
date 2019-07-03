"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");
const express = require("express");
const engines = require("consolidate");
const config = require("./config.json");
const DatabaseWorker = require("./workers/databaseWorker");
const StorageWorker = require("./workers/storageWorker");
const VuforiaWorker = require("./workers/vuforiaWorker");
const EasyARWorker = require("./workers/easyARWorker");
const SlackWorker = require("./workers/slackWorker");
const database_config = config.database_config;

admin.initializeApp(functions.config().firebase);
firebase.initializeApp(database_config);

const app = express();
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

/**
 * Web Views
 */
app.get("/login", function(req, res, next) {
    res.render("loginpage");
});

app.get("/", function(req, res, next) {
    res.render("homepage");
});

app.get("/upload", function(req, res, next) {
    res.render("uploadpage");
});

app.get("/success", function(req, res, next) {
    res.render("successpage");
});

app.get("/signup", function(req, res, next) {
    res.render("signuppage");
});

/**
 * APIs
 */
app.post("/uploadImageToVuforia", VuforiaWorker.uploadImageToVuforia);

app.post("/uploadImageToEasyAR", EasyARWorker.uploadImageToEasyAR);

app.post("/addUrlsToDatabase", DatabaseWorker.uploadEntryToDatabase);

app.post("/uploadImageToStorage", StorageWorker.uploadImageToStorage);

app.post("/uploadVideoToStorage", StorageWorker.uploadVideoToStorage);

app.get("/checkAlbumExist", DatabaseWorker.checkAlbumExist);

app.get("/checkPopCodeExists", DatabaseWorker.checkPopCodeExists);

app.get("/addPopCode", DatabaseWorker.addPopCode);

app.post("/updatePopCode", DatabaseWorker.updatePopCode);

app.get("/getPopCodeData/:popCode", DatabaseWorker.getPopCodeData);

exports.app = functions.https.onRequest(app);
