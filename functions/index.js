"use strict"

const functions = require("firebase-functions")
const admin = require("firebase-admin")
const firebase = require("firebase")
const express = require("express")
const engines = require("consolidate")
const config = require("./config.json")
const AuthenticationWorker = require("./workers/authenticationWorker")
const DatabaseWorker = require("./workers/databaseWorker")
const StorageWorker = require("./workers/storageWorker")
const VuforiaWorker = require("./workers/vuforiaWorker")
const EasyARWorker = require("./workers/easyARWorker")
const SlackWorker = require("./workers/slackWorker")
const StagingServiceAccount = require("./poppeg-staging-firebase-adminsdk-5tor8-700b0612c1.json")
const ServiceAccount = require("./poppeg-95e96-firebase-adminsdk-eu7uh-d9fec6c314.json")

/**
 * Initialization
 */
// Show Project Settings

// Database Configurations
if (process.env.GCP_PROJECT == "poppeg-95e96") {
    console.log("========= PROJECT: " + process.env.GCP_PROJECT + " =========")
    var database_config = config.database_config
    admin.initializeApp({
        credential: admin.credential.cert(ServiceAccount),
        databaseURL: database_config.databaseURL
    });
} else if (process.env.GCP_PROJECT == "poppeg-staging") {
    console.log("========= PROJECT: " + process.env.GCP_PROJECT + " =========")
    var database_config = config.staging_database_config
    admin.initializeApp({
        credential: admin.credential.cert(StagingServiceAccount),
        databaseURL: database_config.databaseURL
    });
}
// Initialize Firebase
// firebase.initializeApp(database_config)

// Express Configurations
const app = express()
app.engine("hbs", engines.handlebars)
app.set("views", "./views")
app.set("view engine", "hbs")


/**
 * Web Views
 */
app.get("/login", function (req, res, next) {
    res.render("loginpage")
})

app.get("/", function (req, res, next) {
    res.render("homepage")
})

app.get("/upload", function (req, res, next) {
    res.render("uploadpage")
})

app.get("/success", function (req, res, next) {
    res.render("successpage")
})


/**
 * APIs
 */
// Vuforia
app.post("/uploadImageToVuforia", VuforiaWorker.uploadImageToVuforia)

// EasyAR
app.post("/uploadImageToEasyAR", EasyARWorker.uploadImageToEasyAR)

// Database
app.get("/checkAlbumExist", DatabaseWorker.checkAlbumExist)

app.get("/checkPopCodeExists", DatabaseWorker.checkPopCodeExists)

app.get("/addPopCode", DatabaseWorker.addPopCode)

app.get("/getPopCodeData/:popCode", DatabaseWorker.getPopCodeData)

app.post("/addUrlsToDatabase", DatabaseWorker.uploadEntryToDatabase)

app.post("/updatePopCode", DatabaseWorker.updatePopCode)

// Storage
app.post("/uploadImageToStorage", StorageWorker.uploadImageToStorage)

app.post("/uploadVideoToStorage", StorageWorker.uploadVideoToStorage)

// Authentication
app.get("/createNewUser", AuthenticationWorker.createUserWithEmail)


exports.app = functions.https.onRequest(app)
