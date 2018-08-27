/**
 * Created by tacb0ss on 25/08/2018.
 */

const Wrapper = require('../wrapper-core').Wrapper;
const Logger = require('js-core').Logger;

class FirebaseSession
  extends Logger {
  constructor(config, email, password) {
    super("firebase: " + config.projectId);
    this.config = config;
    this.email = email;
    this.password = password;
    this.toExecute = [];
  }

  connect(firebase) {
    const config = this.config;
    this.app = firebase.initializeApp(config, config.id);
    firebase.auth(this.app).signInWithEmailAndPassword(this.email, this.password).then(() => {
      this.logInfo("---- Firebase session connected: " + config.id);
      this.db = this.app.database();
      this.executePending();
    }).catch(function (err) {
      this.executePending(err);
    });
  }

  executePending(err) {
    this.toExecute.forEach((toExecute) => {
      toExecute(err)
    });

    this.toExecute = [];
  }

  get(path, callback) {
    if (!this.db) {
      this.toExecute.push((err) => {
        if (err)
          return callback(err);

        this.get(path, callback);
      });
      return;
    }

    this.db.ref(path).once("value", (err, snapshot) => {
      if (err)
        return callback(err);

      callback(snapshot.val());
    });
  }

  set(path, value, callback) {
    if (!this.db) {
      this.toExecute.push((err) => {
        if (err)
          return callback(err);

        this.set(path, value, callback);
      });
      return;
    }

    this.db.ref(path).set(value, (err) => {
      if (err)
        return callback(err);

      callback();
    });
  }

  update(path, value, callback) {
    if (!this.db) {
      this.toExecute.push((err) => {
        if (err)
          return callback(err);

        this.update(path, value, callback);
      });
      return;
    }

    this.db.ref(path).update(value, (err) => {
      if (err)
        return callback(err);

      callback();
    });
  }
}

class Firebase
  extends Wrapper {

  constructor(tag) {
    super(tag || "firebase");
  }

  _connect(callback) {
    this.firebase = require('firebase');

    callback();
  }

  _waitForConnectivity(callback) {
    callback();
  }

  createSession(config, email, password) {
    const session = new FirebaseSession(config, email, password);
    session.connect(this.firebase);
    return session;
  }
}

module.exports = Firebase;
