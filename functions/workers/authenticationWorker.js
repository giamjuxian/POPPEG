'use strict'

const firebase = require('firebase')
const admin = require('firebase-admin')
const SlackWorker = require('./slackWorker')

/**
 * Create new user with email and password
 */
exports.createUserWithEmail = function (req, res, next) {
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password

    admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: username,
    })
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord.uid);
            return res.status(200).json({
                message: "Successfully created user " + username + ".",
                username: username,
                email: email
            })
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).json({ 
                message: error.errorInfo.message,
                error: error 
            })
        });
}