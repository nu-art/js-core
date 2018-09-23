/**
 * Created by tacb0ss on 08/07/2018.
 */

const Logger = require("js-core").Logger;
const WrapperState = {
	Idle: "Idle",
	Connecting: "Connecting",
	Connected: "Connected",
	Disconnecting: "Disconnecting"
};

class Wrapper
	extends Logger {
	constructor(tag) {
		super(tag);
		this._setState(WrapperState.Idle);
	}

	setup(config) {
		if (!this._isState(WrapperState.Idle))
			throw new Error(`Client already in state ${this.state}`);

		this.config = config;
		return this;
	}

	_connect(callback) {
		throw new Error("Implementation missing");
	}

	_waitForConnectivity(callback) {
		throw new Error("Implementation missing");
	}

	start(callback) {
		if (this._isState(WrapperState.Idle)) {
			this._setState(WrapperState.Connecting);
			this._connect((err) => {
				if (err) {
					this.logError("Error starting.. " + err);
					return callback(err);
				}

				this._setState(WrapperState.Connected);
				callback();
			});
			// do not return here.. go to the connecting phase and wait till connected
		}

		// if the redis client is connecting
		if (this._isState(WrapperState.Connecting)) {
			if (callback)
				this._waitForConnectivity((err) => {
					callback(err, this);
				});
			return;
		}

		// if the redis client is connected
		if (callback)
			callback(undefined, this);
	}

	stop() {
		throw new Error("Implementation missing");
	}

	_setState(state) {
		if (this._isState(state))
			return;

		if (this.state)
			this.logInfo(`On State Changed: ${this.state} => ${state}`);

		this.state = state;
	}

	_isState(state) {
		return this.state === state;
	}
}

module.exports.State = WrapperState;
module.exports.Wrapper = Wrapper;