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

	listen(path, callback) {
		if (!this.db) {
			this.toExecute.push((err) => {
				if (err)
					return callback(err);

				this.listen(path, callback);
			});
			return;
		}
		const ref = this.db.ref(path);
		let listener = undefined;
		listener = ref.on("value", (snapshot, err) => {
			if (err)
				return callback(err);
			const handle = {ref: ref, listener: listener};
			callback(undefined, snapshot.val(), handle);
		});
	}

	stopListening(handle) {
		if (!handle || !handle.ref)
			return;
		(handle.ref).off("value", handle.listener)
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

	delete(path, callback) {
		if (!this.db) {
			this.toExecute.push((err) => {
				if (err)
					return callback(err);

				this.delete(path, callback);
			});
			return;
		}

		this.db.ref(path).remove((err) => {
			if (err)
				return callback(err);

			callback();
		});
	}

	sendMessage(token, message, callback) {
		if (!this.app) {
			this.toExecute.push((err) => {
				if (err)
					return callback(err);

				this.sendMessage(token, message, callback);
			});
			return;
		}

		this.app.messaging().send(Object.assign({data: message}, {token: token}))
				.then((response) => {
					callback(undefined, response);
				})
				.catch((error) => {
					callback(error);
				});
	}
}

module.exports = FirebaseSession;
