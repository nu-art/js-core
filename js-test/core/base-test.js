/**
 * Created by TacB0sS on 3/18/17.
 */
const DateTime = require('js-core').DateTime;
const Logger = require('js-core').Logger;

class BaseTest
	extends Logger {

	constructor(name) {
		super("stam");
		if (new.target === BaseTest)
			throw new TypeError((typeof BaseTest) + " is abstract!!");

		this.name = name;
	}

	started() {
		this.started = DateTime.currentTimeMillies();
	}

	setResponseListener(responseListener) {
		this.responseListener = responseListener;
	}

	execute(callback) {
		throw new Error("Abstract function!");
	}

	ended() {
		return DateTime.currentTimeMillies() - this.started;
	}

	getName() {
		return this.name;
	}
}

module.exports = BaseTest;