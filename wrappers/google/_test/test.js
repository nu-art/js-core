const JSTest = require("js-test");
const GoogleStorage = require("../storage");


class StorageTests {

	constructor(config) {
		if (!config)
			config = {
				"googleStorage": {
					"projectId": "test-fcm-fdcdc.appspot.com",
					"pathToCredsFile": "./dev-server-key.json"
				}
			};
		this.storage = new GoogleStorage().setup(config)
	};

	uploadFile(fileToUpload, storagePath) {
		return new JSTest.GenericTest("Upload File", () => {
			return new Promise((resolve, reject) => {
				console.log(`Uploading file... ${fileToUpload} => ${storagePath}`)
				resolve();
			});
		});
	}

	downloadFile() {

	}
}

new StorageTests()
	.uploadFile("form/pah", "to/zevel").execute()
	.then(() => {
		console.log("Success")
	});