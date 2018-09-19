/**
 * Created by tacb0ss on 19/09/2018.
 */

const FirebaseAuth = require("../firebase-auth");

class FirebaseAuth_UsernameAndPassword
  extends FirebaseAuth {

  constructor(username, password) {
    super();

    this.username = username;
    this.password = password;
  }

  auth(firebase, config, callback) {
    const app = firebase.initializeApp(config, config.id);
    firebase.auth(app).signInWithEmailAndPassword(this.username, this.password).then(() => {
      callback(undefined, app);
    }).catch(function (err) {
      callback(err);
    });
  }
}

module.exports = FirebaseAuth_UsernameAndPassword;
