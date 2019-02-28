/**
 * Created by tacb0ss on 14/08/2018.
 */


const Wrapper = require('../wrapper-core').Wrapper;

class GoogleStorage
	extends Wrapper {

	constructor() {
		super("google-storage");
	}

	_connect() {
		return new Promise((resolve, reject) => {
			try {
				const Storage = require('@google-cloud/storage').Storage;
				this.client = new Storage({
					projectId: this.config.projectId,
					keyFilename: this.config.pathToCredsFile,
				});
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	}

	_waitForConnectivity() {
		return new Promise((resolve) => {
			resolve();
		});
	}

	downloadFile(pathToRemoteFile, callback) {
	}

	getSecuredUrl(bucketName, originalFileName, pathToRemoteFile, contentType, expiresInSec, callback) {
		const options = {
			action: 'write',
			contentType: contentType,
			expires: Date.now() + expiresInSec * 1000,
		};

		this.client.bucket(bucketName).file(pathToRemoteFile).getSignedUrl(options)
			.then(results => {
				const url = results[0];

				callback(undefined, {
					originalFileName: originalFileName,
					fileName: pathToRemoteFile,
					securedUrl: url,
					publicUrl: encodeURI(`https://storage.googleapis.com/${bucketName}${pathToRemoteFile}`)
				});
			})

			.catch(err => {
				callback(err);
			});
	}

	makePublic(bucketName, fileName, callback) {
		return this.client.bucket(bucketName)
			.file(fileName)
			.makePublic();
	}
}

module.exports = GoogleStorage;


