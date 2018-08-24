/**
 * Created by tacb0ss on 08/07/2018.
 */

class CollectionWrapper {
	constructor(mongoInstance, name) {
		this.name = name;
		this.mongoInstance = mongoInstance;
	}

	insert(document, callback) {
		this.mongoInstance.getCollectionInstance(this.name, (err, collection) => {
			collection.insert(document, (err, result) => {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, result)
			});
		});
	}

	findById(docId, callback) {
		this.findOne({_id: docId}, callback);
	}

	findOne(query, callback) {
		this.mongoInstance.getCollectionInstance(this.name, function (err, collection) {
			collection.findOne(query, function (err, dbItem) {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, dbItem)
			});
		});
	}

	findByQuery(query, callback) {
		this.mongoInstance.getCollectionInstance(this.name, (err, collection) => {
			collection.find(query, (err, cursor) => {
				if (err) {
					callback(err);
					return;
				}

				cursor.toArray(callback)
			});
		});
	}

	updateById(document, callback) {
		this.updateByQuery({_id: document._id}, document, callback);
	}

	updateByQuery(query, document, callback) {
		this.mongoInstance.getCollectionInstance(this.name, function (err, collection) {
			collection.update(query, document, function (err, result) {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, result)
			});
		});
	}

	removeById(document, callback) {
		this.removeByQuery({_id: document._id}, document, callback);
	}

	removeByQuery(query, callback) {
		this.mongoInstance.getCollectionInstance(this.name, function (err, collection) {
			collection.remove(query, function (err, dbItem) {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, dbItem)
			});

		});
	}
}

module.exports = CollectionWrapper;