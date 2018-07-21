//noinspection JSUnresolvedVariable

const Wrapper = require('../wrapper-core').Wrapper;
const CollectionWrapper = require('./collection');

class MongoDB
	extends Wrapper {

	constructor() {
		super("mongo");
		this.waitingActions = [];
	}

	getCollectionInstance(name, callback) {
		this._connect((err, mongo) => {
			mongo.collection(name, callback);
		});
	}

	_connect(callback) {
		const url = `mongodb://${this.config.host}:${this.config.port}`;
		require('mongodb').MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
			if (!err)
				this.client = client.db(this.config.name);

			callback(err, this.client);
			this.waitingActions.forEach((callback) => {
				callback(err, this.client);
			})
		});
	}

	_waitForConnectivity(callback) {
		this.waitingActions.push(callback)
	}

	getCollection(name) {
		if (this[name])
			return this[name];

		return this[name] = new CollectionWrapper(this, name);
	}

	dropDatabase(callback) {
		this.logWarning("Dropping database");
		this._connect((err, mongo) => {
			if (err) {
				callback(err);
				return;
			}

			mongo.dropDatabase(() => {
				this.logWarning("Database dropped");
				callback();
			})
		});
	}
}

module.exports = MongoDB;


