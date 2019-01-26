'use strict'

const firebase = require('firebase');

exports.uploadEntryToDatabase = function (req, res, next) {
	var entries = req.body.entries;
	var bookName = req.body.bookName;
	if (!bookName || bookName == "") {
		bookName = "empty";
	}
	firebase.database().ref('targets/' + bookName).set({
		entries: entries
	})
	res.status(200).json({ success: "URLS is successfully added to database" });
}