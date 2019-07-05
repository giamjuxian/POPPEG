'use strict'

const firebase = require('firebase')
const admin = require('firebase-admin')
const SlackWorker = require('./slackWorker')

/**
 * Create new user with email and password
 */
exports.createUserWithEmail = function (req, res, next) {
    admin.auth().createUser({
        email: 'giam@poppeg.com',
        emailVerified: false,
        password: 'testtest',
        displayName: 'Giam Ju Xian',
    })
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord.uid);
            return res.status(200).json({ success: "yey" })
        })
        .catch(function (error) {
            console.log('Error creating new user:', error);
            return res.status(400).json({ error: error })
        });
}