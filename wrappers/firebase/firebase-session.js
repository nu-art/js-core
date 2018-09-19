/**
 * Created by tacb0ss on 25/08/2018.
 */

const Logger = require('js-core').Logger;

class FirebaseSession
  extends Logger {
  constructor(config, auth) {
    super("firebase: " + config.projectId);
    this.config = config;
    this.auth = auth;
    this.toExecute = [];
  }

  connect(firebase) {
    this.auth.auth(firebase, this.config, (err, app) => {
      this.app = app;
      this.db = this.app.database();
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

    this.db.ref(path).once("value", (snapshot, err) => {
      if (err)
        return callback(err);

      callback(undefined, snapshot.val());
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

module.exports = FirebaseSession;
