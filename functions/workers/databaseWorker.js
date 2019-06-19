'use strict'

const firebase = require('firebase')
const SlackWorker = require('./slackWorker')

exports.uploadEntryToDatabase = function (req, res, next) {
	var entries = req.body.entries
	var bookName = req.body.bookName
	if (!bookName || bookName == "") {
		bookName = "empty"
	}
	firebase.database().ref('targets/' + bookName).set({
		entries: entries
	}).then(function () {
		res.status(200).json({ success: "URLS is successfully added to database" })
	}, function (err) {
		var errorMsg = "Error uploading entry to Database - " + err
		console.error(JSON.stringify(errorMsg))
		SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
		return res.status(400).json({ error: errorMsg })
	})
}

exports.checkAlbumExist = function (req, res, next) {
	var albumName = req.query.albumName
	var containsDuplicate = false
	var ref = firebase.app().database().ref()
	ref.once("value").then(function (snap) {
		snap.child("targets").forEach(function (childSnap) {
			if (albumName == childSnap.key) {
				containsDuplicate = true
			}
		})
		return res.status(200).json({ containsDuplicate: containsDuplicate })
	}, function (err) {
		var errorMsg = "Error checking Album - " + err
		console.error(JSON.stringify(errorMsg))
		SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
		return res.status(400).json({ error: err })
	})
}

exports.checkPopCodeExists = function (req, res, next) {
	var popCode = req.query.popCode
	var popCodeExists = false
	var ref = firebase.app().database().ref()
	ref.once("value").then(function (snap) {
		snap.child("popCode").forEach(function (childSnap) {
			if (popCode == childSnap.key) {
				popCodeExists = true
			}
		})
		return res.status(200).json({ popCodeExists: popCodeExists })
	}, function (err) {
		var errorMsg = "Error checking POPCode - " + err
		console.error(JSON.stringify(errorMsg))
		SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
		return res.status(400).json({ error: err })
	})
}

exports.addPopCode = function (req, res, next) {
	var popCode = req.query.popCode
	var numberOfImages = parseInt(req.query.numberOfImages)
	var ref = firebase.app().database().ref("popCode/" + popCode)
	ref.set({
		numberOfImages: numberOfImages,
		numberOfImagesUsed: 0
	}).then(function () {
		return res.status(200).json({
			success: "Successfully added POPCode",
			popCode: popCode,
			numberOfImages: numberOfImages
		})
	}, function (err) {
		var errorMsg = "Error adding POPCode - " + err
		console.error(JSON.stringify(errorMsg))
		SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
		return res.status(400).json({ error: err })
	})
}

exports.updatePopCode = function (req, res, next) {
	var popCode = req.body.popCode
	var numberOfImagesUsed = req.body.numberOfImagesUsed
	var ref = firebase.app().database().ref("popCode/" + popCode)
	ref.once("value").then(function (snap) {
		var numberOfImages = snap.val().numberOfImages
		var currentNumberOfImagesUsed = snap.val().numberOfImagesUsed
		var newNumberOfImagesUsed = parseInt(currentNumberOfImagesUsed) + parseInt(numberOfImagesUsed)
		if (newNumberOfImagesUsed > numberOfImages) {
			var errorMsg = "Error updating POPCode - Number of images used exceeded - " + err
			console.error(JSON.stringify(errorMsg))
			SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
			return res.status(400).json({ error: "Number of images used exceeded" })
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
			var errorMsg = "Error updating POPCode - " + err
			console.error(JSON.stringify(errorMsg))
			SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
			return res.status(400).json({ error: err })
		})
	}, function (err) {
		var errorMsg = "Error updating POPCode - " + err
		console.error(JSON.stringify(errorMsg))
		SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
		return res.status(400).json({ error: err })
	})
}

exports.getPopCodeData = function (req, res, next) {
	var popCode = req.params.popCode
	var ref = firebase.app().database().ref("popCode/" + popCode)
	ref.once("value").then(function (snap) {
		var numberOfImages = snap.val().numberOfImages
		var numberOfImagesUsed = snap.val().numberOfImagesUsed
		return res.status(200).json({
			success: "PopCode data retrieved",
			popCode: popCode,
			numberOfImages: numberOfImages,
			numberOfImagesUsed: numberOfImagesUsed
		})
	}, function (err) {
		var errorMsg = "Error retrieving POPCode Data - " + err
		console.error(JSON.stringify(errorMsg))
		SlackWorker.sendErrorToSlack(JSON.stringify(errorMsg))
		return res.status(400).json({ error: err })
	})
}
