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
  }

  _connect(callback) {
    callback();
  }

  _waitForConnectivity(callback) {
    callback();
  }

  createSessionWithUsernameAndPassword(config, email, password) {
    const session = new FirebaseSession(this.config[config], new FirebaseAuth_UsernameAndPassword(email, password));
    session.connect(require('firebase'));
    return session;
  }

  createAdminSession() {
    const session = new FirebaseSession(this.config["admin"], new FirebaseAuth_Admin(this.config["admin"]));
    session.connect(require("firebase-admin"));
    return session;
  }
}

module.exports = Firebase;
