/**
 * Created by TacB0sS on 3/18/17.
 */

const BaseTest = require('./base-test');
const HttpRequestTest = require('./http-test');

class Scenario
	extends BaseTest {
	constructor(name, future) {
		super(name);
		this.index = 0;
		this.tests = [];
		this.failedTests = 0;

		if (future)
			future.bind(this);
		this.future = future;

	}

	getCurrentTest() {
		let test = this.tests[this.index];
		if (test instanceof Function) {
			test = test();
			this.validateTest(test);
			this.tests[this.index] = test;
		}

		return test;
	}

	addTest(test, scenarioResponseListener) {
		this.insertTest(this.tests.length, test, scenarioResponseListener);
	}

	injectTest(test, scenarioResponseListener) {
		this.insertTest(this.index + 1, test, scenarioResponseListener);
	}

	insertTest(index, test, scenarioResponseListener) {
		if (Array.isArray(test)) {
			test.forEach((test) => {
				this.insertTest(index++, test);
			});
			return;
		}

		if (!(test instanceof Function))
			this.validateTest(test, scenarioResponseListener);

		this.tests.splice(index, 0, test);
	}

	validateTest(test, scenarioResponseListener) {
		if (!(test instanceof BaseTest))
			throw new Error("test must be of type BaseTest!!");

		let testResponseListener;

		if (test.responseListener)
			testResponseListener = test.responseListener;

		test.responseListener = (response) => {
			if (testResponseListener)
				testResponseListener(response);

			if (scenarioResponseListener)
				scenarioResponseListener(response);
		};

	}

	execute(_callback) {
		super.started();
		if (this.future)
			this.future();

		this.logDebugBold("--------------------------------------- Scenario Started: " + this.name + " ---------------------------------------");

		let executeNext;
		let callback = (err) => {
			if (err) {
				this.failedTests++;
				this.logErrorBold("Error: ", err);
				this.logErrorBold("----------------- Ended with errors, took: " + (this.getCurrentTest().ended()) + "ms -----------------\n");
				this.index++;
				executeNext();
				return;
			}
			this.logVerboseBold("----------------- Ended successfully, took: " + (this.getCurrentTest().ended()) + "ms -----------------\n");
			this.index++;
			executeNext();
		};

		executeNext = () => {
			if (this.index < this.tests.length) {
				let test = this.getCurrentTest();
				test.started();
				this.logVerboseBold("----------------- Executing (" + (this.index + 1) + "/" + this.tests.length + "): " + test.getName());
				try {
					test.execute(callback, this);
				} catch (err) {
					if (_callback) {
						_callback(err);
						return;
					}
					this.logError("Error: ", err);
				}
				return;
			}

			let scenarioDuration = this.ended();
			if (this.failedTests > 0)
				this.logWarningBold("Failed Tests: " + this.failedTests + "/" + this.tests.length);

			this.logDebugBold("--------------------------------------- Scenario Ended: " + this.name + ", took " + scenarioDuration + "ms ---------------------------------------");
			if (_callback)
				_callback();

		};

		executeNext();
	}
}

module.exports = Scenario;