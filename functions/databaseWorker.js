'use strict'

const keyFilename ="../refreshar-c9d2f-firebase-adminsdk-5rxen-5c249a3823.json"; //replace this with api key file
const projectId = "refreshar-c9d2f" //replace with your project id
const bucketName = `${projectId}.appspot.com`;
var uploadFolder = `images`;


const gcs = require('@google-cloud/storage')({
    projectId,
    keyFilename
});

const bucket = gcs.bucket(bucketName);

exports.uploadImage = function(req, res, next) {
	var file = req.file
	var fileName = req.body.imageName
	return res.send(fileName)
	// var fileName = req.query.imageName
	// var uploadTo = uploadFolder + '/' + fileName

	// bucket.upload("../images/mountains.jpeg",
	// { 	destination: uploadTo, 
	// 	public:true, 
	// 	metadata: {contentType: "image/jpeg" ,cacheControl: "public, max-age=300"}
	// }, function(err, file) {
	//     if(err) return res.send(err);
	//     res.send(createPublicFileURL(uploadTo));
	// });
}

function createPublicFileURL(storageName) {
    return `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`;
}