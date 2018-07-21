/**
 * Created by TacB0sS on 3/18/17.
 */

const BaseTest = require('./base-test');

class SleepTest
	extends BaseTest {

	constructor(sleepMs) {
		super("Sleeping for " + sleepMs + " ms");
		this.sleepMs = sleepMs;
	}

	execute(callback) {
		const now = new Date().getTime();
		//noinspection StatementWithEmptyBodyJS
		while (new Date().getTime() - now < this.sleepMs) {
			;
		}
		callback();
	}
}

module.exports = SleepTest;