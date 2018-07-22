/**
 * Created by tacb0ss on 17/07/2018.
 */

// Bucket names must be unique across all S3 users

const Wrapper = require('../wrapper-core').Wrapper;
var fs = require('fs');

class AWS_S3
	extends Wrapper {

	constructor() {
		super("aws-s3");
	}

	_connect(callback) {
		let AWS = require('aws-sdk');
		AWS.config.update({
			region: this.config.region,
			accessKeyId: this.config.accessKeyId,
			secretAccessKey: this.config.accessKeySecret,
			apiVersion: this.config.apiVersion
		});

		this.client = new AWS.S3();
		callback();
	}

	_waitForConnectivity(callback) {
		callback();
	}

	downloadFile(pathToRemoteFile, callback) {
		let params = {
			Bucket: `${this.config.bucketName}`,
			Key: pathToRemoteFile,
		};
		const fileStream = this.client.getObject(params).createReadStream();
		let paramsAsString = JSON.stringify(params);

		this.logDebug(`Started downloading file: ${paramsAsString}`);
		const chunks = [];
		fileStream.on("data", (chunk) => {
			chunks.push(chunk);
		});

		fileStream.on("error", (err) => {
			this.logError(`Error downloading file: ${paramsAsString}`);
			callback(err);
		});

		// Send the buffer or you can put it into a var
		fileStream.on("end", () => {
			this.logDebug(`Completed downloading file: ${paramsAsString}`);
			callback(null, Buffer.concat(chunks));
		});
	}

	uploadFile(pathToLocalFile, bucket, pathToRemoteFile, callback) {
		let body = fs.readFileSync(pathToLocalFile);
		let params = {
			Bucket: `${bucket || this.config.bucketName}`,
			Key: pathToRemoteFile,
			Body: body,
		};

		this.client.putObject(params, (err, data) => {
			this.logDebug(`Successfully uploaded file ${pathToLocalFile} => ${params.Bucket}/${params.Key}`);
			callback(err);
		});
	}
}

module.exports = AWS_S3;


