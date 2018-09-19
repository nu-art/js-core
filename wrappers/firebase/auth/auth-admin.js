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

  auth(firebase, app, callback) {

    var serviceAccount = require("path/to/serviceAccountKey.json");

    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: "https://test-fcm-fdcdc.firebaseio.com"
    });
    firebase.auth(app).signInWithEmailAndPassword(this.username, this.password).then(() => {
      callback();
    }).catch(function (err) {
      callback(err);
    });
  }
}

module.exports = FirebaseAuth_Admin;
