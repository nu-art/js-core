/**
 * Created by tacb0ss on 25/08/2018.
 */

const Wrapper = require('../wrapper-core').Wrapper;
const FirebaseSession = require('./firebase-session');
const FirebaseAuth_Admin = require('./auth/auth-admin');
const FirebaseAuth_UsernameAndPassword = require('./auth/auth-user-pass');

class Firebase
	extends Wrapper {

	constructor(tag) {
		super(tag || "firebase");
		this.sessions = {};
	}

	_connect(callback) {
		callback();
	}

	_waitForConnectivity(callback) {
		callback();
	}

	createSessionWithUsernameAndPassword(configId, email, password) {
		let session = this.sessions[configId];
		if (session)
			return session;

		session = new FirebaseSession(this.config[configId], new FirebaseAuth_UsernameAndPassword(email, password));
		this.sessions[configId] = session;
		session.connect(require('firebase'));
		return session;
	}

	createAdminSession() {
		const configId = "admin";
		let session = this.sessions[configId];
		if (session)
			return session;

		session = new FirebaseSession(this.config[configId], new FirebaseAuth_Admin(this.config["admin"]));
		this.sessions[configId] = session;
		session.connect(require("firebase-admin"));
		return session;
	}
}

module.exports = Firebase;
