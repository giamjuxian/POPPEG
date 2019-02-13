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

exports.checkAlbumExist = function (req, res, next) {
	var albumName = req.query.albumName;
	var containsDuplicate = false;
	var ref = firebase.app().database().ref();
	ref.once("value").then(function (snap) {
		snap.child("targets").forEach(function (childSnap) {
			if (albumName == childSnap.key) {
				containsDuplicate = true;
			}
		});
		return res.status(200).json({ containsDuplicate: containsDuplicate });
	}, function (err) {
		return res.status(400).json({ error: err });
	})
}

exports.checkPopCodeExists = function (req, res, next) {
	var popCode = req.query.popCode;
	var popCodeExists = false;
	var ref = firebase.app().database().ref();
	ref.once("value").then(function (snap) {
		snap.child("popCode").forEach(function (childSnap) {
			if (popCode == childSnap.key) {
				popCodeExists = true;
			}
		});
		return res.status(200).json({ popCodeExists: popCodeExists });
	}, function (err) {
		return res.status(400).json({ error: err });
	})
}

exports.addPopCode = function (req, res, next) {
	var popCode = req.query.popCode;
	var numberOfImages =  parseInt(req.query.numberOfImages);
	var ref = firebase.app().database().ref("popCode/" + popCode);
	ref.set({
		numberOfImages: numberOfImages,
		numberOfImagesUsed: 0
	}).then(function () {
		return res.status(200).json({
			success: "Successfully added POPCode",
			popCode: popCode,
			numberOfImages: numberOfImages
		});
	}, function (err) {
		return res.status(400).json({ error: err });
	})
}

exports.updatePopCode = function (req, res, next) {
	var popCode = req.body.popCode;
	var numberOfImagesUsed = req.body.numberOfImagesUsed;
	var ref = firebase.app().database().ref("popCode/" + popCode);
	ref.once("value").then(function (snap) {
		var numberOfImages = snap.val().numberOfImages;
		var currentNumberOfImagesUsed = snap.val().numberOfImagesUsed;
		var newNumberOfImagesUsed = parseInt(currentNumberOfImagesUsed) + parseInt(numberOfImagesUsed);
		console.log("NUMBER: " + newNumberOfImagesUsed);
		if (newNumberOfImagesUsed > numberOfImages) {
			return res.status(400).json({ error: "Number of images used exceeded" });
		}
		ref.set({
			numberOfImages: numberOfImages,
			numberOfImagesUsed: newNumberOfImagesUsed
		}).then(function () {
			return res.status(200).json({
				success: "Successfully updated POPCode",
				popCode: popCode,
				numberOfImages: numberOfImages,
				numberOfImagesUsed: newNumberOfImagesUsed
			})
		}, function (err) {
			console.error(err);
			return res.status(400).json({ error: err });
		})
	}, function (err) {
		return res.status(400).json({ error: err });
	})
}

exports.getPopCodeData = function (req, res, next) {
	var popCode = req.params.popCode;
	var ref = firebase.app().database().ref("popCode/" + popCode);
	ref.once("value").then(function (snap) {
		var numberOfImages = snap.val().numberOfImages;
		var numberOfImagesUsed = snap.val().numberOfImagesUsed;
		return res.status(200).json({
			success: "PopCode data retrieved",
			popCode: popCode,
			numberOfImages: numberOfImages,
			numberOfImagesUsed: numberOfImagesUsed
		})
	}, function (err) {
		return res.status(400).json({ error: err });
	})
}
