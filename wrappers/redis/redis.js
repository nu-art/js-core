/**
 * Created by tacb0ss on 07/07/2018.
 */

const Wrapper = require("../wrapper-core").Wrapper;

class RedisWrapper
	extends Wrapper {

	constructor() {
		super("redis");
	}

	_connect(callback) {
		this.client = require('redis').createClient(this.config.port, this.config.host);
	}

	_waitForConnectivity(callback) {
		this.client.on('connect', callback);
	}

	get(key, callback) {
		this.client.get(key, callback)
	}

	put(key, value, callback) {
		this.client.set(key, value, callback)
	}

	dropCache(callback) {
		this.client.flushall(callback);
	}
}

module.exports = RedisWrapper;