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

exports.checkAlbumTitleExists = function checkAlbumTitleExists(req, res, next) {
	// var ref = firebase.app().database().ref();
	// usersRef.once("value", function (snap) {
	// 	snap.forEach(function (childSnap) {
	// 		console.log("user", childSnap.val());
	// 	});
	// });
}
