/**
 * Created by tacb0ss on 19/09/2018.
 */

const FirebaseAuth = require("../firebase-auth");

class FirebaseAuth_Admin
	extends FirebaseAuth {

	constructor(username, password) {
		super();

		this.username = username;
		this.password = password;
	}

	auth(firebase, config, callback) {

		const serviceAccount = JSON.parse(require("fs").readFileSync(config.pathToCredsFile));

		const app = firebase.initializeApp({
			credential: firebase.credential.cert(serviceAccount),
			databaseURL: config.databaseURL
		});

		callback(undefined, app);
	}
}

module.exports = FirebaseAuth_Admin;
